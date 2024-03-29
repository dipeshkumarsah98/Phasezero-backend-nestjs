import { Injectable, Logger, ParseBoolPipe } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentDto } from 'src/payments/dto/payment.dto';
import { MailService } from 'src/mailer/mailer.service';
import { PAYMENT_METHOD } from 'src/payments/payment.gateways';
import { ProductsService } from 'src/products/products.service';
import { FilterOrderDto } from './dto/filter-order.dto';

@Injectable()
export class OrdersService {
  private readonly _logger = new Logger('Order Services');
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailService,
    private readonly productService: ProductsService,
  ) {}

  async getOrders(filters: FilterOrderDto) {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          isPaid: filters.isPaid === 'true' ? true : false,
          isDelivered: filters.isDelivered === 'true' ? true : false,
          deliveryType: filters.type,
          productId: filters.productId,
          color: filters.color,
          size: filters.size,
        },
        include: {
          user: true,
        },
      });

      const newOrders = new Promise(async (resolve, reject) => {
        try {
          for (let order of orders) {
            const product = await this.prisma.product.findFirst({ where: { id: order.productId } });
            order['product'] = product;
          }
          resolve(orders);
        } catch (error) {
          reject(error);
        }
      });
      return await newOrders;
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching orders');
    }
  }

  public async confirmOrder(data: { transaction_uuid: string; transaction_code: string }) {
    const { transaction_code, transaction_uuid } = data;

    try {
      const order = await this.prisma.order.update({
        where: {
          id: transaction_uuid,
        },
        data: {
          isPaid: true,
          transactionCode: transaction_code,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      await this.productService.updateStock({
        color: order.color,
        productId: order.productId,
        quantity: order.quantity,
        size: order.size,
      });

      this.mailerService.confirmOrder({ email: order.user.email, name: order.user.name });
      // send email confirmation to user
      return order;
    } catch (error) {
      console.log(error);
    }
  }

  async createOrder(order: OrderDto & PaymentDto) {
    this._logger.log(`Creating order for user ${order.email}`);
    try {
      let createdOrder;
      await this.prisma.$transaction(async prisma => {
        const user = await prisma.newUser.create({
          data: {
            email: order.email,
            address: order.address,
            name: order.name,
            phone: order.phone,
          },
        });
        createdOrder = await prisma.order.create({
          data: {
            user: { connect: { id: user.id } },
            color: order.color,
            size: order.size,
            quantity: order.quantity,
            discount: order.discount,
            discountCupon: order.discountCode,
            price: order.amount,
            deliveryType: order.paymentMethod,
            isDelivered: false,
            isPaid: false,
            total: order.totalAmount,
            transactionCode: null,
            product: { connect: { id: order.productId } },
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
      });
      if (order.paymentMethod === PAYMENT_METHOD.COD) {
        await this.productService.updateStock({
          color: order.color,
          productId: order.productId,
          quantity: order.quantity,
          size: order.size,
        });

        this.mailerService.confirmOrder({
          email: createdOrder.user.email,
          name: createdOrder.user.name,
        });
      }
      return createdOrder;
    } catch (error) {
      console.log(error);
    }
  }
}

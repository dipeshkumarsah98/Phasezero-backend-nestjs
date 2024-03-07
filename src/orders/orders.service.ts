import { Injectable, Logger } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentDto } from 'src/payments/dto/payment.dto';
import { MailService } from 'src/mailer/mailer.service';
import { PAYMENT_METHOD } from 'src/payments/payment.gateways';

@Injectable()
export class OrdersService {
  private readonly _logger = new Logger('Order Services');
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailService,
  ) {}

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

import { Injectable, Logger } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentDto } from 'src/payments/dto/payment.dto';

@Injectable()
export class OrdersService {
  private readonly _logger = new Logger('Order Services');
  constructor(private prisma: PrismaService) {}

  public async confirmOrder(data: { transaction_uuid: string; transaction_code: string }) {
    const { transaction_code, transaction_uuid } = data;

    try {
      const user = await this.prisma.order.update({
        where: {
          id: transaction_uuid,
        },
        data: {
          isPaid: true,
          transactionCode: transaction_code,
        },
      });
      // send email confirmation to user
      return user;
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
        });
      });
      return createdOrder;
    } catch (error) {
      console.log(error);
    }
  }
}

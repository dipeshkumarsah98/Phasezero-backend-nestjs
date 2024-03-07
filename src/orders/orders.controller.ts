import { Body, Controller, Post, Query, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PaymentService } from 'src/payments/payments.service';
import { ESEWAGateway, PAYMENT_METHOD, CODGateway } from 'src/payments/payment.gateways';
import { OrderDto } from './dto/order.dto';
import { PaymentDto } from 'src/payments/dto/payment.dto';
import { Public } from 'src/common/decorators/public.decorator';
import createSignature from 'src/utils/signature';

@Controller('/orders')
export class OrdersController {
  constructor(
    private paymentService: PaymentService,
    private readonly ordersService: OrdersService,
  ) {
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.ESEWA, new ESEWAGateway());
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.COD, new CODGateway());
  }

  @Public()
  @Post()
  async submitOrder(@Body() order: OrderDto & PaymentDto) {
    const newOrder = await this.ordersService.createOrder(order);

    const formData = await this.paymentService.processPayment({
      ...order,
      transactionId: newOrder.id,
    });

    return formData;
  }

  @Public()
  @Post('/confirm')
  async confirmOrder(@Query('data') data: any) {
    if (!data) {
      throw new Error('No query data found');
    }

    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

    if (decodedData?.status !== 'COMPLETE') {
      throw new Error('Payment Failed');
    }

    const message = decodedData?.signed_field_names
      .split(',')
      .map(field => `${field}=${decodedData[field] || ''}`)
      .join(',');

    const signature = createSignature(message);

    if (signature !== decodedData?.signature) {
      throw new Error('Payment Failed');
    }

    const body = {
      transaction_uuid: decodedData?.transaction_uuid,
      transaction_code: decodedData?.transaction_code,
    };
    return await this.ordersService.confirmOrder(body);
  }
}

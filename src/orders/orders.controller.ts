import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PaymentService } from 'src/payments/payments.service';
import { ESEWAGateway, PAYMENT_METHOD, CODGateway } from 'src/payments/payment.gateways';
import { OrderDto } from './dto/order.dto';
import { PaymentDto } from 'src/payments/dto/payment.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FilterOrderDto } from './dto/filter-order.dto';

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
  @Get()
  async getOrders(@Query() filterOrderDto: FilterOrderDto) {
    return await this.ordersService.getOrders(filterOrderDto);
  }

  @Public()
  @Get('/confirm')
  async confirmOrder(@Query('data') data: any) {
    if (!data) {
      throw new Error('No query data found');
    }

    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

    if (decodedData?.status !== 'COMPLETE') {
      throw new Error('Payment is Not complete');
    }

    // const message = decodedData?.signed_field_names
    //   .split(',')
    //   .map(field => {
    //     // if (field === 'total_amount' || field === 'transaction_uuid' || field === 'product_code')
    //     return `${field}=${decodedData[field] || ''}`;
    //   })
    //   .join(',');

    // let msg = '';

    // message.forEach(element => {
    //   if (element === undefined) {
    //     return;
    //   }
    //   return (msg += element + ',');
    // });

    // const signature = createSignature(
    //   `total_amount=1925,transaction_uuid=d1cee3b6-133f-4096-96c9-942649843045,product_code=EPAYTEST`,
    // );

    // if (signature !== decodedData?.signature) {
    //   throw new Error('Payment Failed: Invalid signature');
    // }

    const body = {
      transaction_uuid: decodedData?.transaction_uuid,
      transaction_code: decodedData?.transaction_code,
    };
    return await this.ordersService.confirmOrder(body);
  }
}

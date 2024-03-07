import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { IsNumber } from 'class-validator';
import { PaymentService } from 'src/payments/payments.service';
import { ESEWAGateway, PAYMENT_METHOD, CODGateway } from 'src/payments/payment.gateways';

class SubmitOrderDto {
  @IsNumber()
  productId: number;
}

@Controller('/orders')
export class OrdersController {
  constructor(private paymentService: PaymentService) {
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.ESEWA, new ESEWAGateway());
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.COD, new CODGateway());
  }
}

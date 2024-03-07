import { Injectable, Logger } from '@nestjs/common';
import { PaymentGateway, PAYMENT_METHOD } from './payment.gateways';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  private paymentGateways: Record<string, PaymentGateway> = {};
  private readonly _logger = new Logger('Payment Services');

  public registerPaymentGateway(paymentMethod: PAYMENT_METHOD, gateway: PaymentGateway) {
    this.paymentGateways[paymentMethod] = gateway;
  }

  public async processPayment(paymentDto: PaymentDto & { transactionId: string }) {
    const gateway = this.paymentGateways[paymentDto.paymentMethod];

    this._logger.log(
      `Processing payment for user ${paymentDto.transactionId} using ${paymentDto.paymentMethod}`,
    );

    if (gateway) {
      return gateway.processPayment(paymentDto);
    } else {
      throw new Error('Unsupported payment method!');
    }
  }
}

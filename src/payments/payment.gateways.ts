import createSignature from 'src/utils/signature';
import { PaymentDto } from './dto/payment.dto';

export abstract class PaymentGateway {
  abstract processPayment(
    order: PaymentDto & {
      transactionId: string;
    },
  ): void;
}

export class ESEWAGateway implements PaymentGateway {
  processPayment(order: PaymentDto & { transactionId: string }): any {
    const { amount, deliveryCharge, totalAmount, transactionId } = order;

    const productCode = process.env.ESEWA_PRODUCT_CODE;
    const signature = createSignature(
      `total_amount=${amount},transaction_uuid=${transactionId},product_code=${productCode}`,
    );
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    const formData = {
      amount: amount,
      failure_url: clientUrl,
      product_delivery_charge: deliveryCharge,
      product_service_charge: '0',
      product_code: productCode,
      signature: signature,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      // success_url: `${baseUrl}/api/v1/esewa/success`,
      success_url: `${clientUrl}/success`,
      tax_amount: '0',
      total_amount: totalAmount,
      transaction_uuid: transactionId,
    };

    return formData;
  }
}

export class CODGateway implements PaymentGateway {
  processPayment(
    order: PaymentDto & {
      transactionId: string;
    },
  ): any {
    return {
      message: 'Order placed successfully',
    };
  }
}

export enum PAYMENT_METHOD {
  ESEWA = 'esewa',
  COD = 'cash-on-delivery',
}

import { Order } from '@prisma/client';
import createSignature from 'src/utils/signature';

export abstract class PaymentGateway {
  abstract processPayment(order: Order): void;
}

export class ESEWAGateway implements PaymentGateway {
  processPayment(order: Order) {
    // Process esewa  payment
    const signature = createSignature(
      `total_amount=${order.amount},transaction_uuid=${uuid},product_code=${productCode}`,
    );
    const formData = {
      amount: req.body.amount,
      failure_url: clientUrl,
      product_delivery_charge: '0',
      product_service_charge: '0',
      product_code: productCode,
      signature: signature,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      // success_url: `${baseUrl}/api/v1/esewa/success`,
      success_url: `${clientUrl}/success`,
      tax_amount: '0',
      total_amount: order.amount,
      transaction_uuid: uuid,
    };
    return formData;
  }
}

export class CODGateway implements PaymentGateway {
  processPayment(order: Order): void {
    // Process cod payment
  }
}

export enum PAYMENT_METHOD {
  ESEWA = 'esewa',
  COD = 'cash-on-delivery',
}

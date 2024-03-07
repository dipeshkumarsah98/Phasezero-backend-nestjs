import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { PAYMENT_METHOD } from '../payment.gateways';

export class PaymentDto {
  @IsNumber()
  @ApiProperty({
    description: 'Total amount of the order',
    example: 1000,
  })
  totalAmount: number;

  @IsNumber()
  @ApiProperty({
    description: 'Delivery charge of the order',
    example: 100,
  })
  amount: number;

  @IsNumber()
  @ApiProperty({
    description: 'Delivery charge of the order',
    example: 100,
  })
  deliveryCharge: number;

  @IsString()
  @ApiProperty({
    description: 'Payment method used for the order',
    example: 'COD | ESEWA',
  })
  paymentMethod: PAYMENT_METHOD;
}

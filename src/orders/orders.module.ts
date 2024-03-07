import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaymentService } from 'src/payments/payments.service';
import { MailModule } from 'src/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [MailModule, ConfigModule.forRoot()],
  controllers: [OrdersController],
  providers: [OrdersService, PaymentService, ProductsService],
})
export class OrdersModule {}

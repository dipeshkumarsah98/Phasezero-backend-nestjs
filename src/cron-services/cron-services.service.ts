import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class CronServicesService {
  constructor(private prisma: PrismaService) {}
  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'validatePayments',
  })
  async cronjob() {
    // const orders = await this.prisma.order.findMany({
    //   where: {
    //     deliveryType: 'esewa',
    //   },
    // });
    try {
      const response = await axios.get(
        `https://epay.esewa.com.np/api/epay/transaction/status/?product_code=NP-ES-TEAMELEM&total_amount=2125&transaction_uuid=d0def21f-4174-4450-bc31-3ba2bf86483e`,
      );
      const status: PaymentStatus = response?.data?.status;
      this.handlePaymentStatus(status);
    } catch (error) {
      console.log('Error wile Syncing Payment Status', error);
    }
  }
  private async handlePaymentStatus(status: PaymentStatus) {
    switch (status) {
      case PaymentStatus.SUCCESS:
        break;
      case PaymentStatus.PENDING:
        break;
      case PaymentStatus.FAILED:
        break;
      default:
        break;
    }
  }
}

enum PaymentStatus {
  SUCCESS = 'COMPLETE',
  PENDING = 'PENDING',
  FAILED = 'CANCELED',
  NOT_FOUND = 'NOT_FOUND',
  AMBIGUOUS = 'AMBIGUOUS',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
  FULL_REFUND = 'FULL_REFUND',
}

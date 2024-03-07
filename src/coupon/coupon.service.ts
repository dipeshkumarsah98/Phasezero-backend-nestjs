import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class CouponService {
  private readonly _logger = new Logger('Coupon Services');
  constructor(private prisma: PrismaService) {}

  async checkCoupon(couponCode: string) {
    this._logger.log(`Checking coupon: ${couponCode}`);
    // const isValid = await this.prisma.user.findFirst({
    //   where: {
    //     isPaid: true,
    //     transactionCode: couponCode,
    //     isValid: true,
    //   },
    // });
    const isValid = couponCode.toLocaleUpperCase() === 'MYSTERY20' ? true : false;

    if (isValid) {
      this._logger.log(`Coupon is valid: ${couponCode}`);
      // await this.prisma.user.update({
      //   where: { id: isValid.id },
      //   data: { isValid: false },
      // });
      return { success: true, discount: 20, msg: 'Coupon is valid' };
    }

    if (!isValid) {
      throw new BadRequestException('Coupon is invalid');
    }
  }
}

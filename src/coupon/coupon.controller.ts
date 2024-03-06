import { Controller, Get, Query } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('coupon')
@ApiBearerAuth('access-token')
@ApiTags('Coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Check coupon' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CouponService],
  })
  findOne(@Query('code') couponCode: string) {
    if (!couponCode) throw new Error('Coupon code is required');

    return this.couponService.checkCoupon(couponCode);
  }
}

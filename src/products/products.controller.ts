import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productServie: ProductsService) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Check coupon' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  findOne(@Param('id') id: string) {
    if (!id) throw new BadRequestException('id is required');

    return this.productServie.findOne(id);
  }

  @Public()
  @Get()
  findAll() {
    return this.productServie.findAll();
  }
}

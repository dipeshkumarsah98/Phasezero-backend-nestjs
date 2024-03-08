import { IsOptional, IsString } from 'class-validator';

export class FilterOrderDto {
  @IsString()
  @IsOptional()
  isPaid: string;

  @IsString()
  @IsOptional()
  isDelivered: string;

  @IsString()
  @IsOptional()
  // type means delivery type i.e "esewa" || 'cash on d
  type: string;

  @IsString()
  @IsOptional()
  productId: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  size: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, IsUUID } from 'class-validator';

export class OrderDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the customer',
    example: 'John Doe',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email of the customer',
    example: 'dipesh@gmail.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Phone number of the customer',
    example: '9801234567',
  })
  phone: string;

  @IsString()
  @ApiProperty({
    description: 'Address of the customer',
    example: 'Kathmandu, Nepal',
  })
  address: string;

  @IsUUID()
  @ApiProperty({
    description: 'Id of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productId: string;

  @IsString()
  @ApiProperty({
    description: 'Color of the product',
    example: 'red',
  })
  color: string;

  @IsString()
  @ApiProperty({
    description: 'Size of the product',
    example: 'M',
  })
  size: string;

  @IsString()
  @ApiProperty({
    description: 'Quantity of the product',
    example: '2',
  })
  quantity: number;

  @IsNumber()
  @ApiProperty({
    description: 'Discount on the product',
    example: 10,
  })
  discount: number;

  @IsString()
  @ApiProperty({
    description: 'Discount code of the product',
    example: '10OFF',
  })
  discountCode: string;
}

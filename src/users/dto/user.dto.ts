import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@doe.com',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Full Name of the user',
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Phone number of the user',
    example: '9123456789',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Address of the user',
    example: '123, Main Street, New York',
  })
  address: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

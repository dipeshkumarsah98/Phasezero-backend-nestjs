import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatProduct, formatProducts } from 'src/utils/product-format';

@Injectable()
export class ProductsService {
  private readonly _logger = new Logger('products Services');
  constructor(private prisma: PrismaService) {}

  async findAll() {
    this._logger.log(`Getting products`);
    const products = await this.prisma.product.findMany({
      include: {
        stock: {
          select: {
            id: true,
            color: true,
            size: true,
            quantity: true,
          },
        },
      },
    });
    return formatProducts(products);
  }

  async findOne(id: string) {
    this._logger.log(`Getting product with id: ${id}`);
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        stock: {
          select: {
            id: true,
            color: true,
            size: true,
            quantity: true,
          },
        },
      },
    });
    return formatProduct(product);
  }
}

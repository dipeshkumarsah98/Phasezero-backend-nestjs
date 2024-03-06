import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  async updateStock({
    color,
    productId,
    quantity,
    size,
  }: {
    color: string;
    size: string;
    quantity: number;
    productId: string;
  }) {
    this._logger.log(`Updating stock for product with id: ${productId}`);
    const colorObj = await this.prisma.color.findFirst({
      where: {
        color,
      },
    });

    if (!colorObj) {
      throw new BadRequestException('Color not found');
    }
    const sizeObj = await this.prisma.size.findFirst({ where: { size } });

    if (!sizeObj) {
      throw new BadRequestException('Size not found');
    }
    const stock = await this.prisma.stock.findFirst({
      where: {
        productId,
        colorId: colorObj.id,
        sizeId: sizeObj.id,
      },
      include: {
        product: {
          select: {
            productName: true,
          },
        },
      },
    });
    if (!stock) {
      throw new BadRequestException('Stock not found');
    }

    const updatedStock = await this.prisma.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    return {
      oldStock: stock,
      newStock: updatedStock,
    };
  }
}

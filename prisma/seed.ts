import { Prisma, PrismaClient } from '@prisma/client';
import * as _ from 'lodash';

export const newUser = [
  {
    name: 'Dipesh kumar sah',
    email: 'dipesh@gmail.com',
    phone: '1234567890',
    address: 'Kathmandu, Nepal',
  },
  {
    name: 'John Doe',
    email: 'john@gmail.com',
    phone: '1234567890',
    address: 'Kathmandu, Nepal',
  },
];

const discounts = [
  {
    id: '1',
    name: 'xyz',
    email: 'try@gmail.com',
    offerType: 'Basic',
    amount: 100,
    isPaid: true,
    transactionCode: '123456',
    isValid: true,
  },
  {
    id: '2',
    name: 'abc',
    email: 'try2@gmail.com',
    offerType: 'Premium',
    amount: 200,
    isPaid: true,
    transactionCode: '123456',
    isValid: true,
  },
];

const products = [
  {
    id: '61c82d33-9ce0-495b-8a18-c4ce5d340272',
    productName: 'Everday Hoodie',
  },
  {
    id: '0ee0a46a-3761-48dd-88c0-7a0e9bee7613',
    productName: 'Club 2024 Polo',
  },
  {
    id: '051d5d0c-e22f-47c7-b0e3-7df658789226',
    productName: 'Retro Wind Breaker',
  },
];
const loadProducts = async () => {
  const productsObj: Prisma.ProductCreateInput[] = products.map(
    (product): Prisma.ProductCreateInput => {
      return {
        ...product,
      };
    },
  );
  await prisma.product.createMany({ data: productsObj });
  console.log('Products inserted in database successfully');
};

const loadSizes = async () => {
  const sizes = ['MD', 'LG', 'XL'];
  const sizesObj: Prisma.SizeCreateInput[] = sizes.map((size): Prisma.SizeCreateInput => {
    return {
      size,
    };
  });
  await prisma.size.createMany({ data: sizesObj });
  console.log('Sizes inserted in database successfully');
};

const loadColors = async () => {
  const colours = ['green', 'blue', 'black', 'white'];
  const colorsObj: Prisma.ColorCreateInput[] = colours.map((color): Prisma.ColorCreateInput => {
    return {
      color,
    };
  });

  await prisma.color.createMany({ data: colorsObj });

  console.log('colors inserted in database successfully');
};

const stockDetails = {
  // hoodie
  '61c82d33-9ce0-495b-8a18-c4ce5d340272': {
    MD: [
      {
        color: 'black',
        stock: 24,
      },
      {
        color: 'blue',
        stock: 19,
      },
      {
        color: 'green',
        stock: 15,
      },
    ],
    LG: [
      {
        color: 'black',
        stock: 20,
      },
      {
        color: 'blue',
        stock: 17,
      },
      {
        color: 'green',
        stock: 20,
      },
    ],
    XL: [
      {
        color: 'black',
        stock: 36,
      },
      {
        color: 'blue',
        stock: 29,
      },
      {
        color: 'green',
        stock: 22,
      },
    ],
  },
  // polo
  '0ee0a46a-3761-48dd-88c0-7a0e9bee7613': {
    MD: [
      {
        color: 'black',
        stock: 9,
      },
      {
        color: 'while',
        stock: 13,
      },
    ],
    LG: [
      {
        color: 'black',
        stock: 9,
      },
      {
        color: 'while',
        stock: 13,
      },
    ],
    XL: [
      {
        color: 'black',
        stock: 9,
      },
      {
        color: 'while',
        stock: 13,
      },
    ],
  },
  // wind breaker
  '051d5d0c-e22f-47c7-b0e3-7df658789226': {
    MD: [
      {
        color: 'green',
        stock: 17,
      },
      {
        color: 'blue',
        stock: 15,
      },
    ],
    LG: [
      {
        color: 'green',
        stock: 25,
      },
      {
        color: 'blue',
        stock: 25,
      },
    ],
    XL: [
      {
        color: 'green',
        stock: 15,
      },
      {
        color: 'blue',
        stock: 10,
      },
    ],
  },
};

const loadStocks = async () => {
  let stock: Prisma.StockCreateInput;

  products.forEach(product => {
    const productStocks = stockDetails[product.id];

    Array.of('MD', 'LG', 'XL').forEach(async size => {
      const stocks = productStocks[size];
      for (const s of stocks) {
        stock = {
          color: { connect: { color: s.color } },
          size: { connect: { size } },
          product: { connect: { id: product.id } },
          quantity: s.stock,
        };
        await prisma.stock.create({ data: stock });
      }
    });
  });

  console.log('Stocks inserted into database successfully');
};

const prisma = new PrismaClient();

async function main() {
  for await (const discount of discounts) {
    const userAttrs = _.cloneDeep(discount);
    await prisma.user.create({
      data: {
        ...userAttrs,
      },
    });
  }
  await loadProducts();
  await loadSizes();
  await loadColors();
  await loadStocks();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.log(error);
    await prisma.$disconnect();
  });

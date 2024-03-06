import { PrismaClient } from '@prisma/client';
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.log(error);
    await prisma.$disconnect();
  });

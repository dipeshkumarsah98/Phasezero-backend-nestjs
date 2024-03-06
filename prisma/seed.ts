import { PrismaClient } from '@prisma/client';
import * as _ from 'lodash';

export const users = [
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

const prisma = new PrismaClient();

async function main() {
  for await (const user of users) {
    const userAttrs = _.cloneDeep(user);
    await prisma.newUser.create({
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

import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly _logger = new Logger('User Services');
  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    this._logger.log(`Registering new user: ${createUserDto?.email}`);
    const newUser = await this.prisma.newUser.create({
      data: {
        ...createUserDto,
      },
    });
    return newUser;
  }

  async findAll() {
    return await this.prisma.user.findMany({});
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this._logger.log(`Updating user: ${id}`);
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.newUser.findFirst({ where: { email } });
  }
}

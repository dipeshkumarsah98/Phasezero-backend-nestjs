import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mailer/mailer.service';

@Injectable()
export class UsersService {
  private readonly _logger = new Logger('User Services');
  constructor(private prisma: PrismaService, private readonly mailService: MailService) {}
  async sendEmail() {
    const users: any[] = await this.prisma
      .$queryRaw`SELECT DISTINCT  ON (email)  name, email, "isPaid"
    FROM users
    ORDER BY email ASC
    `;

    // selice first 100 users
    const newUsers = users.slice(0, 100);

    // users.forEach(user => {
    //   const { email, name } = user;
    //   // send email
    //   this.mailService.sendEvent({ email, name, otp: 'MYSTERY20' });
    // });

    return {
      newUsers,
      total: newUsers.length,
      // message: 'Emails sent successfully',
    };
  }
  async searchUser(name: string) {
    try {
      const users = await this.prisma.newUser.findMany({
        where: {
          name: {
            contains: name,
          },
        },
      });
      return users;
    } catch (error) {
      console.log(error);
    }
  }

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

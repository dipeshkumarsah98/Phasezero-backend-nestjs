import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiBearerAuth('access-token')
// @UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('/search')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async searchUser(@Query() name: string) {
    return this.usersService.searchUser(name);
  }

  // @Public()
  // @Get('/send-mail')
  // async sendAllEmail() {
  //   return this.usersService.sendEmail();
  // }
}

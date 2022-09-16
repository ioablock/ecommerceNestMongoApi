import {
  UseGuards,
  Body,
  Controller,
  Post,
  Put,
  Query,
  ValidationPipe,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './schema/user.schema';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RequestWithUser } from './schema/request-with-user';
import { Role } from 'src/users/schema/role.enum';
import RoleGuard from 'src/users/guard/role.guard';
import { JwtAuthGuard } from '../users/guard/jwt-auth.guard';
import { AmountIncorrectException } from 'src/common/exception/amount-incorrect-exception';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './schema/order.schema';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    return await this.usersService.signUp(authCredentialsDto);
  }

  @Put('/deposit')
  @UseGuards(RoleGuard(Role.BUYER))
  @UseGuards(JwtAuthGuard)
  deposit(@Req() request: RequestWithUser, @Query('amount') amount: any) {
    const allowedValues = [5, 10, 20, 50, 100];
    if (amount == null || !allowedValues.includes(parseInt(amount))) {
      throw new AmountIncorrectException();
    }

    const { user } = request;

    return this.usersService.deposit(user.username, amount);
  }

  @Post('/buy')
  @UseGuards(RoleGuard(Role.BUYER))
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async buy(
    @Req() request: RequestWithUser,
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const { user } = request;

    return await this.usersService.buy(createOrderDto, user);
  }

  @Put('/reset')
  @UseGuards(RoleGuard(Role.BUYER))
  @UseGuards(JwtAuthGuard)
  reset(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.usersService.reset(user.username);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async login(@Req() request: RequestWithUser, @Res() response: any) {
    const { user } = request;

    const jwtToken = this.usersService.getJwtToken(user);
    response.setHeader('x-access-token', jwtToken);
    return response.send(user);
  }
}

import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User, UserDocument } from './schema/user.schema';
import { Order, OrderDocument } from './schema/order.schema';
import { CreateOrderDto } from './dto/order.dto';
import { ProductsService } from 'src/products/products.service';
import { UnknownProductException } from 'src/common/exception/unknown-product-exception';
import { InsufficientFundsException } from 'src/common/exception/insufficient-funds-exception';
import { InsufficientStockException } from 'src/common/exception/insufficient-stock-exception';
import { UnknownUserException } from 'src/common/exception/unknown-user-exception';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private jwtService: JwtService,
    private productsService: ProductsService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password, deposit, role } = authCredentialsDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      username,
      password: hashedPassword,
      deposit,
      role,
    });

    return await user.save();
  }

  async buy(createOrderDto: CreateOrderDto, user: any): Promise<Order> {
    const { productId, qty } = createOrderDto;
    let username = user.username;

    let toBuyProduct = await this.productsService.findOne(productId);
    if (!toBuyProduct) {
      throw new UnknownProductException();
    }

    if (toBuyProduct.quantity < qty) {
      throw new InsufficientStockException();
    }

    let orderPrice = toBuyProduct.price * qty;
    if (user.deposit < orderPrice) {
      throw new InsufficientFundsException();
    }

    let restDeposit = user.deposit - orderPrice;
    const order = new this.orderModel({
      product: toBuyProduct,
      qty,
      buyerUsername: username,
      orderPrice,
      change: restDeposit,
    });
    //TODO: Update the product qty
    return await order.save();
  }

  async deposit(username: string, amount: any): Promise<boolean> {
    let resultUpdate = await this.userModel.updateOne(
      { username: username },
      { $inc: { deposit: amount } },
    );
    return resultUpdate != null && resultUpdate.modifiedCount === 1
      ? true
      : false;
  }

  async reset(username: string): Promise<User> {
    let resetResult = await this.userModel.findOneAndUpdate(
      { username: username },
      { deposit: 0 },
      { new: true },
    );
    return resetResult;
  }

  public getJwtToken(user: any) {
    let payload = { username: user.username, id: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    return token;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new UnknownUserException();
    }
    return user;
  }

  public async getAuthenticatedUser(username: string, hashedPassword: string) {
    const user = await this.userModel.findOne({ username });
    const isPasswordMatching = await bcrypt.compare(
      hashedPassword,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    user.password = undefined;
    return user;
  }
}

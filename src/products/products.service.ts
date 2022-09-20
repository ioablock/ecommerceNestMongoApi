import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtService } from '@nestjs/jwt';
import { SellerIncorrectException } from 'src/common/exception/seller-incorrect-exception';
import { UnknownProductException } from 'src/common/exception/unknown-product-exception';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private jwtService: JwtService,
  ) {}

  async create(req: any, createProductDto: CreateProductDto): Promise<Product> {
    let jwtFromRequest = req.headers.authorization.split(' ')[1];
    let decodedJWT: any = this.jwtService.decode(jwtFromRequest);
    let userId = decodedJWT.id;

    createProductDto.sellerId = userId;
    const newProduct = new this.productModel(createProductDto);

    return await newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find();
  }

  async findOne(id: string): Promise<Product> {
    return await this.productModel.findOne({ _id: id });
  }

  async decrementProductQuantity(id: string, amount:number): Promise<boolean> {
    const resultUpdate = await this.productModel.updateOne({ _id: id }, {$inc:{quantity:-amount}});
    return resultUpdate != null && resultUpdate.modifiedCount === 1
    ? true
    : false;
  }

  async update(req: any, id: string, item: UpdateProductDto): Promise<boolean> {
    let jwtFromRequest = req.headers.authorization.split(' ')[1];
    let decodedJWT: any = this.jwtService.decode(jwtFromRequest);
    let userId = decodedJWT.id;

    let productToUpdate: Product = await this.productModel.findById({
      _id: id,
    });
    if (productToUpdate == null) {
      throw new UnknownProductException();
    }
    if (userId !== productToUpdate.sellerId) {
      throw new SellerIncorrectException();
    }

    const resultUpdate = await this.productModel.updateOne({ _id: id }, item);

    return resultUpdate != null && resultUpdate.modifiedCount === 1
      ? true
      : false;
  }

  async remove(req: any, id: string): Promise<boolean> {
    let jwtFromRequest = req.headers.authorization.split(' ')[1];
    let decodedJWT: any = this.jwtService.decode(jwtFromRequest);
    let userId = decodedJWT.id;

    let productToRemove: Product = await this.productModel.findById({
      _id: id,
    });
    if (productToRemove == null) {
      throw new UnknownProductException();
    }
    if (userId !== productToRemove.sellerId) {
      throw new SellerIncorrectException();
    }

    const resultRemove = await this.productModel.remove(productToRemove);

    return resultRemove != null && resultRemove.deletedCount === 1
      ? true
      : false;
  }
}

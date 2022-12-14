import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../users/guard/jwt-auth.guard';
import { Role } from 'src/users/schema/role.enum';
import RoleGuard from 'src/users/guard/role.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(RoleGuard(Role.SELLER))
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Req() req: any, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(req, createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(RoleGuard(Role.SELLER))
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(req, id, updateProductDto);
  }

  @UseGuards(RoleGuard(Role.SELLER))
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.productsService.remove(req, id);
  }
}

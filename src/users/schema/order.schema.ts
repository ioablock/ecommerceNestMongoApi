import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  product: Product;

  @Prop()
  qty: number;

  @Prop()
  orderPrice: number;

  @Prop()
  buyerUsername: string;

  @Prop()
  change: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

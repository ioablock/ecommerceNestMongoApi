import { BadRequestException } from '@nestjs/common';

export class InsufficientStockException extends BadRequestException {
  constructor() {
    super('Unable to buy the reqested product qty: insufficient stock');
  }
}
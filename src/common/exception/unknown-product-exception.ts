import { BadRequestException } from '@nestjs/common';

export class UnknownProductException extends BadRequestException {
  constructor() {
    super('There is no product with the given id');
  }
}
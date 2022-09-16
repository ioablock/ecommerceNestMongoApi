import { BadRequestException } from '@nestjs/common';

export class SellerIncorrectException extends BadRequestException {
  constructor() {
    super('User has to be the creator of the product to perform this operation');
  }
}
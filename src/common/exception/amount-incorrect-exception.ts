import { BadRequestException } from '@nestjs/common';

export class AmountIncorrectException extends BadRequestException {
  constructor() {
    super('The amount to deposit must be: 5,10,20,50 or 100');
  }
}
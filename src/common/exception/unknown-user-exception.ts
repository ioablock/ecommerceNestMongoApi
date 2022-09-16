import { BadRequestException } from '@nestjs/common';

export class UnknownUserException extends BadRequestException {
  constructor() {
    super('Unknown User');
  }
}
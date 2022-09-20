import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class AmountDto {

  @IsNotEmpty()
  @IsNumber()
  @IsIn([5, 10, 20, 50, 100])
  amount: number;
}

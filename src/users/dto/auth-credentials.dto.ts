import {
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsNumber,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '../schema/role.enum';

export class AuthCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password is too short (8 characters min)' })
  @MaxLength(20, { message: 'Password is too long (20 characters max)' })
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  deposit: number;

  @IsEnum(Role)
  @IsString()
  @IsNotEmpty()
  role: Role;
}

import {
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Role } from '../schema/role.enum';

export class AuthCredentialsDto {
  @IsEmail()
  @IsString()
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password is too short (8 characters min)' })
  @MaxLength(20, { message: 'Password is too long (20 characters max)' })
  password: string;

  @IsNumber()
  deposit: number;

  @IsEnum(Role)
  @IsString()
  role: Role;
}

import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name?: string;

  @IsNotEmpty({ message: 'email is required' })
  email?: string;

  password?: string;

  @Optional()
  role?: string;
}

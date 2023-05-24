import { IsIn, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsNotEmpty({ message: 'password is required' })
  password: string;
}

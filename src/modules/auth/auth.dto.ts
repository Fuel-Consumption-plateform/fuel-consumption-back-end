import { IsIn, IsNotEmpty } from 'class-validator';

export class AuthWebLogin {

    @IsNotEmpty({ message: 'email is required' })
    email: string;
  
    @IsNotEmpty({ message: 'password is required' })
    password: 'user' | 'admin';
  }
import { Body, Controller,  Request,
    Response, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.model';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('login')
      async login(@Body() credentials:AuthDto, @Response() res) {
        const {token, user} = await this.authService.loginUser(
         credentials
        );
            res.setHeader('Access-Control-Expose-Headers', 'x-auth-token');
            res.header('x-auth-token', token).send({ user });
        
      }



}

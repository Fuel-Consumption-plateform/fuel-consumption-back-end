import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { pick } from 'lodash';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UserService,

      ) {}

      
    async loginUser(credentials: AuthDto ) {
       
        const {email, password}= credentials;
        console.log(email,password);
        const user = await this.usersService.authUser(email, password);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const payload = pick(user, ['_id', 'name', 'email','role']);

            return {
              token: this.jwtService.sign(payload),
              user: user,
            };
            // const jwt = await this.jwtService.sign(payload);
            // return {
            //     "access_token":jwt,
                    
            //     user:user
            // }
          }

      async getToken(user: any) {
        const payload = pick(user, ['_id', 'name', 'email']);
        return {
          token: this.jwtService.sign(payload),
          user: user,
        };
      }
}

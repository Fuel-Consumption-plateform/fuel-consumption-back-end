import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import appConstants from 'src/config/constants';
import { UserDocument } from '../user/user.model';
import { pick } from 'lodash';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConstants.secret,
    });
  }

  validate(payload: UserDocument) {
    return { ...pick(payload, ['_id', , 'name', 'email', 'role']) };
  }
}

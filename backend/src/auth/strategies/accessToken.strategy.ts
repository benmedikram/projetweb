import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const ACCESS_TOKEN_SECRET = 'super-secret-access-token'; // même secret que dans JwtModule

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    // ici tu peux retourner ce que tu veux mettre dans req.user
    return payload;
  }
}

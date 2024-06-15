import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      const token = authHeader.split(' ')[1];
      try {
        const decodedToken = this.jwtService.verifyAsync(token, {
          secret: 'my_jwt_secret_key_1',
        });
        req.user = decodedToken;
        next();
      } catch (error) {
        throw new Error('Invalid token');
      }
    } else {
      throw new Error('Authorization header is missing or invalid');
    }
  }
}

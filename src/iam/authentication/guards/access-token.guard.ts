import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ACTIVE_USER_KEY } from '../decorators/active-user.decorator';
import { TokenService } from '../services/token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeder(request);
    if (!token) return false;

    const payload = await this.tokenService.verifyToken(token, 'ACCESS_TOKEN');
    if (!payload) return false;

    request[ACTIVE_USER_KEY] = payload;
    return true;
  }

  private extractTokenFromHeder(request: Request): string | undefined {
    const bearer = request.headers.authorization?.split(' ');
    if (!bearer || bearer.length < 2) return undefined;
    return bearer[1];
  }
}

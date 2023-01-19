import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_TYPE_KEY } from '../decorators/user-type.decorator';
import { UserType } from '../enums/user-type.enum';
import { TokenService } from '../services/token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeder(request);
    if (!token) return false;

    const payload = await this.tokenService.verifyToken(token, 'ACCESS_TOKEN');
    const userType = this.reflector.getAllAndOverride(USER_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])[0] as UserType;

    if (userType === UserType.Librarian) {
      const librarian = await this.prismaService.librarian.findUnique({
        where: { id: payload.sub },
      });

      if (!librarian) throw new UnauthorizedException();
      return true;
    }

    const reader = await this.prismaService.reader.findUnique({
      where: { id: payload.sub },
    });

    if (!reader) throw new UnauthorizedException();
    return true;
  }

  private extractTokenFromHeder(request: Request): string | undefined {
    const bearer = request.headers.authorization?.split(' ');
    if (!bearer || bearer.length < 2) return undefined;
    return bearer[1];
  }
}

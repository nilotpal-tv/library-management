import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Librarian, Reader } from '@prisma/client';
import { Request } from 'express';
import { UserType } from 'src/iam/authorization/enums/user-type.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { ACTIVE_USER_KEY } from '../decorators/active-user.decorator';
import { TokenService } from '../services/token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeder(request);

    const payload = await this.tokenService.verifyToken(token, 'ACCESS_TOKEN');
    if (!payload) return false;

    let user: Reader | Librarian;

    if (payload.userType === UserType.Librarian)
      user = await this.prisma.librarian.findUnique({
        where: { id: payload.sub },
        include: { reports: true },
      });

    if (payload.userType === UserType.Reader)
      user = await this.prisma.reader.findUnique({
        where: { id: payload.sub },
        include: { reports: true },
      });

    if (!user) throw new NotFoundException("User doesn't exist.");
    request[ACTIVE_USER_KEY] = user;
    return true;
  }

  private extractTokenFromHeder(request: Request): string | undefined {
    const bearer = request.headers.authorization?.split(' ');
    if (!bearer || bearer.length < 2)
      throw new UnauthorizedException('Login to access this route.');
    return bearer[1];
  }
}

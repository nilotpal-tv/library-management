import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from 'src/iam/authentication/services/token.service';
import { JwtPayload } from 'src/iam/authentication/types/jwt-payload';
import { USER_TYPE_KEY } from '../decorators/user-type.decorator';
import { UserType } from '../enums/user-type.enum';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private static defaultUserType: UserType = UserType.Reader;

  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeder(request);
    if (!token) return false;

    const payload = (await this.tokenService.verifyToken(
      token,
      'ACCESS_TOKEN',
    )) as JwtPayload;

    const userTypes = this.reflector.getAllAndOverride<UserType[]>(
      USER_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );
    const userType =
      userTypes && userTypes.length > 0
        ? userTypes[0]
        : AuthorizationGuard.defaultUserType;

    console.log({ userType, payload });
    if (userType.toLowerCase() !== payload.userType.toLowerCase()) return false;
    return true;
  }

  private extractTokenFromHeder(request: Request): string | undefined {
    const bearer = request.headers['authorization']?.split(' ');
    if (!bearer || bearer.length < 2) return undefined;
    return bearer[1];
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from 'src/iam/authentication/decorators/auth-type.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { AuthenticationGuard } from 'src/iam/authentication/guards/authentication.guard';
import { TokenService } from 'src/iam/authentication/services/token.service';
import { JwtPayload } from 'src/iam/authentication/types/jwt-payload';
import { USER_TYPE_KEY } from '../decorators/user-type.decorator';
import { UserType } from '../enums/user-type.enum';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly authenticationGuard: AuthenticationGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthType.Bearer];
    const authType = authTypes[0];

    if (authType === AuthType.None) return true;
    await this.authenticationGuard.canActivate(context);

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeder(request);
    const payload = (await this.tokenService.verifyToken(
      token,
      'ACCESS_TOKEN',
    )) as JwtPayload;

    const userTypes = this.reflector.getAllAndOverride<UserType[]>(
      USER_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    return userTypes.some((userType) => userType === payload.userType);
  }

  private extractTokenFromHeder(request: Request): string | undefined {
    const bearer = request.headers['authorization']?.split(' ');
    if (!bearer || bearer.length < 2) return undefined;
    return bearer[1];
  }
}

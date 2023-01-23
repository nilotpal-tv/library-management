import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { JwtErrorNames } from '../enums/jwt-errors.enum';
import { JwtPayload } from '../types/jwt-payload';
import { TokenResponse } from '../types/token-response';
import { TokenType } from '../types/token-type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  private async signToken(
    payload: JwtPayload,
    tokenType: TokenType,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      audience: this.jwtConfiguration.JWT_TOKEN_AUDIENCE,
      issuer: this.jwtConfiguration.JWT_TOKEN_ISSUER,
      expiresIn:
        tokenType === 'ACCESS_TOKEN'
          ? this.jwtConfiguration.JWT_ACCESS_TOKEN_TTL
          : this.jwtConfiguration.JWT_REFRESH_TOKEN_TTL,
      secret:
        tokenType === 'ACCESS_TOKEN'
          ? this.jwtConfiguration.JWT_ACCESS_TOKEN_SECRET
          : this.jwtConfiguration.JWT_REFRESH_TOKEN_SECRET,
    });
  }

  async signTokens(payload: JwtPayload): Promise<TokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, 'ACCESS_TOKEN'),
      this.signToken(payload, 'REFRESH_TOKEN'),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string, tokenType: TokenType): Promise<JwtPayload> {
    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret:
          tokenType === 'ACCESS_TOKEN'
            ? this.jwtConfiguration.JWT_ACCESS_TOKEN_SECRET
            : this.jwtConfiguration.JWT_REFRESH_TOKEN_SECRET,
      })) as JwtPayload;

      return payload;
    } catch (error) {
      if (error.name === JwtErrorNames.TokenExpiredError)
        throw new UnauthorizedException('Session expired. Login again.');

      if (error.name === JwtErrorNames.JsonWebTokenError)
        throw new UnauthorizedException('Invalid token.');

      throw error;
    }
  }
}

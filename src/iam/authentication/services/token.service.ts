import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import jwtConfig from '../../config/jwt.config';
import { JwtErrorNames } from '../enums/jwt-errors.enum';
import { JwtPayload } from '../types/jwt-payload';
import { TokenResponse } from '../types/token-response';
import { TokenType } from '../types/token-type';
import { RefreshTokenStorageService } from './refresh-token-storage.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsService: RefreshTokenStorageService,
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
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, 'ACCESS_TOKEN'),
      this.signToken({ ...payload, refreshTokenId }, 'REFRESH_TOKEN'),
    ]);

    await this.refreshTokenIdsService.insert(payload.sub, refreshTokenId);
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

      throw new UnauthorizedException('Invalid token.');
    }
  }
}

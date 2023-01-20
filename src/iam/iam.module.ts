import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { AuthenticationService } from './authentication/services/authentication.service';
import { TokenService } from './authentication/services/token.service';
import { AuthorizationGuard } from './authorization/guards/authorization.guard';
import jwtConfig from './config/jwt.config';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider() as JwtModuleAsyncOptions),
  ],
  providers: [
    TokenService,
    AuthenticationService,
    AccessTokenGuard,
    AuthenticationGuard,
    { provide: HashingService, useClass: BcryptService },
    { provide: APP_GUARD, useClass: AuthorizationGuard },
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}

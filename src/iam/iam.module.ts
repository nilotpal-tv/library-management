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
    { provide: HashingService, useClass: BcryptService },
    { provide: APP_GUARD, useClass: AuthenticationGuard },
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}

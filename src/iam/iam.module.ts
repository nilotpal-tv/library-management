import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthenticationController } from './authentication/authentication.controller';
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
    { provide: HashingService, useClass: BcryptService },
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}

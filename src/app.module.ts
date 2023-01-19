import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { __prod__ } from './common/common.constant';
import { IamModule } from './iam/iam.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    IamModule,
    PrismaModule,
  ],
})
export class AppModule {}

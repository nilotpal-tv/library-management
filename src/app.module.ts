import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), IamModule, PrismaModule],
})
export class AppModule {}

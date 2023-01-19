import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { __prod__ } from './common/common.constant';
import { EnvironmentValidationSchema } from './common/schema/env-validation.schema';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: EnvironmentValidationSchema }),
    TypeOrmModule.forRoot({
      port: 5432,
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: '12345',
      synchronize: !__prod__,
      autoLoadEntities: true,
      database: 'project-management',
    }),
    IamModule,
  ],
})
export class AppModule {}

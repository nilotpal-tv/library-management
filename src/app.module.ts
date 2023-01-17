import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentValidationSchema } from './common/config-validation.schema';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: EnvironmentValidationSchema }),
    IamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

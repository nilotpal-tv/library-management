import { Module } from '@nestjs/common';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [IamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

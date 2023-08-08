import { Module } from '@nestjs/common';
import { ManagmentModule } from './managment/managment.module';

@Module({
  imports: [ManagmentModule]
})
export class AdminModule {}

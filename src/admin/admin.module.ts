import { Module } from '@nestjs/common';
import { ManagmentModule } from './managment/managment.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [ManagmentModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class AdminModule {}

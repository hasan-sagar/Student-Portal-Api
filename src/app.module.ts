import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [CoreModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

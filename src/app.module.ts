import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilterModule } from './filter/filter.module';

@Module({
  imports: [FilterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

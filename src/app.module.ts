import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilterModule } from './modules/filter/filter.module';
import { NestedFilterModule } from './modules/nested-filter/nested-filter.module';

@Module({
  imports: [FilterModule, NestedFilterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

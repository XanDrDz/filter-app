import { Module } from '@nestjs/common';
import { NestedFilterService } from './nested-filter.service';

@Module({
  providers: [NestedFilterService],
  exports: [NestedFilterService],
})
export class NestedFilterModule {}

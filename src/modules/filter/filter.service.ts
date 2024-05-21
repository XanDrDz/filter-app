import { Injectable } from '@nestjs/common';
import {
  Message,
  Filter,
  DateType,
  DateFilter,
  BooleanFilter,
  NumberFilter,
  StringFilter,
} from './models/models';

@Injectable()
export class FilterService {
  public applyFilter(message: Message, filter: Filter): boolean {
    switch (filter.type) {
      case 'string':
        return this.applyStringFilter(message, filter);
      case 'number':
        return this.applyNumberFilter(message, filter);
      case 'boolean':
        return this.applyBooleanFilter(message, filter);
      case 'date':
        return this.applyDateFilter(message, filter);
      case 'or':
        return filter.filters.some((subFilter) =>
          this.applyFilter(message, subFilter),
        );
      case 'and':
        return filter.filters.every((subFilter) =>
          this.applyFilter(message, subFilter),
        );
      default:
        return false;
    }
  }

  public applyStringFilter(message: Message, filter: StringFilter): boolean {
    const value = message[filter.field] as string;
    if (typeof value !== 'string') return false;

    switch (filter.operation) {
      case 'eq':
        return value === filter.value;
      case 'startsWith':
        return value.startsWith(filter.value);
      case 'endsWith':
        return value.endsWith(filter.value);
      case 'contains':
        return value.includes(filter.value);
      default:
        return false;
    }
  }

  public applyNumberFilter(message: Message, filter: NumberFilter): boolean {
    const value = message[filter.field] as number;
    if (typeof value !== 'number') return false;

    switch (filter.operation) {
      case 'eq':
        return value === filter.value;
      case 'gt':
        return value > filter.value;
      case 'lt':
        return value < filter.value;
      case 'gte':
        return value >= filter.value;
      case 'lte':
        return value <= filter.value;
      default:
        return false;
    }
  }

  public applyBooleanFilter(message: Message, filter: BooleanFilter): boolean {
    const value = message[filter.field] as boolean;
    if (typeof value !== 'boolean') return false;

    return value === filter.value;
  }

  public applyDateFilter(message: Message, filter: DateFilter): boolean {
    const value = new Date(message[filter.field] as DateType);
    const filterValue = new Date(filter.value);

    if (isNaN(value.getTime()) || isNaN(filterValue.getTime())) return false;

    switch (filter.operation) {
      case 'eq':
        return value.getTime() === filterValue.getTime();
      case 'after':
        return value.getTime() > filterValue.getTime();
      case 'before':
        return value.getTime() < filterValue.getTime();
      default:
        return false;
    }
  }

  public filterMessages(messages: Message[], filter: Filter): Message[] {
    return messages.filter((message) => this.applyFilter(message, filter));
  }
}

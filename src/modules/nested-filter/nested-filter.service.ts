import { Injectable } from '@nestjs/common';
import {
  Message,
  Filter,
  DateFilter,
  BooleanFilter,
  NumberFilter,
  StringFilter,
} from './models/models';

@Injectable()
export class NestedFilterService {
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

  private getFieldValue(message: Message, field: string): any {
    const keys = field.split('.');
    let value: any = message;
    for (const key of keys) {
      if (Array.isArray(value)) {
        value = value
          .flatMap((item) => item[key])
          .filter((v) => v !== undefined);
      } else {
        value = value?.[key];
      }
      if (value === undefined) return undefined;
    }
    return value;
  }

  public applyStringFilter(message: Message, filter: StringFilter): boolean {
    const values = this.getFieldValue(message, filter.field);
    if (Array.isArray(values)) {
      return values.some((value) => {
        if (typeof value === 'string') {
          switch (filter.operation) {
            case 'eq':
              return value === filter.value;
            case 'startsWith':
              return value.startsWith(filter.value);
            case 'endsWith':
              return value.endsWith(filter.value);
            case 'contains':
              return value.includes(filter.value);
          }
        }
        return false;
      });
    } else if (typeof values === 'string') {
      switch (filter.operation) {
        case 'eq':
          return values === filter.value;
        case 'startsWith':
          return values.startsWith(filter.value);
        case 'endsWith':
          return values.endsWith(filter.value);
        case 'contains':
          return values.includes(filter.value);
      }
    }
    return false;
  }

  public applyNumberFilter(message: Message, filter: NumberFilter): boolean {
    const values = this.getFieldValue(message, filter.field);
    if (Array.isArray(values)) {
      return values.some((value) => {
        if (typeof value === 'number') {
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
          }
        }
        return false;
      });
    } else if (typeof values === 'number') {
      switch (filter.operation) {
        case 'eq':
          return values === filter.value;
        case 'gt':
          return values > filter.value;
        case 'lt':
          return values < filter.value;
        case 'gte':
          return values >= filter.value;
        case 'lte':
          return values <= filter.value;
      }
    }
    return false;
  }

  public applyBooleanFilter(message: Message, filter: BooleanFilter): boolean {
    const values = this.getFieldValue(message, filter.field);
    if (Array.isArray(values)) {
      return values.some((value) => {
        if (typeof value === 'boolean') {
          return value === filter.value;
        }
        return false;
      });
    } else if (typeof values === 'boolean') {
      return values === filter.value;
    }
    return false;
  }

  public applyDateFilter(message: Message, filter: DateFilter): boolean {
    const values = this.getFieldValue(message, filter.field);
    const filterValue = new Date(filter.value);
    if (Array.isArray(values)) {
      return values.some((value) => {
        const valueDate = new Date(value);
        if (!isNaN(valueDate.getTime())) {
          switch (filter.operation) {
            case 'eq':
              return valueDate.getTime() === filterValue.getTime();
            case 'after':
              return valueDate.getTime() > filterValue.getTime();
            case 'before':
              return valueDate.getTime() < filterValue.getTime();
          }
        }
        return false;
      });
    } else if (values instanceof Date || typeof values === 'string') {
      const valueDate = new Date(values);
      if (!isNaN(valueDate.getTime())) {
        switch (filter.operation) {
          case 'eq':
            return valueDate.getTime() === filterValue.getTime();
          case 'after':
            return valueDate.getTime() > filterValue.getTime();
          case 'before':
            return valueDate.getTime() < filterValue.getTime();
        }
      }
    }
    return false;
  }

  public filterMessages(messages: Message[], filter: Filter): Message[] {
    return messages.filter((message) => this.applyFilter(message, filter));
  }
}

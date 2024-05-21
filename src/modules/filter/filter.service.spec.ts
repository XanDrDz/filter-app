import { Test, TestingModule } from '@nestjs/testing';
import { FilterService } from './filter.service';
import { DateType, Message } from './models/models';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilterService],
    }).compile();

    service = module.get<FilterService>(FilterService);
  });

  const boolTrue: Message = {
    boolean: true,
  };

  const boolFalse: Message = {
    boolean: false,
  };

  const stringEqual: Message = {
    string: 'string',
  };

  const stringStartsWith: Message = {
    string: '$StartsWith',
  };

  const stringEndsWith: Message = {
    string: 'EndsWith$',
  };

  const stringContains: Message = {
    string: 'string contains $$ double dollar symbol',
  };

  const numberEqual: Message = {
    number: 12,
  };

  const dateMessage: Message = { date: new Date().toISOString() };

  const complexMessage: Message = {
    field1: 122,
    field2: new Date('2030-01-01T12:00:00.000Z').toISOString(),
  };

  const complexMessage2: Message = {
    field1: 123,
    field2: new Date('2030-01-01T12:00:00.000Z').toISOString(),
  };

  const complexMessage3: Message = {
    field1: 124,
    field2: new Date('2030-01-01T12:00:00.000Z').toISOString(),
  };

  const messages: Message[] = [
    boolTrue,
    boolFalse,
    stringEqual,
    stringStartsWith,
    stringEndsWith,
    stringContains,
    numberEqual,
    dateMessage,
    complexMessage,
    complexMessage2,
    complexMessage3,
  ];

  it('works on Boolean filter', () => {
    expect(
      service.filterMessages(messages, {
        field: 'boolean',
        type: 'boolean',
        operation: 'eq',
        value: true,
      }),
    ).toEqual([boolTrue]);

    expect(
      service.filterMessages(messages, {
        field: 'boolean',
        type: 'boolean',
        operation: 'eq',
        value: false,
      }),
    ).toEqual([boolFalse]);
  });

  it('String filter', () => {
    expect(
      service.filterMessages(messages, {
        field: 'string',
        type: 'string',
        operation: 'eq',
        value: 'string',
      }),
    ).toEqual([stringEqual]);

    expect(
      service.filterMessages(messages, {
        field: 'string',
        type: 'string',
        operation: 'startsWith',
        value: '$Star',
      }),
    ).toEqual([stringStartsWith]);

    expect(
      service.filterMessages(messages, {
        field: 'string',
        type: 'string',
        operation: 'endsWith',
        value: 'th$',
      }),
    ).toEqual([stringEndsWith]);

    expect(
      service.filterMessages(messages, {
        field: 'string',
        type: 'string',
        operation: 'contains',
        value: '$$',
      }),
    ).toEqual([stringContains]);
  });

  it('Number filter', () => {
    expect(
      service.filterMessages(messages, {
        field: 'number',
        type: 'number',
        operation: 'eq',
        value: 12,
      }),
    ).toEqual([numberEqual]);
  });

  it('Date filter', () => {
    expect(
      service.filterMessages(messages, {
        field: 'date',
        type: 'date',
        operation: 'eq',
        value: dateMessage.date as DateType,
      }),
    ).toEqual([dateMessage]);
  });

  it('works on OR filter', () => {
    expect(
      service.filterMessages(messages, {
        type: 'or',
        filters: [
          {
            field: 'string',
            type: 'string',
            operation: 'startsWith',
            value: '$',
          },
          {
            field: 'string',
            type: 'string',
            operation: 'endsWith',
            value: '$',
          },
        ],
      }),
    ).toEqual([stringStartsWith, stringEndsWith]);
  });

  it('works on AND filter', () => {
    expect(
      service.filterMessages(messages, {
        type: 'and',
        filters: [
          {
            field: 'string',
            type: 'string',
            operation: 'startsWith',
            value: '$',
          },
          {
            field: 'string',
            type: 'string',
            operation: 'contains',
            value: 'With',
          },
        ],
      }),
    ).toEqual([stringStartsWith]);
  });

  it('works on complex filter', () => {
    expect(
      service.filterMessages(messages, {
        type: 'and',
        filters: [
          {
            type: 'or',
            filters: [
              { field: 'field1', type: 'number', operation: 'lt', value: 123 },
              { field: 'field1', type: 'number', operation: 'gt', value: 123 },
            ],
          },
          {
            field: 'field2',
            type: 'date',
            operation: 'after',
            value: new Date(),
          },
        ],
      }),
    ).toEqual([complexMessage, complexMessage3]);
  });
});

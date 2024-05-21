import { Test, TestingModule } from '@nestjs/testing';
import { NestedFilterService } from './nested-filter.service';
import { Message } from './models/models';

describe('FilterService', () => {
  let service: NestedFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestedFilterService],
    }).compile();

    service = module.get<NestedFilterService>(NestedFilterService);
  });

  const nestedMessages: Message[] = [
    {
      id: 1,
      details: {
        stringField: 'testString',
        numberField: 10,
        booleanField: true,
        dateField: new Date('2023-01-01'),
      },
    },
    {
      id: 2,
      details: {
        stringField: 'anotherString',
        numberField: 20,
        booleanField: false,
        dateField: new Date('2023-02-01'),
      },
    },
    {
      id: 3,
      details: {
        stringField: 'testString',
        numberField: 30,
        booleanField: true,
        dateField: new Date('2023-03-01'),
      },
    },
    { id: 4, details: { nested: { numberField: 40 } } },
    { id: 5, arrayField: [{ numberField: 50 }, { numberField: 60 }] },
  ];

  it('filters nested string fields', () => {
    const result = service.filterMessages(nestedMessages, {
      type: 'string',
      field: 'details.stringField',
      operation: 'eq',
      value: 'testString',
    });
    expect(result).toEqual([nestedMessages[0], nestedMessages[2]]);
  });

  it('filters nested number fields', () => {
    const result = service.filterMessages(nestedMessages, {
      type: 'number',
      field: 'details.numberField',
      operation: 'gt',
      value: 15,
    });
    expect(result).toEqual([nestedMessages[1], nestedMessages[2]]);
  });

  it('filters nested boolean fields', () => {
    const result = service.filterMessages(nestedMessages, {
      type: 'boolean',
      field: 'details.booleanField',
      operation: 'eq',
      value: true,
    });
    expect(result).toEqual([nestedMessages[0], nestedMessages[2]]);
  });

  it('filters nested date fields', () => {
    const result = service.filterMessages(nestedMessages, {
      type: 'date',
      field: 'details.dateField',
      operation: 'after',
      value: new Date('2023-01-15'),
    });
    expect(result).toEqual([nestedMessages[1], nestedMessages[2]]);
  });

  it('filters deeply nested number fields', () => {
    const result = service.filterMessages(nestedMessages, {
      type: 'number',
      field: 'details.nested.numberField',
      operation: 'eq',
      value: 40,
    });
    expect(result).toEqual([nestedMessages[3]]);
  });

  it('filters array fields', () => {
    const result = service.filterMessages(nestedMessages, {
      type: 'number',
      field: 'arrayField.numberField',
      operation: 'gt',
      value: 55,
    });
    expect(result).toEqual([nestedMessages[4]]);
  });

  it('filters with or condition', () => {
    const result = service.filterMessages(nestedMessages, {
      type: 'or',
      filters: [
        {
          type: 'number',
          field: 'details.numberField',
          operation: 'eq',
          value: 10,
        },
        {
          type: 'number',
          field: 'details.numberField',
          operation: 'eq',
          value: 20,
        },
      ],
    });
    expect(result).toEqual([nestedMessages[0], nestedMessages[1]]);
  });
});

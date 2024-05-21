export type DateType = Date | string;

export type PrimitiveValue = string | boolean | DateType | number;
export type NestedValue = PrimitiveValue | Record<string, any> | NestedValue[];

export type Message = Record<string, NestedValue>;

export type StringFilter = {
  type: 'string';
  field: string;
  operation: 'eq' | 'startsWith' | 'endsWith' | 'contains';
  value: string;
};

export type NumberFilter = {
  type: 'number';
  field: string;
  operation: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
  value: number;
};

export type BooleanFilter = {
  type: 'boolean';
  field: string;
  operation: 'eq';
  value: boolean;
};

export type DateFilter = {
  type: 'date';
  field: string;
  operation: 'eq' | 'after' | 'before';
  value: DateType;
};

export type OrFilter = {
  type: 'or';
  filters: Filter[];
};

export type AndFilter = {
  type: 'and';
  filters: Filter[];
};

export type Filter =
  | StringFilter
  | NumberFilter
  | BooleanFilter
  | DateFilter
  | OrFilter
  | AndFilter;

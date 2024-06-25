export enum ColumnType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  DATE = "DATE",
}

export interface Column {
  key: string;
  type: ColumnType;
}

interface FilledFilter {
  id: string;
  column: Column;
  operator: FilterOperator;
  value: Date | Number | string;
}

// Partial and Pick combination here results in a Filter object where only the "id" field is set
type EmptyFilter = Partial<FilledFilter> & Pick<FilledFilter, "id">;

export type Filter = FilledFilter | EmptyFilter;

export interface ViewResult {
  filters: Filter[];
}

export enum FilterOperator {
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
}

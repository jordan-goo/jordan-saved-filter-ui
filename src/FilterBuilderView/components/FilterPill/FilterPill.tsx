import React, { useState, useRef, useEffect } from "react";
import { AutocompleteInput } from "../AutocompleteInput/AutocompleteInput.tsx";
import { TypedInput } from "../TypedInput/TypedInput.tsx";
import { isFilterValid } from "../../state/filterView.ts";
import { Filter, FilterOperator, Column } from "../../types.ts";

export interface FilterPillProps {
  columnData: Column[];
  onChange: (result: Filter) => void;
  onDelete: (result: Filter) => void;
  initialData: Filter;
}

const FilterOperatorLabels: Record<FilterOperator, string> = {
  [FilterOperator.EQUALS]: "= (equals)",
  [FilterOperator.NOT_EQUALS]: "!= (not equals)",
  [FilterOperator.GREATER_THAN]: "> (greater than)",
  [FilterOperator.LESS_THAN]: "< (less than)",
};

const isEmptyFilter = (filter: Filter) => {
  return filter.column === undefined;
};

export const FilterPill = ({
  columnData,
  initialData,
  onChange,
  onDelete,
}: FilterPillProps) => {
  const [filterState, setFilterState] = useState(initialData);
  const operatorRef: React.RefObject<HTMLInputElement> = useRef(null);
  const valueRef: React.RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    // column was just set so move user focus to operator input
    // needs to be in useEffect since we hide the operator ref until column is set
    operatorRef.current?.focus();
  }, [filterState?.column]);

  useEffect(() => {
    if (isFilterValid(filterState)) {
      // only trigger onChange handler if filter is complete
      onChange(filterState);
    }
  }, [filterState]);

  const setColumn = (column: Column) => {
    setFilterState((current) => {
      if (isEmptyFilter(current)) {
        // if filter is empty then set defaults for other values
        return {
          ...current,
          column: column,
          operator: FilterOperator.EQUALS,
          value: undefined,
        };
      } else {
        return {
          ...current,
          column: column,
        };
      }
    });
  };

  const setOperator = (operator: FilterOperator) => {
    setFilterState((current) => {
      return {
        ...current,
        operator: operator,
      };
    });
    valueRef.current?.focus();
  };

  const setValue = (value: string | Date | Number) => {
    setFilterState((current) => {
      return {
        ...current,
        value: value,
      };
    });
  };

  const columnOptions = columnData.map((column) => ({
    key: column.key,
    label: column.key,
    value: column,
  }));

  const operatorOptions = Object.keys(FilterOperator).map((value) => ({
    key: value,
    label: FilterOperatorLabels[value],
    value: value as FilterOperator,
  }));

  const filterClass = () => {
    if (filterState?.column === undefined) {
      return "filter";
    }
    if (!isFilterValid(filterState)) {
      return "filter-active filter-invalid";
    }
    return "filter-active";
  };

  return (
    <div className={filterClass()}>
      {filterState?.column !== undefined && (
        <button className="filter-close" onClick={() => onDelete(filterState)}>
          X
        </button>
      )}
      <AutocompleteInput
        options={columnOptions}
        defaultValue={filterState?.column}
        onSelect={setColumn}
      />
      {filterState?.column !== undefined && (
        <AutocompleteInput
          options={operatorOptions}
          inputRef={operatorRef}
          defaultValue={filterState.operator}
          onSelect={setOperator}
        />
      )}
      {filterState?.column !== undefined && (
        <TypedInput
          type={filterState.column.type}
          defaultValue={filterState.value}
          inputRef={valueRef}
          onChange={setValue}
        />
      )}
    </div>
  );
};

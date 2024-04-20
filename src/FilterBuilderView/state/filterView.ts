import { Filter, ViewResult } from "../types.ts";

export type FilterViewAction =
  | { type: "filter:update"; data: Filter }
  | { type: "filter:delete"; data: Filter };

export const filterViewReducer = (
  state: ViewResult,
  action: FilterViewAction
): ViewResult => {
  switch (action.type) {
    case "filter:update": {
      return {
        ...state,
        filters: addOrUpdateFilter(state.filters, action.data),
      };
    }
    case "filter:delete": {
      return {
        ...state,
        filters: deleteFilter(state.filters, action.data),
      };
    }
    default: {
      return state;
    }
  }
};

export const initFilterView = (initialData: ViewResult): ViewResult => {
  // We always want 1 and only 1 "empty" filter so the user has a starting point
  if (hasEmptyFilter(initialData.filters)) {
    return initialData;
  }

  return {
    filters: [...initialData.filters, buildEmptyFilter()],
  };
};

export const isFilterValid = (filter?: Filter): filter is Filter => {
  return (
    filter !== undefined &&
    filter.column !== undefined &&
    filter.operator !== undefined &&
    filter.value !== undefined
  );
};

const buildEmptyFilter = (): Filter => ({
  // use UUID so we can edit / delete by reference
  id: crypto.randomUUID(),
  column: undefined,
  operator: undefined,
  value: undefined,
});

const hasEmptyFilter = (filters: Filter[]) => {
  return filters.findIndex((filter) => filter.column === undefined) !== -1;
};

const addOrUpdateFilter = (filters: Filter[], data: Filter) => {
  const newFilters = [...filters];
  const existingFilter = newFilters.findIndex(
    (filter) => filter.id === data.id
  );
  if (existingFilter === -1) {
    newFilters.push(data);
  } else {
    newFilters[existingFilter] = { ...data };
  }

  if (!hasEmptyFilter(newFilters)) {
    // if filters no longer have an empty entry add one at the end so users can add another
    newFilters.push(buildEmptyFilter());
  }

  return newFilters;
};

const deleteFilter = (filters: Filter[], data: Filter) => {
  const newFilters = [...filters];
  const existingFilter = newFilters.findIndex(
    (filter) => filter.id === data.id
  );
  if (existingFilter === -1) {
    return newFilters;
  }

  newFilters.splice(existingFilter, 1);
  if (!hasEmptyFilter(newFilters)) {
    // if filters no longer have an empty entry add one at the end so users can add another
    newFilters.push(buildEmptyFilter());
  }

  return newFilters;
};

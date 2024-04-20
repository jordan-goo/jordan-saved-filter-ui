import React, { useEffect, useReducer } from "react";
import { FilterPill } from "./components/FilterPill/FilterPill.tsx";
import {
  filterViewReducer,
  initFilterView,
  isFilterValid,
} from "../FilterBuilderView/state/filterView.ts";
import { ViewResult, Column, Filter } from "./types.ts";

export interface FilterBuilderViewProps {
  columnData: Column[];
  onChange: (result: ViewResult) => void;
}

const initialView: ViewResult = {
  filters: [],
};

const parseFilterView = (data: ViewResult) => {
  return {
    ...data,
    filters: data.filters.filter(isFilterValid),
  };
};

export const FilterBuilderView = ({
  columnData,
  onChange,
}: FilterBuilderViewProps) => {
  const [filterView, dispatch] = useReducer(
    filterViewReducer,
    initialView,
    initFilterView
  );

  useEffect(() => {
    // filter out invalid filters before triggering onChange
    onChange(parseFilterView(filterView));
  }, [filterView]);

  const updateFilter = (filter: Filter) =>
    dispatch({ type: "filter:update", data: filter });

  const deleteFilter = (filter: Filter) =>
    dispatch({ type: "filter:delete", data: filter });

  return (
    <div className="filter-wrapper">
      <label>Filter:</label>
      <div className="filter-container">
        {filterView.filters.map((filter) => (
          <FilterPill
            key={filter.id}
            columnData={columnData}
            initialData={filter}
            onChange={updateFilter}
            onDelete={deleteFilter}
          />
        ))}
      </div>
    </div>
  );
};

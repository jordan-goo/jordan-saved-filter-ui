import React, { useState } from "react";
import "./styles.css";
import { FilterBuilderView } from "./FilterBuilderView/FilterBuilderView.tsx";
import { ColumnType, ViewResult } from "./FilterBuilderView/types.ts";

export const App = () => {
  const [textValue, setTextValue] = useState("");
  const columnData = [
    { key: "name", type: ColumnType.STRING },
    { key: "accountsOwned", type: ColumnType.NUMBER },
    { key: "dataAdded", type: ColumnType.DATE },
  ];

  return (
    <>
      <FilterBuilderView
        columnData={columnData}
        onChange={(result: ViewResult) =>
          setTextValue(JSON.stringify(result, null, 2))
        }
      />
      <pre>{textValue}</pre>
    </>
  );
};

# Saved filter UI

Implementation of a flexible "filter builder" ui. Component was built to be intuitive, flexible, enable keyboard navigation, and take up as little verticial space as possible.

### Running locally:

1. Clone repo
2. `npm install`
3. `npm run start`

### Example usage:

```
import { FilterBuilderView } from "./FilterBuilderView.tsx";
import { ColumnType, ViewResult } from "./types.ts";

const App = () => {
  const columnData = [
    { key: "name", type: ColumnType.STRING },
    { key: "accountsOwned", type: ColumnType.NUMBER },
    { key: "dataAdded", type: ColumnType.DATE },
  ];

  return (
      <FilterBuilderView
        columnData={columnData}
        onChange={(result: ViewResult) =>
          setTextValue(JSON.stringify(result, null, 2))
        }
      />
  );
};
```

# usePartialContext

React hook that provides ability to use only part of context, preventing unnecessary updates.

## Example

```tsx
type CtxValue = Row[];
const Ctx = createPartialContext<CtxValue>();

function Item({ rowIndex }) {
    const rowData = Ctx.usePartialContext(
        (items) => processRow(items[rowIndex]),
        [rowIndex]
    );

    // here rowData will be changed only for changed row
    return <ItemContent rowData={rowData}>;
}

function MyApp() {
    const [rows] = useState(createRows);

    return <Ctx.Provider value={rows}>{/** render items */}</Ctx.Provider>;
}
```

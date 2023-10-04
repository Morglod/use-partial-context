[![NPM Version](https://badge.fury.io/js/use-partial-context.svg?style=flat)](https://www.npmjs.com/package/use-partial-context)
[![Size](https://img.shields.io/bundlephobia/minzip/use-partial-context)](https://gitHub.com/Morglod/use-partial-context/)
[![GitHub stars](https://img.shields.io/github/stars/Morglod/use-partial-context.svg?style=social&label=Star&maxAge=2592000)](https://gitHub.com/Morglod/use-partial-context/)

# usePartialContext

React hook that provides ability to use only part of context, preventing unnecessary updates.

-   No special hacks/deps or other stuff, just react
-   Smart result value memoization (not just by ref but not deep equal)
-   Performant
-   Fully typed with typescript
-   "Stale props" problem solved in user land

```sh
npm i use-partial-context
```

[demo](https://morglod.github.io/use-partial-context/examples/example.html)

## Usage

```jsx
const Context = createPartialContext();

const Row = memo(({ rowIndex }) {
    const value = Context.usePartialContext(row => row.smth);

    // component will be updated ONLY if value changes
    return <div>{value}</div>;
});

function MyApp() {
    const store = useState(createData);
    return <Context.Provider value={rows}>{/** render rows */}</Ctx.Provider>;
}
```

## Examples

Results are memoized by fields, not just by reference:

```jsx
const value = Context.usePartialContext((row) => ({
    x: row.foo,
    y: row.boo,
}));
```

Pass deps of your getter function to force update:

```jsx
const [counter] = useState();
const value = Context.usePartialContext(
    (data) => data.smth + counter,
    [counter]
);
```

Pass custom comparison function for memoization (by default is good btw):

```jsx
const value = Context.usePartialContext(
    getter,
    deps,
    (nextValue, prevValue) => nextValue === prevValue
);
```

Decide when to update based on prev result:

```jsx
const value = Context.usePartialContext((ctxData, prevResult) => {
    // no updates, everything is ok
    if (prevResult.status === "ok") return prevResult;

    // waiting
    if (ctxData.loading) return { status: "not ok" };

    // loaded, pick data
    return { status: "ok", data: ctxData.data.smth };
});
```

## Api

`createPartialContext<T>()` returns context object:

```
{
    Provider
    usePartialContext
    Consumer
    useContext
    PartialConsumer
}
```

#### `context.usePartialContext(getter, deps?, isEqual?)`

```ts
context.usePartialContext<Result>(
    getter: (contextData: ContextDataT, prevResult?: Result): Result,
    deps?: any[],
    isEqual?: (next: Result, prev: Result): boolean
): R
```

`getter` transforms value from context to result.  
`deps` is used to force get new value from context with new `getter` function.  
`isEqual` is custom comparison method for result value.

## Alternatives

As an alternative there is `use-context-selector` but:

-   it has more impact on performance
-   no memoization for returned objects
-   no deps for selector function
-   stale props problem & sometimes inconsistent data when passing through props + context

import { memo, useCallback, useMemo } from "react";
import { createContext as createSelectorContext, useContextSelector } from "use-context-selector";
import type { ExampleStore } from "./example";

const StoreCtx = createSelectorContext<ExampleStore>(undefined!);

const Row = memo((props: { index: number }) => {
    // you should use multiple useContextSelector for proper work
    const value = useContextSelector(StoreCtx, ([data, setData]) => data[props.index]);
    const setData = useContextSelector(StoreCtx, ([data, setData]) => setData);

    const handleChange = useCallback((evt: any) => {
        setData(prevData => [
            ...prevData.slice(0, props.index),
            +evt.target.value,
            ...prevData.slice(props.index + 1),
        ])
    }, [props.index]);

    return (
        <div>
            {Math.random().toFixed(2)}
            <input type="number" value={value} onChange={handleChange} />
        </div>
    );
});

const ListSum = memo(() => {
    const sum = useContextSelector(StoreCtx, ([data]) => data.reduce((sum, x) => sum + x, 0));
    return <div>{sum}</div>
});

const ListRenderer = memo((props: { length: number }) => (
    <>{Array.from({ length: props.length }).map((_, i) => (
        <Row key={i} index={i} />
    ))}</>
));

export const ExampleContextSelector = (props: { store: ExampleStore }) => {
    const [state] = props.store;

    return (
        <StoreCtx.Provider value={props.store}>
            <div>if row will be updated, random values will change</div>
            <pre>{`
                // you should use multiple useContextSelector for proper work
                // and there is no other way as it compares by reference
                const value = useContextSelector(StoreCtx, ([data, setData]) => data[props.index]);
                const setData = useContextSelector(StoreCtx, ([data, setData]) => setData);
            `}</pre>
            <ListSum />
            <ListRenderer length={state.length} />
        </StoreCtx.Provider>
    );
};

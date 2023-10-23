import { memo, useCallback, useMemo } from "react";
import { createContext as createSelectorContext, useContextSelector } from "use-context-selector";
import type { ExampleStore } from "./example";

const StoreCtx = createSelectorContext<ExampleStore>(undefined!);

const Row = memo((props: { index: number }) => {
    // you should use multiple useContextSelector for proper work
    const value = useContextSelector(StoreCtx, ([data, setData]) => data[props.index] + Math.random());
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

export const ExampleContextSelectorHeavy = (props: { store: ExampleStore }) => {
    const [state] = props.store;

    return (
        <StoreCtx.Provider value={props.store}>
            <div>if row will be updated, random values will change</div>
            <pre>{`
                Imagine we have something heavy inside selector and we want to decide when to update
            `}</pre>
            {state.map((_, i) => (
                <Row key={i} index={i} />
            ))}
        </StoreCtx.Provider>
    );
};

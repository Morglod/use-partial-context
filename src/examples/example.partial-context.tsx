import { memo, useCallback, useMemo } from "react";
import { createPartialContext } from "..";
import type { ExampleStore } from "./example";

const StoreCtx = createPartialContext<ExampleStore>();

const Row = memo((props: { index: number }) => {
    const { value, setData } = StoreCtx.usePartialContext(([data, setData]) => ({
        value: data[props.index],
        setData
    }), [props.index]);

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

export const ExamplePartialContext = (props: { store: ExampleStore }) => {
    const [state] = props.store;

    return (
        <StoreCtx.Provider value={props.store}>
            <div>if row will be updated, random values will change</div>
            <pre>{`
            // everything just works
            const { value, setData } = StoreCtx.usePartialContext(([data, setData]) => ({
                value: data[props.index],
                setData
            }));
            `}</pre>
            <div>{state.reduce((sum, x) => sum + x, 0)}</div>
            {state.map((_, i) => (
                <Row key={i} index={i} />
            ))}
        </StoreCtx.Provider>
    );
};

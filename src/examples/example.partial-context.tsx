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

const ListSum = memo(() => {
    const sum = StoreCtx.usePartialContext(([data]) => data.reduce((sum, x) => sum + x, 0));
    return <div>{sum}</div>
});

const ListRenderer = memo((props: { length: number }) => (
    <>{Array.from({ length: props.length }).map((_, i) => (
        <Row key={i} index={i} />
    ))}</>
));

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
            <ListSum />
            <ListRenderer length={state.length} />
        </StoreCtx.Provider>
    );
};

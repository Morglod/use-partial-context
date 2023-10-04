import { memo, useCallback, useMemo } from "react";
import { createPartialContext } from ".";
import type { ExampleStore } from "./example";

const StoreCtx = createPartialContext<ExampleStore>();

type PartialResult = {
    value: number;
    prevValue: number;
    setData: React.Dispatch<React.SetStateAction<number[]>>;
};

const Row = memo((props: { index: number }) => {
    const { value, setData } = StoreCtx.usePartialContext<PartialResult>(([data, setData], prevValue) => {
        if (prevValue?.prevValue === data[props.index]) return prevValue;
        return {
            value: data[props.index] + Math.random(),
            prevValue: data[props.index],
            setData
        };
    }, [props.index]);

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

export const ExamplePartialContextHeavy = (props: { store: ExampleStore }) => {
    const [state] = props.store;

    return (
        <StoreCtx.Provider value={props.store}>
            <div>if row will be updated, random values will change</div>
            <pre>{`
                Imagine we have something heavy inside selector and we want to decide when to update

                Because usePartialContext pass previous result, we could decide when to update
            `}</pre>
            {state.map((_, i) => (
                <Row key={i} index={i} />
            ))}
        </StoreCtx.Provider>
    );
};

import { memo, useCallback } from "react";
import { createContext as createSelectorContext, useContextSelector } from "use-context-selector";
import type { ExampleStore } from "./example";

const StoreCtx = createSelectorContext<ExampleStore>(undefined!);

const Row = memo((props: { index: number, value: number }) => {
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

    if (props.value !== value) {
        alert('dead prop');
    }

    return (
        <div>
            {props.value}
            <input type="number" value={value} onChange={handleChange} />
        </div>
    );
});

export const ExampleContextSelectorDeadProps = (props: { store: ExampleStore }) => {
    const [state] = props.store;

    return (
        <StoreCtx.Provider value={props.store}>
            <a href="https://react-redux.js.org/api/hooks#stale-props-and-zombie-children" target="_blank">stale props</a>
            <br />
            <pre>You will see alert if dead prop found</pre>
            <hr />
            {state.map((_, i) => (
                <Row key={i} index={i} value={state[i]} />
            ))}
        </StoreCtx.Provider>
    );
};

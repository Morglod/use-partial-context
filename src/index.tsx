import { useContext as useContextReact, createContext, useEffect, useRef, useState } from "react";

type StateRef<T> = {
    data: T,
    subscribers: (() => void)[]
};

function defaultIsEqual<T>(next: T, prev: T) {
    if (next === prev) return true;

    if (Array.isArray(next)) {
        if (!Array.isArray(prev)) return false;
        if (next.length !== prev.length) return false;
        for (let i = 0; i < next.length; ++i) {
            if (prev[i] !== next[i]) return false;
        }
        return true;
    }

    if (typeof next === 'object') {
        if (typeof prev !== 'object') return false;
        for (const k in next) {
            if (next[k] !== (prev as any)[k]) return false;
        }
        return true;
    }

    return false;
}

export function createPartialContext<T>() {
    const Ctx = createContext<{
        current: StateRef<T>
    }>(undefined!);

    function Provider(props: { value: T, children?: any }) {
        const ref = useRef<StateRef<T>>({ subscribers: [] } as any);
        ref.current.data = props.value;

        useEffect(() => {
            ref.current.subscribers.forEach(x => x());
        }, [props.value]);

        return <Ctx.Provider value={ref}>{props.children}</Ctx.Provider>
    }

    function useContext() {
        const ref = useContextReact(Ctx);
        const [data, setData] = useState(ref.current.data);

        useEffect(() => {
            const handler = () => {
                setData(ref.current.data);
            };
            ref.current.subscribers.push(handler);
            return () => {
                ref.current.subscribers = ref.current.subscribers.filter(x => x !== handler);
            };
        }, [ref]);

        return data;
    }

    function usePartialContext<R>(
        getter: (data: T, prevValue?: R) => R,
        deps: any[] = [],
        isEqual: (next: R, prev: R) => boolean = defaultIsEqual
    ): R {
        const ref = useContextReact(Ctx);
        const prevCtxData = useRef<T>(ref.current.data);
        let [data, setData] = useState<R>(() => getter(ref.current.data));

        // handle components rerender & new props
        if (ref.current.data !== prevCtxData.current) {
            prevCtxData.current = ref.current.data;
            const nextData = getter(ref.current.data);
            if (!isEqual(nextData, data)) {
                data = nextData;
            }
        }

        useEffect(() => {
            // handle deps change & first effect call without deps change
            if (ref.current.data !== prevCtxData.current) {
                prevCtxData.current = ref.current.data;
                const nextData = getter(ref.current.data);
                if (!isEqual(nextData, data)) {
                    setData(nextData);
                }
            }

            // handle context change
            const handler = () => {
                setData(prevData => {
                    prevCtxData.current = ref.current.data;
                    const nextData = getter(ref.current.data, prevData);
                    if (isEqual(nextData, prevData)) return prevData;
                    return nextData;
                });
            };
            ref.current.subscribers.push(handler);
            return () => {
                ref.current.subscribers = ref.current.subscribers.filter(x => x !== handler);
            };
        }, deps);

        return data;
    }

    function Consumer(props: { children: (value: T) => any }) {
        const value = useContext();
        return props.children(value);
    }

    function PartialConsumer<R>(props: {
        selector: (data: T, prevValue?: R) => R,
        children: (value: R) => any,
        isEqual?: (next: R, prev: R) => boolean,
    }) {
        const value = usePartialContext(props.selector, [], props.isEqual);
        return props.children(value);
    }

    return {
        RealContext: Ctx,
        Provider,
        Consumer,
        PartialConsumer,
        useContext,
        usePartialContext
    };
}
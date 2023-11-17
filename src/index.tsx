import { useContext as useContextReact, createContext, useEffect, useRef, useState } from "react";

type StateRef<T> = {
    data: T,
    subscribers: (() => void)[]
};

export function pctxDefaultIsEqual<T>(next: T, prev: T) {
    if (next === prev) return true;

    if (Array.isArray(next)) {
        if (!Array.isArray(prev) || next.length !== prev.length) return false;
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

const strictEqual: <T>(x: T, y: T) => boolean = (x, y) => x === y;

export function createPartialContext<T>() {
    const Ctx = createContext<{
        current: StateRef<T>
    }>(undefined!);

    function Provider(props: { value: T, children?: any }) {
        const ref = useRef<StateRef<T>>({ subscribers: [] } as any);
        ref.current.data = props.value;

        // prevent rerender after mount
        const currentSubs = Array.from(ref.current.subscribers);
        useEffect(() => {
            currentSubs.forEach(x => x());
        }, [props.value]);

        return <Ctx.Provider value={ref}>{props.children}</Ctx.Provider>
    }

    function usePartialContext<R>(
        getter: (data: T, prevValue?: R) => R,
        deps: any[] = [],
        isEqual: (next: R, prev: R) => boolean = pctxDefaultIsEqual,
        isDataEqual: (next: T, prev: T) => boolean = strictEqual
    ): R {
        const ref = useContextReact(Ctx);
        const partialData = useRef<{ effectInit: boolean, ctx: T, getterValue: R }>(undefined!);
        if (partialData.current === undefined) {
            partialData.current = {
                effectInit: false,
                ctx: ref.current.data,
                getterValue: getter(ref.current.data)
            };
        }

        const [, setRerender] = useState(0);

        // handle components rerender & new props
        if (!isDataEqual(ref.current.data, partialData.current.ctx)) {
            partialData.current.ctx = ref.current.data;
            const nextGetterValue = getter(ref.current.data);
            if (!isEqual(nextGetterValue, partialData.current.getterValue)) {
                partialData.current.getterValue = nextGetterValue;
            }
        }

        useEffect(() => {
            // handle deps change & first effect call without deps change
            if (partialData.current.effectInit) {
                partialData.current.ctx = ref.current.data;
                const nextGetterValue = getter(ref.current.data);
                if (!isEqual(nextGetterValue, partialData.current.getterValue)) {
                    partialData.current.getterValue = nextGetterValue;
                    setRerender(x => x + 1);
                }
            }
            partialData.current.effectInit = true;

            // handle context change
            const handler = () => {
                if (!isDataEqual(ref.current.data, partialData.current.ctx)) {
                    partialData.current.ctx = ref.current.data;
                    const nextGetterValue = getter(ref.current.data, partialData.current.getterValue);
                    if (!isEqual(nextGetterValue, partialData.current.getterValue)) {
                        partialData.current.getterValue = nextGetterValue;
                        setRerender(x => x + 1);
                    }
                }
            };
            ref.current.subscribers.push(handler);
            return () => {
                ref.current.subscribers = ref.current.subscribers.filter(x => x !== handler);
            };
        }, deps);

        return partialData.current.getterValue;
    }

    function useContext() {
        return usePartialContext(x => x);
    }

    function Consumer<R>(props: {
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
        useContext,
        usePartialContext
    };
}

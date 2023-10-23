import { memo, useMemo } from "react";
import { createPartialContext, type PartialContext } from ".";
import { defaultIsEqual } from "./equal";

export function createChildPartialContext<R, CtxT extends PartialContext<any>, Props = {}, T = Parameters<CtxT["Provider"]>[0]["value"]>(
    context: CtxT,
    getter: (data: T, prevValue: R | undefined, props: Props) => R,
    isEqual: (next: R, prev: R) => boolean = defaultIsEqual
) {
    const childCtx = createPartialContext<R>();

    const Provider = memo((props: Props & { children: any }) => {
        const { children, ...restProps } = props;
        const childValue = context.usePartialContext((data, prevValue) => getter(data, prevValue, props), [Object.values(restProps)], isEqual);

        return <childCtx.Provider value={childValue}>{children}</childCtx.Provider>
    });

    return {
        ...childCtx,
        Provider,
    };
}

export function mergeWithPartialContext<T extends PartialContext<any>[], N>(ctxs: T, merger: T extends PartialContext<infer R>[] ? (data: R[]) => N : never): Omit<PartialContext<N>, 'Provider'> & { Provider: (props: { children: any }) => any } {
    const childCtx = createPartialContext<N>();

    const Provider = memo((props: { children: any }) => {
        const values = Array.from({ length: ctxs.length });
        for (let i = 0; i < ctxs.length; ++i) {
            values[i] = ctxs[i].useContext();
        }
        const mergedValue: N = useMemo(() => {
            return merger(values);
        }, values);

        return <childCtx.Provider value={mergedValue}>{props.children}</childCtx.Provider>
    });

    return {
        ...childCtx,
        Provider,
    };
}
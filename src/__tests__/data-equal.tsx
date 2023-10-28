import "@testing-library/jest-dom";
import { FC } from "react";
import { waitFor, renderHook } from "@testing-library/react";
import { createPartialContext } from "..";

describe("isDataEqual", () => {
    const StoreCtx = createPartialContext<number[]>();

    const WrapperRnd: FC<{ children: any }> = ({ children }) => (
        <StoreCtx.Provider value={[Math.random()]}>
            {children}
        </StoreCtx.Provider>
    );

    const constValue = [1, 2, 3];
    const Wrapper: FC<{ children: any }> = ({ children }) => (
        <StoreCtx.Provider value={constValue}>
            {children}
        </StoreCtx.Provider>
    );

    it("data always equal", async () => {
        const dataEqual = (x: number[], y: number[]) => true;

        const getter = jest.fn((x: number[]) => x[0]);
        const rr = renderHook(() => StoreCtx.usePartialContext(getter, undefined, undefined, dataEqual), { wrapper: WrapperRnd });
        const memoizedValue = rr.result.current;
        expect(getter).toBeCalledTimes(1);

        rr.rerender();

        await waitFor(() => {
            expect(rr.result.current).toBe(memoizedValue);
        });

        expect(getter).toBeCalledTimes(1);
    });

    it("data always not equal", async () => {
        const dataEqual = (x: number[], y: number[]) => false;

        const getter = jest.fn((x: number[]) => x[1]);
        const rr = renderHook(() => StoreCtx.usePartialContext(getter, undefined, undefined, dataEqual), { wrapper: Wrapper });
        expect(rr.result.current).toBe(2);
        expect(getter).toBeCalledTimes(2);

        rr.rerender();

        await waitFor(() => {
            expect(rr.result.current).toBe(2);
        });

        expect(getter).toBeCalledTimes(3);
    });
});

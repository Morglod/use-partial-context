import "@testing-library/jest-dom";
import { FC } from "react";
import { waitFor, renderHook } from "@testing-library/react";
import { createPartialContext } from "..";

describe("getter call times", () => {
    const StoreCtx = createPartialContext<number[]>();

    const wrapperValue = [0, 1, 2];
    const Wrapper: FC<{ children: any }> = ({ children }) => (
        <StoreCtx.Provider value={wrapperValue}>
            {children}
        </StoreCtx.Provider>
    );

    it("value", async () => {
        const refc = { i: 0 };

        const getter = jest.fn((x: number[]) => x[1] + refc.i);

        const rr = renderHook(() => StoreCtx.usePartialContext(getter, [refc.i]), { wrapper: Wrapper });
        expect(rr.result.current).toBe(1);
        expect(getter).toBeCalledTimes(1);

        refc.i++;
        rr.rerender();

        await waitFor(() => {
            expect(rr.result.current).toBe(2);
        });

        expect(getter).toBeCalledTimes(2);
    });
});

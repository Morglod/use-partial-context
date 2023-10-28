import "@testing-library/jest-dom";
import { FC, memo } from "react";
import { render } from "@testing-library/react";
import { createPartialContext } from "..";

describe("just works", () => {
    it("one pass render", () => {
        const StoreCtx = createPartialContext<number[]>();

        const Top = () => (
            <StoreCtx.Provider value={[1, 2, 3]}>
                <StoreCtx.Consumer selector={x => x[1]}>
                    {x => <div data-testid="a">{x}</div>}
                </StoreCtx.Consumer>
            </StoreCtx.Provider>
        );

        const rr = render(<Top />);
        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });

    it("raw context", () => {
        const StoreCtx = createPartialContext<number[]>();

        const Bottom = () => {
            const ctx = StoreCtx.useContext();
            return <div data-testid="a">{ctx[1]}</div>
        };

        const Top = () => (
            <StoreCtx.Provider value={[1, 2, 3]}>
                <Bottom />
            </StoreCtx.Provider>
        );

        const rr = render(<Top />);
        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });

    it("memo update", () => {
        const StoreCtx = createPartialContext<number[]>();

        const Bottom = memo(() => {
            const x = StoreCtx.usePartialContext(x => x[1]);
            return <div data-testid="a">{x}</div>
        });

        const Top: FC<{ value: number[] }> = ({ value }) => (
            <StoreCtx.Provider value={value}>
                <Bottom />
            </StoreCtx.Provider>
        );

        const rr = render(<Top value={[1, 2, 3]} />);
        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");

        rr.rerender(<Top value={[4, 5, 6]} />);
        const el2 = rr.getByTestId('a');
        expect(el2).toBeTruthy();
        expect(el2).toHaveTextContent("5");
    });
});

import "@testing-library/jest-dom";
import { FC } from "react";
import { render } from "@testing-library/react";
import { createPartialContext } from "..";

describe("dead props", () => {
    it("no dead props", () => {
        const StoreCtx = createPartialContext<number[]>();

        const Top: FC<{ value: number[] }> = ({ value }) => (
            <StoreCtx.Provider value={value}>
                <StoreCtx.Consumer selector={x => x[1]}>
                    {x => <div data-testid="a">{x}</div>}
                </StoreCtx.Consumer>
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

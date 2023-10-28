import "@testing-library/jest-dom";
import { FC, memo, useState } from "react";
import { act, render, waitFor } from "@testing-library/react";
import { createPartialContext } from "..";

function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
}

describe("memo", () => {
    it("no changes", () => {
        const StoreCtx = createPartialContext<number[]>();
        let listRenders = 0;
        let rowRenders = 0;
        let appRenders = 0;

        const Row = memo((props: { index: number }) => {
            ++rowRenders;
            const x = StoreCtx.usePartialContext(x => x[props.index], [props.index]);
            return <div>{x}</div>
        });

        const List = memo((props: { length: number }) => {
            ++listRenders;
            return <>{Array.from({ length: props.length }).map((_, i) => (
                <Row index={i} key={i} />
            ))
            }</>
        });

        const App: FC<{ value: number[] }> = ({ value }) => {
            ++appRenders;
            return (
                <StoreCtx.Provider value={value}>
                    <List length={value.length} />
                </StoreCtx.Provider>
            )
        };

        const rr = render(<App value={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />);
        rr.rerender(<App value={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />);

        expect(appRenders).toBe(2);
        expect(listRenders).toBe(1);
        expect(rowRenders).toBe(10);
    });

    it("state change", async () => {
        const Ctx = createPartialContext<any>();

        const Counter = memo(() => {
            const setCount = Ctx.usePartialContext(x => x[1]);
            return <button data-testid="upbtn" onClick={() => setCount((count: number) => count + 1)}>
                UP
            </button>
        });

        const Count = memo(() => {
            const value = Ctx.usePartialContext(x => x[0]);
            return <div data-testid="value">{value}</div>;
        });

        const App = memo(() => {
            const [count, setCount] = useState(0);
            return (
                <Ctx.Provider value={[count, setCount]}>
                    <Counter />
                    <Count />
                </Ctx.Provider>
            )
        });

        const rr = render(<App />);
        await act(() => rr.getByTestId('upbtn').click());
        await waitFor(() => sleep(3000), { timeout: 5000 });
        await waitFor(() => {
            expect(rr.getByTestId("value")).toHaveTextContent("1");
        });
    });

    it("state change no memo", async () => {
        const Ctx = createPartialContext<any>();

        const Counter = () => {
            const setCount = Ctx.usePartialContext(x => x[1]);
            return <button data-testid="upbtn" onClick={() => setCount((count: number) => count + 1)}>
                UP
            </button>
        }

        const Count = () => {
            const value = Ctx.usePartialContext(x => x[0]);
            return <div data-testid="value">{value}</div>;
        }

        const App = () => {
            const [count, setCount] = useState(0);
            return (
                <Ctx.Provider value={[count, setCount]}>
                    <Counter />
                    <Count />
                </Ctx.Provider>
            )
        }

        const rr = render(<App />);
        await act(() => rr.getByTestId('upbtn').click());
        await waitFor(() => sleep(3000), { timeout: 5000 });
        await waitFor(() => {
            expect(rr.getByTestId("value")).toHaveTextContent("1");
        });
    });
});

import "@testing-library/jest-dom";
import { FC, memo } from "react";
import { render } from "@testing-library/react";
import { createPartialContext } from "..";

describe("detailed", () => {
    const StoreCtx = createPartialContext<number[]>();

    const BottomValue = memo(() => {
        const x = StoreCtx.usePartialContext(x => x[1]);
        return <div data-testid="a">{x}</div>
    });
    const BottomArray = memo(() => {
        const x = StoreCtx.usePartialContext(x => x);
        return <div data-testid="a">{x[1]}</div>
    });
    const BottomObj = memo(() => {
        const x = StoreCtx.usePartialContext(x => ({ a: x[0], b: x[1], c: x[2] }));
        return <div data-testid="a">{x.b}</div>
    });

    const createTop: (Bottom: FC<{}>) => FC<{ value: number[] }> = (Bottom) => memo(({ value }) => (
        <StoreCtx.Provider value={value}>
            <Bottom />
        </StoreCtx.Provider>
    ));

    it("value memo", () => {
        const Top = createTop(BottomValue);

        const rr = render(<Top value={[4, 5, 6]} />);
        rr.rerender(<Top value={[1, 2, 3]} />);

        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });

    it("array memo", () => {
        const Top = createTop(BottomArray);

        const rr = render(<Top value={[4, 5, 6]} />);
        rr.rerender(<Top value={[1, 2, 3]} />);

        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });

    it("array memo same", () => {
        const Top = createTop(BottomArray);

        const rr = render(<Top value={[1, 2, 3]} />);
        rr.rerender(<Top value={[1, 2, 3]} />);

        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });

    it("object memo", () => {
        const Top = createTop(BottomObj);

        const rr = render(<Top value={[4, 5, 6]} />);
        rr.rerender(<Top value={[1, 2, 3]} />);

        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });

    it("object memo same", () => {
        const Top = createTop(BottomObj);

        const rr = render(<Top value={[1, 2, 3]} />);
        rr.rerender(<Top value={[1, 2, 3]} />);

        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });
});

describe("detailed equal", () => {
    const StoreCtx = createPartialContext<{ arr: number[] }>();

    const BottomArray = memo(() => {
        const x = StoreCtx.usePartialContext(x => x.arr);
        return <div data-testid="a">{x?.[1]}</div>
    });

    const createTopNoMemo: (Bottom: FC<{}>) => FC<{ value: number[] }> = (Bottom) => ({ value }) => (
        <StoreCtx.Provider value={{ arr: value }}>
            <Bottom />
        </StoreCtx.Provider>
    );

    it("same array", () => {
        const Top = createTopNoMemo(BottomArray);

        const value = [1, 2, 3];
        const rr = render(<Top value={value} />);
        rr.rerender(<Top value={value} />);

        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });

    it("length changed array", () => {
        const Top = createTopNoMemo(BottomArray);

        const rr = render(<Top value={[1, 2, 3]} />);
        rr.rerender(<Top value={[1, 2, 3, 4]} />);

        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });
    it("obj to array", () => {
        const Top = createTopNoMemo(BottomArray);

        const rr = render(<Top value={{ 0: 1, 1: 2, 2: 3 } as any} />);
        rr.rerender(<Top value={[1, 2, 3]} />);

        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });

    it("array to obj", () => {
        const Top = createTopNoMemo(BottomArray);

        const rr = render(<Top value={undefined!} />);
        rr.rerender(<Top value={{ 0: 1, 1: 2, 2: 3 } as any} />);

        const el = rr.getByTestId('a');
        expect(el).toBeTruthy();
        expect(el).toHaveTextContent("2");
    });
});

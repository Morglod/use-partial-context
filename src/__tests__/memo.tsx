import "@testing-library/jest-dom";
import { FC, memo } from "react";
import { render } from "@testing-library/react";
import { createPartialContext } from "..";

describe("memo", () => {
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

    it("no changes", () => {
        const rr = render(<App value={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />);
        rr.rerender(<App value={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />);

        expect(appRenders).toBe(2);
        expect(listRenders).toBe(1);
        expect(rowRenders).toBe(10);
    });
});

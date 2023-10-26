import { Dispatch, SetStateAction, useState } from "react";
import { createRoot } from "react-dom/client";
import { ExamplePartialContext } from "./example.partial-context";
import { ExampleContextSelector } from "./example.context-selector";
import { ExamplePartialContextDeadProps } from "./example.partial-context.dead-props";
import { ExampleContextSelectorDeadProps } from "./example.context-selector.dead-props";
import { ExamplePartialContextHeavy } from "./example.partial-context.heavy";
import { ExampleContextSelectorHeavy } from "./example.context-selector.heavy";

export type ExampleStore = [number[], Dispatch<SetStateAction<number[]>>];

const variants = {
    'use-partial-context': ExamplePartialContext,
    'use-context-selector': ExampleContextSelector,
    'use-partial-context dead props': ExamplePartialContextDeadProps,
    'use-context-selector dead props': ExampleContextSelectorDeadProps,
    'use-partial-context heavy': ExamplePartialContextHeavy,
    'use-context-selector heavy': ExampleContextSelectorHeavy,
};

const App = () => {
    const store = useState(() => Array.from({ length: 100 }).map((_, i) => i));
    const [variant, setVariant] = useState<keyof typeof variants>('use-partial-context');
    const Component = variants[variant];

    return (
        <>
            <div>
                <select onChange={evt => setVariant(evt.target.value as any)}>
                    {Object.keys(variants).map(k => (
                        <option key={k} value={k}>{k}</option>
                    ))}
                </select>
            </div>
            <Component store={store} />
        </>
    );
};

createRoot(document.body).render(<App />);
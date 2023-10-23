export function defaultIsEqual<T>(next: T, prev: T) {
    if (next === prev) return true;

    if (Array.isArray(next)) {
        if (!Array.isArray(prev)) return false;
        if (next.length !== prev.length) return false;
        for (let i = 0; i < next.length; ++i) {
            if (prev[i] !== next[i]) return false;
        }
        return true;
    }

    if (typeof next === "object") {
        if (typeof prev !== "object") return false;
        for (const k in next) {
            if (next[k] !== (prev as any)[k]) return false;
        }
        return true;
    }

    return false;
}

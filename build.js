const { build } = require("esbuild");
const { dependencies, peerDependencies } = require("./package.json");

const entryFile = "src/index.tsx";
const shared = {
    bundle: true,
    entryPoints: [entryFile],
    // Treat all dependencies in package.json as externals to keep bundle size to a minimum
    external: Object.keys({ ...dependencies, ...peerDependencies }),
    logLevel: "info",
    minify: true,
    sourcemap: true,
};

build({
    ...shared,
    format: "esm",
    outfile: "./lib/index.esm.js",
    target: ["esnext", "node12.22.0"],
});

build({
    ...shared,
    format: "cjs",
    outfile: "./lib/index.cjs.js",
    target: ["esnext", "node12.22.0"],
});
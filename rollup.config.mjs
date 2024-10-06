import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.jsx",
    format: "cjs"
  },
  plugins: [typescript({ compilerOptions: { target: "es5" } })]
};

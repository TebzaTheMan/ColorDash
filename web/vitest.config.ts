import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      types: path.resolve(__dirname, "./types"),
      game: path.resolve(__dirname, "./game"),
    },
  },
});

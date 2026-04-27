import { defineConfig } from "orval";

export default defineConfig({
  colordash: {
    input: "../api/Client/ColorDash.Api.json",
    output: {
      target: "./lib/api/generated/colordash.ts",
      schemas: "./lib/api/generated/model",
      client: "fetch",
      override: {
        mutator: {
          path: "./lib/api/customFetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});

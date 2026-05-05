// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import * as React from "react";
import { useContext } from "react";
import { GameContext, GameProvider } from "../game.context";

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const startGameMock = vi.fn();
vi.mock("lib/api/gameApi", () => ({
  gameApi: {
    startGame: (mode: string, options?: RequestInit) =>
      startGameMock(mode, options),
    submitGuess: vi.fn(),
    endGame: vi.fn(),
    getHighscores: vi.fn(),
  },
}));

type CapturedContext = React.ContextType<typeof GameContext>;

function captureContext(): CapturedContext {
  let captured: CapturedContext | null = null;
  function Probe() {
    captured = useContext(GameContext);
    return null;
  }
  render(
    <GameProvider>
      <Probe />
    </GameProvider>
  );
  if (!captured) throw new Error("GameContext was not captured.");
  return captured;
}

describe("GameProvider.startGame in-flight dedup", () => {
  beforeEach(() => {
    startGameMock.mockReset();
  });

  it("returns the same in-flight promise to concurrent callers and only fires the API once", async () => {
    let resolveApi: (value: unknown) => void = () => {};
    const apiPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });
    startGameMock.mockReturnValue(apiPromise);

    const ctx = captureContext();

    let firstResult!: Promise<boolean>;
    let secondResult!: Promise<boolean>;
    act(() => {
      firstResult = ctx.startGame("rgb");
      secondResult = ctx.startGame("rgb");
    });

    expect(startGameMock).toHaveBeenCalledTimes(1);
    expect(firstResult).toBe(secondResult);

    await act(async () => {
      resolveApi({
        status: 200,
        data: {
          sessionId: "abc",
          mode: "rgb",
          colors: [],
          targetLabel: "",
          triesLeft: 3,
          startedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30_000).toISOString(),
        },
        headers: new Headers(),
      });
      await firstResult;
    });

    await expect(firstResult).resolves.toBe(true);
    await expect(secondResult).resolves.toBe(true);
  });
});

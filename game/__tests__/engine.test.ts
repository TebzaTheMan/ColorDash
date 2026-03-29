import { describe, it, expect, vi } from "vitest";
import { handleTimeUp, processGuess, resetGame, startGame } from "../engine";
import { IGameDependencies, IGameState } from "types";
import { DEFAULT_GAME_STATE, SCORING_RULES, NUM_COLORS } from "../constants";

// Helper to create game state with overrides
const makeState = (overrides: Partial<IGameState> = {}): IGameState => ({
  ...DEFAULT_GAME_STATE,
  mode: "rgb",
  colors: ["c1", "c2", "c3", "c4", "c5", "c6"],
  targetColor: "c1",
  ...overrides,
});

const makeDeps = (): IGameDependencies => ({
  generateColors: vi.fn(() => ["c1", "c2", "c3", "c4", "c5", "c6"]),
  pickCorrectColor: vi.fn(() => "c1"),
  now: vi.fn(() => 123),
});

describe("processGuess", () => {
  describe("when the user selects the correct color", () => {
    it.each(SCORING_RULES)(
      "should return correct and award $points points when $triesLeft tries are left",
      ({ triesLeft, points }) => {
        const deps = makeDeps();
        const state = makeState({ triesLeft, score: { points: 0, total: 0 } });

        const nextState = processGuess(state, 0, deps);

        expect(nextState).toMatchObject({
          triesLeft: DEFAULT_GAME_STATE.triesLeft,
          correctColors: 1,
          lastGuessResult: {
            result: "correct",
            id: 1,
          },
        });

        expect(nextState.score.points).toBe(points);
        expect(nextState.clickedColors).toEqual(Array(NUM_COLORS).fill(false));
      }
    );
  });

  describe("when the user selects the wrong color", () => {
    it.each([
      { triesLeft: 3, expectedResult: "wrong_but_continue", nextTries: 2 },
      { triesLeft: 2, expectedResult: "wrong_but_continue", nextTries: 1 },
      {
        triesLeft: 1,
        expectedResult: "wrong_and_exhausted",
        nextTries: DEFAULT_GAME_STATE.triesLeft,
      },
      {
        triesLeft: 0,
        expectedResult: "wrong_and_exhausted",
        nextTries: DEFAULT_GAME_STATE.triesLeft,
      },
    ])(
      "should return $expectedResult when $triesLeft tries are left",
      ({ triesLeft, expectedResult, nextTries }) => {
        const deps = makeDeps();
        const state = makeState({ triesLeft });

        const nextState = processGuess(state, 1, deps);

        expect(nextState).toMatchObject({
          triesLeft: nextTries,
          lastGuessResult: {
            result: expectedResult,
            id: 1,
          },
        });
      }
    );

    it("should mark the clicked color when continuing", () => {
      const deps = makeDeps();
      const state = makeState({ triesLeft: 3 });

      const nextState = processGuess(state, 1, deps);

      expect(nextState.clickedColors[1]).toBe(true);
    });

    it("should reset clicked colors when tries are exhausted", () => {
      const deps = makeDeps();
      const state = makeState({ triesLeft: 1 });

      const nextState = processGuess(state, 1, deps);

      expect(nextState.clickedColors).toEqual(Array(NUM_COLORS).fill(false));
    });
  });

  describe("guard clauses", () => {
    it("should return the same state when time is up", () => {
      const deps = makeDeps();
      const state = makeState({ timeUp: true });

      const nextState = processGuess(state, 0, deps);

      expect(nextState).toBe(state);
    });

    it("should return the same state when color is already clicked", () => {
      const deps = makeDeps();
      const clickedColors = Array(NUM_COLORS).fill(false);
      clickedColors[1] = true;

      const state = makeState({ clickedColors });

      const nextState = processGuess(state, 1, deps);

      expect(nextState).toBe(state);
    });
  });
});

describe("startGame", () => {
  const mockColors = ["c1", "c2", "c3"];
  const mockTarget = "c2";
  const mockTime = 123;

  const makeDeps = () => ({
    generateColors: vi.fn().mockReturnValue(mockColors),
    pickCorrectColor: vi.fn().mockReturnValue(mockTarget),
    now: vi.fn().mockReturnValue(mockTime),
  });

  it.each(["rgb", "hsl"] as const)(
    "should initialize game state correctly when mode is %s",
    (mode) => {
      const deps = makeDeps();

      const result = startGame(mode, deps);

      expect(result).toMatchObject({
        ...DEFAULT_GAME_STATE,
        mode,
        colors: mockColors,
        targetColor: mockTarget,
        gameStartTimestamp: mockTime,
      });

      expect(result.clickedColors).toEqual(Array(NUM_COLORS).fill(false));
    }
  );

  it("should call dependencies with correct values", () => {
    const deps = makeDeps();

    startGame("rgb", deps);

    expect(deps.generateColors).toHaveBeenCalledWith("rgb");
    expect(deps.pickCorrectColor).toHaveBeenCalledWith(mockColors);
    expect(deps.now).toHaveBeenCalled();
  });
});

describe("resetGame", () => {
  const mockColors = ["c1", "c2", "c3"];
  const mockTarget = "c2";
  const mockTime = 123;

  const makeDeps = () => ({
    generateColors: vi.fn().mockReturnValue(mockColors),
    pickCorrectColor: vi.fn().mockReturnValue(mockTarget),
    now: vi.fn().mockReturnValue(mockTime),
  });

  it("should return default state when mode is null", () => {
    const deps = makeDeps();
    const state = { ...DEFAULT_GAME_STATE, mode: null };

    const result = resetGame(state, deps);

    expect(result).toEqual(DEFAULT_GAME_STATE);
  });

  it("should reset game while preserving mode", () => {
    const deps = makeDeps();

    const state = makeState({ score: { points: 50, total: 100 } });

    const result = resetGame(state, deps);

    expect(result).toMatchObject({
      ...DEFAULT_GAME_STATE,
      mode: "rgb",
      colors: mockColors,
      targetColor: mockTarget,
      gameStartTimestamp: mockTime,
    });

    expect(result.clickedColors).toEqual(Array(NUM_COLORS).fill(false));
  });

  it("should call dependencies with correct values", () => {
    const deps = makeDeps();
    const state = makeState();

    resetGame(state, deps);

    expect(deps.generateColors).toHaveBeenCalledWith("rgb");
    expect(deps.pickCorrectColor).toHaveBeenCalledWith(mockColors);
    expect(deps.now).toHaveBeenCalled();
  });
});

describe("handleTimeUp", () => {
  const makeState = (overrides = {}) => ({
    ...DEFAULT_GAME_STATE,
    ...overrides,
  });

  it.each([
    { isNewHighscore: true },
    { isNewHighscore: false },
    { isNewHighscore: undefined },
  ])(
    "should set timeUp to true and isNewHighscore to $isNewHighscore",
    ({ isNewHighscore }) => {
      const state = makeState({ timeUp: false });

      const result = handleTimeUp(state, isNewHighscore);

      expect(result).toMatchObject({
        ...state,
        timeUp: true,
        isNewHighscore,
      });
    }
  );
});

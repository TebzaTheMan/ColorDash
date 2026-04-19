# API Reference

All requests must include the header:

```
X-Device-ID: {guid}
```

Base URL (dev): `http://localhost:5000`

---

## POST `/game/start`

Start a new game session for the given device and mode.

**Request body:**

```json
{ "mode": "rgb" }
```

`mode` is `"rgb"` or `"hsl"`.

**Response 201:**

```json
{
  "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "mode": "rgb",
  "colors": [
    "rgb(12,34,56)",
    "rgb(78,90,12)",
    "rgb(34,56,78)",
    "rgb(90,12,34)",
    "rgb(56,78,90)",
    "rgb(12,90,56)"
  ],
  "targetLabel": "rgb(34,56,78)",
  "triesLeft": 3,
  "startedAt": "2026-04-19T10:00:00Z",
  "expiresAt": "2026-04-19T10:00:30Z"
}
```

---

## POST `/game/{sessionId}/guess`

Submit a color block selection (0–5) for an active session.

**Request body:**

```json
{ "colorIndex": 2 }
```

**Response 200:**

```json
{
  "result": "Correct",
  "score": { "points": 10, "total": 10 },
  "triesLeft": 3,
  "gameOver": false,
  "nextColors": [
    "rgb(...)",
    "rgb(...)",
    "rgb(...)",
    "rgb(...)",
    "rgb(...)",
    "rgb(...)"
  ],
  "nextTargetLabel": "rgb(99,11,44)"
}
```

`result` is one of: `"correct"` | `"wrong_but_continue"` | `"wrong_and_exhausted"`

`nextColors` and `nextTargetLabel` are only present when the round advanced (i.e. result was `"Correct"` or `"WrongAndExhausted"`).

---

## POST `/game/{sessionId}/end`

End the session early or at expiry. Returns the final score and highscore comparison.

**Request body:** none

**Response 200:**

```json
{
  "finalScore": { "points": 85, "total": 100 },
  "isNewHighscore": true,
  "highscore": { "points": 85, "total": 100 },
  "sessionDurationMs": 28450
}
```

---

## GET `/highscores`

Retrieve the device's best recorded score for each game mode.

**Response 200:**

```json
{
  "rgb": { "points": 85, "total": 100 },
  "hsl": { "points": 70, "total": 100 }
}
```

Modes that have never been played are omitted from the response.

---

## Error Codes

All error responses use the `ErrorResponse` shape:

```json
{ "error": "Human-readable error message" }
```

| Code | Meaning                                                          |
| ---- | ---------------------------------------------------------------- |
| 400  | Bad Request — invalid input (bad mode, index out of range, etc.) |
| 403  | Forbidden — `X-Device-ID` does not match the session's owner     |
| 404  | Not Found — session ID does not exist                            |
| 410  | Gone — session has expired (past `expiresAt + toleranceSeconds`) |
| 500  | Internal Server Error                                            |

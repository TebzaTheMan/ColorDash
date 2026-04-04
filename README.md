<div align="center">
  <img src="images/logo.png" alt="Color Dash Logo" width="120" />
  <h1>Color Dash</h1>
  <p><strong>The ultimate color-matching challenge in RGB and HSL</strong></p>

[![Stargazers](https://img.shields.io/github/stars/TebzaTheMan/colordash?style=for-the-badge&color=ffd700)](https://github.com/TebzaTheMan/colordash/stargazers)
[![Forks](https://img.shields.io/github/forks/TebzaTheMan/colordash?label=FORKS&style=for-the-badge&color=808080)](https://github.com/TebzaTheMan/colordash/network/members)
[![License](https://img.shields.io/github/license/TebzaTheMan/colordash?color=green&label=LICENSE&style=for-the-badge)](https://github.com/TebzaTheMan/colordash/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues/TebzaTheMan/colordash?color=yellow&label=ISSUES&style=for-the-badge)](https://github.com/TebzaTheMan/colordash/issues)

[**Live Demo**](https://tebza.dev/colordash) • [**Read the Article**](https://tebza.dev/the-making-of-guessthecolor-game) • [**How to Play**](https://tebza.dev/how-to-identify-color-from-an-rgb-value)

</div>

<hr />

## 🎮 Game Overview

**Color Dash** is a fast-paced, educational, and addictive color-matching game designed to sharpen your understanding of **RGB** and **HSL** color models. Race against the clock to identify the target color from a set of options, aiming for a perfect score before time runs out!

![Game Preview](/screen%20rgb.png)

## ✨ Key Features

- 🌓 **Dual Modes**: Challenge yourself in either **RGB** (Red, Green, Blue) or **HSL** (Hue, Saturation, Lightness).
- ⏱️ **Timed Rounds**: 30-second adrenaline-pumping sessions to test your speed-matching skills.
- 🏆 **Local Highscores**: Track your progress and aim for the top of your personal leaderboard.
- 🎯 **Dynamic Scoring**: Earn points based on accuracy and speed. Perfect scores for first-try guesses!
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop experiences using **Chakra UI**.
- ⚛️ **Pure Logic Engine**: Decoupled game rules for consistent performance and easy extensibility.

## 🛠️ Technology Stack

| Category      | Technology                                      |
| :------------ | :---------------------------------------------- |
| **Framework** | [Next.js](https://nextjs.org/) (React)          |
| **Styling**   | [Chakra UI](https://chakra-ui.com/)             |
| **Motion**    | [Framer Motion](https://www.framer.com/motion/) |
| **Language**  | [TypeScript](https://www.typescriptlang.org/)   |
| **Testing**   | [Vitest](https://vitest.dev/)                   |
| **Tools**     | ESLint, Prettier, Husky                         |

## 🏗️ Project Architecture

Color Dash follows a **decoupled architecture** to ensure the game logic is pure, deterministic, and highly testable.

- **`game/`**: The core "brain" of the game. Contains pure functions (`engine.ts`) for state transitions, scoring rules, and color generation.
- **`features/`**: Modularized UI components (Highscores, Timer, Modals) that interact with the game state.
- **`reducers/`**: Side-effect-free React Reducers that wrap the core game engine.
- **`types/`**: Centralized domain types for consistent data structures across the app.

## 🚀 Getting Started

To run the project locally, follow these simple steps:

### 1. Clone the repository

```bash
git clone https://github.com/TebzaTheMan/colordash.git
cd colordash
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Build for production

```bash
npm run build
npm start
```

## 🧪 Testing

We value high-quality, bug-free code. Run the test suite using Vitest:

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run full project check (lint, format, types, build, test)
npm run test-all
```

## 🤝 Contributing

We welcome contributions! Whether it's adding a new game mode, improving the UI, or fixing a bug, here's how you can help:

1. **Fork** the repository.
2. **Create** a new feature branch: `git checkout -b feature/awesome-new-idea`.
3. **Commit** your changes: `git commit -m 'Add awesome new idea'`.
4. **Push** to the branch: `git push origin feature/awesome-new-idea`.
5. **Open** a Pull Request.

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

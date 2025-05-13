# RealTimePR

A CLI tool for real-time code review and feedback while coding.

## Features

- Run in the terminal as `realtimepr` or `npx realtimepr`
- Accept a source code file (like `.ts`, `.js`, `.py`) as input
- Analyze the code for:
  - Code quality (style, formatting)
  - Best practices
  - Potential bugs or smells
- Provide line-specific suggestions and summaries
- Output is user-friendly in the terminal (colors, clear formatting)
- Optional: Use OpenAI for deeper feedback

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Usage

Run the CLI on a file:

```bash
node dist/cli.js <path-to-file> [--type linting|suggestions|best-practices] [--openai]
```

Example:

```bash
node dist/cli.js sample.js --type linting
node dist/cli.js sample.js --type best-practices
```

## Extending

- Add new feedback types by creating a new helper in `src/` and updating `src/core.ts`.
- Improve suggestions by enhancing the logic in `src/suggest.ts` or `src/bestpractices.ts`.
- Change output formatting in `src/cli.ts`.
- Add more LLMs by creating new modules similar to `src/openai.ts`.

## License

MIT 
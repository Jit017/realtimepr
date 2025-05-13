# RealTimePR

A CLI tool for real-time code review and feedback. This tool helps developers get instant feedback on their code quality, best practices, and potential improvements.

## Features

- Run in your terminal
- Accepts any source code file
- Analyzes code quality using ESLint
- Provides suggestions for improvement
- Checks for best practices
- Optional: Use OpenAI for deeper feedback (requires API key)

## Installation

You can install RealTimePR globally using npm:

```bash
npm install -g @jit017/realtimepr
```

Or use it directly with npx:

```bash
npx @jit017/realtimepr <file> --type <linting|bestpractices>
```

## Usage

Run the CLI on a file (free features):

```bash
realtimepr <file> --type <linting|bestpractices>
```

For example:

```bash
realtimepr sample.js --type linting
realtimepr sample.js --type bestpractices
```

### Optional OpenAI Integration

If you have an OpenAI API key and want deeper analysis, you can use:

```bash
realtimepr <file> --type <linting|bestpractices> --openai
```

Note: The OpenAI integration is completely optional. The tool works perfectly fine without it, providing free code analysis using ESLint and built-in best practices checks.

## Development

1. Clone the repository:
```bash
git clone https://github.com/Jit017/realtimepr.git
cd realtimepr
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run the CLI:
```bash
npm start <file> --type <linting|bestpractices>
```

## Extending

You can extend this tool by:

1. Adding new feedback types
2. Improving suggestions
3. Changing output formatting
4. Adding more LLMs

## License

This project is licensed under the MIT License.

## Links

- [GitHub Repository](https://github.com/Jit017/realtimepr)
- [NPM Package](https://www.npmjs.com/package/@jit017/realtimepr) 
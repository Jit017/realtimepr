# Contributing to RealTimePR

Thank you for your interest in contributing to RealTimePR! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork and clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/realtimepr.git
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

## Development Workflow

1. Create a new branch for your feature/fix:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and run tests:
```bash
npm test
```

3. Run linting:
```bash
npm run lint
```

4. Commit your changes with a descriptive message:
```bash
git commit -m "feat: add new feature"
```

5. Push to your fork and create a pull request

## Testing

- Run tests: `npm test`
- Watch mode: `npm run test:watch`
- Coverage report: `npm run test:coverage`

## Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Write tests for new features
- Update documentation for changes

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md with your changes
3. Ensure all tests pass
4. Ensure linting passes
5. Request review from maintainers

## Adding New Analysis Types

1. Create a new file in `src/` for your analysis type
2. Implement the analysis function
3. Add tests in `src/__tests__/`
4. Update the CLI to support the new type
5. Update documentation

## Questions?

Feel free to open an issue for any questions or concerns. 
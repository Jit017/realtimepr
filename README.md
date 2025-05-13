# RealTimePR

A CLI tool for real-time code review and feedback. This tool helps developers get instant feedback on their code quality, best practices, and potential improvements.

## Features

- Run in your terminal
- Accepts any source code file
- Analyzes code quality using ESLint
- Provides suggestions for improvement
- Checks for best practices
- Advanced code analysis:
  - Cyclomatic complexity
  - Cognitive complexity
  - Maintainability index
  - Code smells detection
  - Long function detection
  - Magic number detection
  - Commented code detection
  - Function complexity and structure
  - Code duplication detection
  - Code organization checks
  - Code style verification
  - Code quality metrics
- Security analysis:
  - Input validation
  - SQL injection prevention
  - XSS protection
  - Secure coding practices
- Performance analysis:
  - Memory usage optimization
  - CPU usage optimization
  - Network optimization
  - Resource management
- Style analysis:
  - Code formatting
  - Naming conventions
  - Documentation standards
  - Code organization
- Dependency analysis:
  - Package version checks
  - Security vulnerabilities
  - Outdated dependencies
  - Unused dependencies
- Optional: Use OpenAI for deeper feedback (requires API key)

## Installation

You can install RealTimePR globally using npm:

```bash
npm install -g @jit017/realtimepr
```

Or use it directly with npx:

```bash
npx @jit017/realtimepr <file> --type <linting|bestpractices|analysis|security|performance|style|dependencies>
```

## Usage

Run the CLI on a file (free features):

```bash
realtimepr <file> --type <linting|bestpractices|analysis|security|performance|style|dependencies>
```

For example:

```bash
# Basic linting
realtimepr sample.js --type linting

# Best practices check
realtimepr sample.js --type bestpractices

# Advanced code analysis
realtimepr sample.js --type analysis

# Security analysis
realtimepr sample.js --type security

# Performance analysis
realtimepr sample.js --type performance

# Style analysis
realtimepr sample.js --type style

# Dependency analysis
realtimepr sample.js --type dependencies
```

### Analysis Features

The tool provides comprehensive analysis across multiple dimensions:

#### Code Analysis
- **Complexity Metrics**:
  - Cyclomatic complexity (measures code complexity)
  - Cognitive complexity (measures code readability)
  - Maintainability index (overall code quality score)
- **Code Smells Detection**:
  - Long functions (>20 lines)
  - Magic numbers
  - Commented out code
  - Function complexity and structure
  - Code duplication
  - Code organization
  - Code style
  - Code quality

#### Security Analysis
- Input validation checks
- SQL injection prevention
- XSS protection
- Secure coding practices
- Authentication and authorization
- Data encryption
- Secure communication

#### Performance Analysis
- Memory usage optimization
- CPU usage optimization
- Network optimization
- Resource management
- Caching strategies
- Database optimization
- Async operation handling

#### Style Analysis
- Code formatting
- Naming conventions
- Documentation standards
- Code organization
- Modern JavaScript/TypeScript features
- Best practices adherence

#### Dependency Analysis
- Package version checks
- Security vulnerabilities
- Outdated dependencies
- Unused dependencies
- Dependency conflicts
- License compliance

### Optional OpenAI Integration

If you have an OpenAI API key and want deeper analysis, you can use:

```bash
realtimepr <file> --type <linting|bestpractices|analysis|security|performance|style|dependencies> --openai
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
npm start <file> --type <linting|bestpractices|analysis|security|performance|style|dependencies>
```

## Extending

You can extend this tool by:

1. Adding new feedback types
2. Improving suggestions
3. Changing output formatting
4. Adding more LLMs
5. Customizing analysis rules
6. Adding new analysis categories

## License

This project is licensed under the MIT License.

## Links

- [GitHub Repository](https://github.com/Jit017/realtimepr)
- [NPM Package](https://www.npmjs.com/package/@jit017/realtimepr) 
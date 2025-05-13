# RealTimePR API Documentation

## Core Functions

### `analyzeCode(code: string): Promise<Feedback>`
Analyzes code for various metrics and issues.

```typescript
interface Feedback {
  summary: string;
  suggestions: Array<{
    line: number;
    message: string;
  }>;
}
```

### `bestPractices(code: string): Promise<Feedback>`
Checks code against best practices.

### `securityAnalysis(code: string): Promise<Feedback>`
Performs security analysis on the code.

### `performanceAnalysis(code: string): Promise<Feedback>`
Analyzes code for performance issues.

### `styleAnalysis(code: string): Promise<Feedback>`
Checks code style and formatting.

### `dependencyAnalysis(code: string): Promise<Feedback>`
Analyzes project dependencies.

## Analysis Types

### Code Analysis
- Cyclomatic complexity
- Cognitive complexity
- Maintainability index
- Code smells detection
- Function complexity
- Code duplication
- Code organization
- Code style
- Code quality

### Security Analysis
- Input validation
- SQL injection prevention
- XSS protection
- Secure coding practices
- Authentication checks
- Data encryption
- Secure communication

### Performance Analysis
- Memory usage
- CPU optimization
- Network optimization
- Resource management
- Caching strategies
- Database optimization
- Async operations

### Style Analysis
- Code formatting
- Naming conventions
- Documentation
- Code organization
- Modern JavaScript/TypeScript features
- Best practices

### Dependency Analysis
- Package versions
- Security vulnerabilities
- Outdated dependencies
- Unused dependencies
- Dependency conflicts
- License compliance

## CLI Usage

```bash
realtimepr <file> --type <analysis-type> [--openai]
```

Analysis types:
- `linting`: Basic code linting
- `bestpractices`: Best practices check
- `analysis`: Advanced code analysis
- `security`: Security analysis
- `performance`: Performance analysis
- `style`: Style analysis
- `dependencies`: Dependency analysis

## Configuration

The tool can be configured through:
1. Command line arguments
2. Environment variables
3. Configuration file

### Environment Variables
- `OPENAI_API_KEY`: For OpenAI integration
- `REALTIMEPR_CONFIG`: Path to config file

### Configuration File
```json
{
  "rules": {
    "maxComplexity": 10,
    "maxFunctionLength": 20,
    "requireJSDoc": true
  },
  "openai": {
    "enabled": false,
    "model": "gpt-4"
  }
}
```

## Error Handling

The tool provides detailed error messages and suggestions for improvement. All analysis functions return a `Feedback` object with:
- Summary of findings
- Line-specific suggestions
- Severity levels
- Fix recommendations

## Examples

### Basic Usage
```typescript
import { analyzeCode } from '@jit017/realtimepr';

const code = `
  function example() {
    // Your code here
  }
`;

const feedback = await analyzeCode(code);
console.log(feedback);
```

### Custom Analysis
```typescript
import { bestPractices, securityAnalysis } from '@jit017/realtimepr';

const code = `
  // Your code here
`;

const [bestPracticesFeedback, securityFeedback] = await Promise.all([
  bestPractices(code),
  securityAnalysis(code)
]);
``` 
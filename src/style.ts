import { Feedback, Suggestion } from './core.js';

export async function analyzeStyle(code: string): Promise<Feedback> {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');

  // Check for naming conventions
  const namingPatterns = [
    {
      pattern: /const\s+[a-z]+\s*=/,
      message: 'Consider using UPPER_CASE for constant values.'
    },
    {
      pattern: /let\s+[A-Z][a-z]+\s*=/,
      message: 'Consider using camelCase for variable names.'
    },
    {
      pattern: /function\s+[a-z]+\s*\(/,
      message: 'Consider using camelCase for function names.'
    },
    {
      pattern: /class\s+[a-z]+\s*{/,
      message: 'Consider using PascalCase for class names.'
    },
    {
      pattern: /interface\s+[a-z]+\s*{/,
      message: 'Consider using PascalCase for interface names.'
    },
    {
      pattern: /type\s+[a-z]+\s*=/,
      message: 'Consider using PascalCase for type names.'
    },
    {
      pattern: /enum\s+[a-z]+\s*{/,
      message: 'Consider using PascalCase for enum names.'
    }
  ];

  // Check for code formatting
  const formattingPatterns = [
    {
      pattern: /^\s*[^\s].*[^\s]\s*$/,
      message: 'Consider removing trailing whitespace.'
    },
    {
      pattern: /[^\s]\s{2,}[^\s]/,
      message: 'Multiple spaces detected. Consider using a single space.'
    },
    {
      pattern: /[^\s]\/\/[^\s]/,
      message: 'Consider adding a space after // for comments.'
    },
    {
      pattern: /[^\s];[^\s]/,
      message: 'Consider adding a space after semicolons.'
    },
    {
      pattern: /[^\s],\s*[^\s]/,
      message: 'Consider adding a space after commas.'
    },
    {
      pattern: /[^\s]\([^\s]/,
      message: 'Consider adding a space after opening parenthesis.'
    },
    {
      pattern: /[^\s]\)/,
      message: 'Consider adding a space before closing parenthesis.'
    },
    {
      pattern: /[^\s]{\s*[^\s]/,
      message: 'Consider adding a space after opening brace.'
    },
    {
      pattern: /[^\s]}/,
      message: 'Consider adding a space before closing brace.'
    }
  ];

  // Check for code organization
  const organizationPatterns = [
    {
      pattern: /import.*from.*import/,
      message: 'Multiple imports on one line. Consider separating them.'
    },
    {
      pattern: /export.*export/,
      message: 'Multiple exports on one line. Consider separating them.'
    },
    {
      pattern: /^\s*}\s*else\s*{/,
      message: 'Consider putting else on the same line as the closing brace.'
    },
    {
      pattern: /^\s*}\s*catch\s*\(/,
      message: 'Consider putting catch on the same line as the closing brace.'
    },
    {
      pattern: /^\s*}\s*finally\s*{/,
      message: 'Consider putting finally on the same line as the closing brace.'
    }
  ];

  // Check for modern JavaScript features
  const modernJsPatterns = [
    {
      pattern: /var\s+\w+\s*=/,
      message: 'Consider using const or let instead of var.'
    },
    {
      pattern: /function\s+\w+\s*\([^)]*\)\s*{/,
      message: 'Consider using arrow functions for better readability.'
    },
    {
      pattern: /\.then\s*\(\s*function\s*\(/,
      message: 'Consider using async/await instead of .then().'
    },
    {
      pattern: /for\s*\(\s*let\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*\w+\.length\s*;\s*\w+\+\+\)/,
      message: 'Consider using for...of loop or array methods.'
    },
    {
      pattern: /Object\.keys\s*\(\s*\w+\s*\)\.forEach/,
      message: 'Consider using Object.entries() for better readability.'
    },
    {
      pattern: /\.concat\s*\(/,
      message: 'Consider using spread operator (...) for better readability.'
    },
    {
      pattern: /\.apply\s*\(/,
      message: 'Consider using spread operator (...) instead of apply().'
    }
  ];

  // Check for TypeScript specific patterns
  const typescriptPatterns = [
    {
      pattern: /: any\b/,
      message: 'Avoid using any type. Consider using a more specific type.'
    },
    {
      pattern: /: Object\b/,
      message: 'Avoid using Object type. Consider using a more specific type.'
    },
    {
      pattern: /: Function\b/,
      message: 'Avoid using Function type. Consider using a more specific function type.'
    },
    {
      pattern: /as any\b/,
      message: 'Avoid using type assertion to any. Consider using a more specific type.'
    }
  ];

  // Check for documentation
  const documentationPatterns = [
    {
      pattern: /^(?!\s*\/\*\*|\s*\/\/\s*@)/,
      message: 'Consider adding JSDoc comments for better documentation.'
    },
    {
      pattern: /export\s+(?:class|interface|type|enum)\s+\w+/,
      message: 'Consider adding JSDoc comments for exported types.'
    },
    {
      pattern: /export\s+(?:function|const|let)\s+\w+/,
      message: 'Consider adding JSDoc comments for exported functions and variables.'
    }
  ];

  lines.forEach((line, index) => {
    namingPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        suggestions.push({
          line: index + 1,
          message
        });
      }
    });

    formattingPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        suggestions.push({
          line: index + 1,
          message
        });
      }
    });

    organizationPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        suggestions.push({
          line: index + 1,
          message
        });
      }
    });

    modernJsPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        suggestions.push({
          line: index + 1,
          message
        });
      }
    });

    typescriptPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        suggestions.push({
          line: index + 1,
          message
        });
      }
    });

    documentationPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        suggestions.push({
          line: index + 1,
          message
        });
      }
    });
  });

  return {
    summary: `Code Style Analysis Results:
- Style Issues Detected: ${suggestions.length}
- Areas Checked:
  * Naming conventions
  * Code formatting
  * Code organization
  * Modern JavaScript features
  * TypeScript best practices
  * Documentation
  * Best practices`,
    suggestions
  };
} 
import { Feedback, Suggestion } from './core.js';

export async function bestPractices(code: string): Promise<Feedback> {
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

  // Check for TypeScript best practices
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
    },
    {
      pattern: /interface\s+\w+\s*{[^}]+any[^}]+}/,
      message: 'Interface contains any type. Consider using more specific types.'
    },
    {
      pattern: /type\s+\w+\s*=\s*any/,
      message: 'Type alias uses any. Consider using a more specific type.'
    }
  ];

  // Check for error handling
  const errorHandlingPatterns = [
    {
      pattern: /catch\s*\(\s*\)\s*{/,
      message: 'Empty catch block detected. Add proper error handling.'
    },
    {
      pattern: /catch\s*\(\s*error\s*\)\s*{\s*console\.log/,
      message: 'Error logged to console. Consider proper error handling and logging.'
    },
    {
      pattern: /throw\s+new\s+Error\s*\([^)]+\)/,
      message: 'Consider using custom error classes for better error handling.'
    },
    {
      pattern: /try\s*{[^}]+}\s*catch\s*\([^)]+\)\s*{[^}]+}\s*finally\s*{[^}]+}/,
      message: 'Consider using try/catch/finally for proper resource cleanup.'
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
    },
    {
      pattern: /function\s+\w+\s*\([^)]*\)(?!.*\/\*\*)/,
      message: 'Consider adding JSDoc comments for function parameters and return type.'
    }
  ];

  // Check for testing
  const testingPatterns = [
    {
      pattern: /describe\s*\(\s*['"][^'"]+['"]\s*,\s*\(\)\s*=>\s*{/,
      message: 'Consider adding test cases for this functionality.'
    },
    {
      pattern: /it\s*\(\s*['"][^'"]+['"]\s*,\s*\(\)\s*=>\s*{/,
      message: 'Consider adding more specific test cases.'
    },
    {
      pattern: /expect\s*\([^)]+\)\.toBe/,
      message: 'Consider using more specific matchers like toEqual, toContain, etc.'
    }
  ];

  // Check for accessibility
  const accessibilityPatterns = [
    {
      pattern: /<img\s+src=[^>]+(?!\s+alt=)/,
      message: 'Image missing alt attribute. Add alt text for accessibility.'
    },
    {
      pattern: /<button\s+[^>]+(?!\s+aria-label=)/,
      message: 'Button missing aria-label. Add aria-label for accessibility.'
    },
    {
      pattern: /<div\s+role=[^>]+(?!\s+aria-label=)/,
      message: 'Element with role missing aria-label. Add aria-label for accessibility.'
    }
  ];

  // Apply all checks
  const allPatterns = [
    ...namingPatterns,
    ...organizationPatterns,
    ...modernJsPatterns,
    ...typescriptPatterns,
    ...errorHandlingPatterns,
    ...documentationPatterns,
    ...testingPatterns,
    ...accessibilityPatterns
  ];

  lines.forEach((line, index) => {
    allPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        suggestions.push({
          line: index + 1,
          message
        });
      }
    });
  });

  return {
    summary: `Best Practices Analysis Results:
- Issues Detected: ${suggestions.length}
- Areas Checked:
  * Naming Conventions
  * Code Organization
  * Modern JavaScript Features
  * TypeScript Best Practices
  * Error Handling
  * Documentation
  * Testing
  * Accessibility
  * Best Practices`,
    suggestions
  };
} 
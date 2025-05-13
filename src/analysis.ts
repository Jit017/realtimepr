import { Feedback, Suggestion } from './core.js';

interface FunctionInfo {
  name: string;
  line: number;
  complexity: number;
  parameters: number;
  lines: number;
}

export async function analyzeCodeMetrics(code: string): Promise<Feedback> {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');
  const functions: FunctionInfo[] = [];
  let currentFunction: FunctionInfo | null = null;
  let bracketCount = 0;
  let functionStartLine = 0;

  // Analyze code complexity and structure
  lines.forEach((line, index) => {
    // Detect function declarations
    const functionMatch = line.match(/function\s+(\w+)\s*\(([^)]*)\)/);
    const arrowMatch = line.match(/const\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/);
    const methodMatch = line.match(/(\w+)\s*\(([^)]*)\)\s*{/);

    if (functionMatch || arrowMatch || methodMatch) {
      const match = functionMatch || arrowMatch || methodMatch;
      if (match) {
        currentFunction = {
          name: match[1],
          line: index + 1,
          complexity: 0,
          parameters: match[2].split(',').filter(p => p.trim()).length,
          lines: 0
        };
        functionStartLine = index;
        bracketCount = 0;
      }
    }

    if (currentFunction) {
      // Count brackets for function scope
      bracketCount += (line.match(/{/g) || []).length;
      bracketCount -= (line.match(/}/g) || []).length;

      // Count complexity factors
      if (line.match(/\b(if|else|for|while|do|switch|catch)\b/)) {
        currentFunction.complexity++;
      }
      if (line.match(/\b(&&|\|\|)\b/)) {
        currentFunction.complexity++;
      }
      if (line.match(/\b(try|finally)\b/)) {
        currentFunction.complexity++;
      }

      // End of function
      if (bracketCount === 0 && currentFunction) {
        currentFunction.lines = index - functionStartLine + 1;
        functions.push(currentFunction);
        currentFunction = null;
      }
    }
  });

  // Analyze functions
  functions.forEach(func => {
    // Check function length
    if (func.lines > 50) {
      suggestions.push({
        line: func.line,
        message: `Function '${func.name}' is too long (${func.lines} lines). Consider breaking it into smaller functions.`
      });
    }

    // Check cyclomatic complexity
    if (func.complexity > 10) {
      suggestions.push({
        line: func.line,
        message: `Function '${func.name}' has high cyclomatic complexity (${func.complexity}). Consider simplifying the logic.`
      });
    }

    // Check parameter count
    if (func.parameters > 5) {
      suggestions.push({
        line: func.line,
        message: `Function '${func.name}' has too many parameters (${func.parameters}). Consider using an object parameter.`
      });
    }
  });

  // Check for code smells
  const codeSmellPatterns = [
    {
      pattern: /\.then\s*\(\s*function\s*\(/,
      message: 'Promise chain detected. Consider using async/await for better readability.'
    },
    {
      pattern: /\.catch\s*\(\s*function\s*\(/,
      message: 'Promise error handling detected. Consider using try/catch with async/await.'
    },
    {
      pattern: /\.forEach\s*\(\s*function\s*\(/,
      message: 'Consider using for...of loop or array methods for better readability.'
    },
    {
      pattern: /\.map\s*\(\s*function\s*\(/,
      message: 'Consider using arrow functions for better readability.'
    },
    {
      pattern: /\.filter\s*\(\s*function\s*\(/,
      message: 'Consider using arrow functions for better readability.'
    }
  ];

  // Check for code duplication
  const codeDuplicationPatterns = [
    {
      pattern: /if\s*\([^)]+\)\s*{[^}]+}\s*else\s*if\s*\([^)]+\)\s*{[^}]+}/,
      message: 'Multiple if-else statements detected. Consider using switch or object mapping.'
    },
    {
      pattern: /switch\s*\([^)]+\)\s*{[^}]+case[^}]+case[^}]+}/,
      message: 'Large switch statement detected. Consider using object mapping or strategy pattern.'
    }
  ];

  // Check for code organization
  const organizationPatterns = [
    {
      pattern: /export\s+class\s+\w+\s*{/,
      message: 'Consider using interfaces for type definitions and classes for implementation.'
    },
    {
      pattern: /interface\s+\w+\s*{[^}]+method[^}]+}/,
      message: 'Interface contains method definitions. Consider separating interface and implementation.'
    },
    {
      pattern: /type\s+\w+\s*=\s*{[^}]+}/,
      message: 'Consider using interface instead of type for object definitions.'
    }
  ];

  // Check for code style
  const stylePatterns = [
    {
      pattern: /const\s+\w+\s*=\s*require\s*\(/,
      message: 'Consider using ES6 import syntax instead of require.'
    },
    {
      pattern: /module\.exports\s*=/,
      message: 'Consider using ES6 export syntax instead of module.exports.'
    },
    {
      pattern: /var\s+\w+\s*=/,
      message: 'Consider using const or let instead of var.'
    }
  ];

  // Check for code quality
  const qualityPatterns = [
    {
      pattern: /console\.log\s*\(/,
      message: 'Console.log detected. Consider using proper logging or removing debug statements.'
    },
    {
      pattern: /debugger;/,
      message: 'Debugger statement detected. Remove before production.'
    },
    {
      pattern: /TODO:/,
      message: 'TODO comment detected. Consider addressing or tracking in issue tracker.'
    }
  ];

  // Apply all checks
  const allPatterns = [
    ...codeSmellPatterns,
    ...codeDuplicationPatterns,
    ...organizationPatterns,
    ...stylePatterns,
    ...qualityPatterns
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

  // Calculate metrics
  const totalFunctions = functions.length;
  const avgComplexity = functions.reduce((sum, f) => sum + f.complexity, 0) / totalFunctions;
  const avgLines = functions.reduce((sum, f) => sum + f.lines, 0) / totalFunctions;
  const avgParams = functions.reduce((sum, f) => sum + f.parameters, 0) / totalFunctions;

  return {
    summary: `Code Analysis Results:
- Total Functions: ${totalFunctions}
- Average Cyclomatic Complexity: ${avgComplexity.toFixed(2)}
- Average Function Length: ${avgLines.toFixed(2)} lines
- Average Parameters per Function: ${avgParams.toFixed(2)}
- Issues Detected: ${suggestions.length}
- Areas Checked:
  * Function Complexity
  * Code Smells
  * Code Duplication
  * Code Organization
  * Code Style
  * Code Quality
  * Best Practices`,
    suggestions
  };
} 
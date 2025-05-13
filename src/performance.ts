import { Feedback, Suggestion } from './core.js';

export async function analyzePerformance(code: string): Promise<Feedback> {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');

  // Check for memory leaks
  const memoryLeakPatterns = [
    {
      pattern: /addEventListener\s*\(\s*['"][^'"]+['"]\s*,\s*[^,]+(?!\s*,\s*{.*once:\s*true)/,
      message: 'Event listener without cleanup. Consider using removeEventListener or { once: true } option.'
    },
    {
      pattern: /setInterval\s*\([^,]+(?!\s*,\s*0\s*\))/,
      message: 'setInterval without clearInterval. Consider using setTimeout or ensuring cleanup.'
    },
    {
      pattern: /new\s+Worker\s*\([^)]+\)(?!.*\.terminate)/,
      message: 'Web Worker created without termination. Consider calling terminate() when done.'
    }
  ];

  // Check for inefficient loops
  const loopPatterns = [
    {
      pattern: /for\s*\(\s*let\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*\w+\.length\s*;\s*\w+\+\+\)/,
      message: 'Inefficient array iteration. Consider using for...of or array methods.'
    },
    {
      pattern: /\.forEach\s*\(\s*function\s*\(/,
      message: 'Consider using arrow functions for better performance in forEach.'
    },
    {
      pattern: /for\s*\(\s*const\s+\w+\s+in\s+\w+\)/,
      message: 'for...in loop detected. Consider using for...of or Object.keys() for better performance.'
    }
  ];

  // Check for DOM performance
  const domPatterns = [
    {
      pattern: /\.innerHTML\s*=\s*[^;]+\$/,
      message: 'innerHTML assignment can be slow. Consider using textContent or DOM methods.'
    },
    {
      pattern: /\.style\.[a-zA-Z]+\s*=\s*[^;]+/,
      message: 'Direct style manipulation can cause reflows. Consider using CSS classes.'
    },
    {
      pattern: /\.getElementById\s*\([^)]+\)(?!.*\.style)/,
      message: 'Consider caching DOM queries to avoid repeated lookups.'
    }
  ];

  // Check for async operations
  const asyncPatterns = [
    {
      pattern: /await\s+Promise\.all\s*\([^)]+\)/,
      message: 'Consider using Promise.allSettled() for better error handling in parallel operations.'
    },
    {
      pattern: /\.then\s*\(\s*function\s*\(/,
      message: 'Consider using async/await for better readability and error handling.'
    },
    {
      pattern: /new\s+Promise\s*\(\s*function\s*\(/,
      message: 'Consider using async/await instead of raw Promise constructor.'
    }
  ];

  // Check for database operations
  const databasePatterns = [
    {
      pattern: /\.findOne\s*\(\s*{[^}]+}\s*\)(?!.*\.lean)/,
      message: 'Consider using .lean() for read-only operations to improve performance.'
    },
    {
      pattern: /\.find\s*\(\s*{[^}]+}\s*\)(?!.*\.limit)/,
      message: 'Consider adding .limit() to prevent large result sets.'
    },
    {
      pattern: /\.aggregate\s*\(\s*\[[^\]]+\]\s*\)(?!.*\.allowDiskUse)/,
      message: 'Consider using .allowDiskUse() for large aggregations.'
    }
  ];

  // Check for caching
  const cachingPatterns = [
    {
      pattern: /fetch\s*\(\s*[^,]+(?!.*cache)/,
      message: 'Consider adding cache options to fetch requests.'
    },
    {
      pattern: /axios\.get\s*\(\s*[^,]+(?!.*headers)/,
      message: 'Consider adding cache headers to axios requests.'
    }
  ];

  // Check for resource loading
  const resourcePatterns = [
    {
      pattern: /<script\s+src=[^>]+(?!\s+async|\s+defer)/,
      message: 'Consider adding async or defer to script tags.'
    },
    {
      pattern: /<img\s+src=[^>]+(?!\s+loading)/,
      message: 'Consider adding loading="lazy" to images below the fold.'
    }
  ];

  // Check for algorithm complexity
  const complexityPatterns = [
    {
      pattern: /\.filter\s*\([^)]+\)\.map\s*\(/,
      message: 'Consider combining filter and map operations for better performance.'
    },
    {
      pattern: /\.forEach\s*\([^)]+\)\.forEach\s*\(/,
      message: 'Nested forEach loops detected. Consider using a more efficient algorithm.'
    },
    {
      pattern: /\.indexOf\s*\([^)]+\)\s*!==\s*-1/,
      message: 'Consider using .includes() for better readability and performance.'
    }
  ];

  // Check for memory usage
  const memoryPatterns = [
    {
      pattern: /new\s+Array\s*\(\s*\d+\s*\)/,
      message: 'Consider using Array.from() or Array(n).fill() for better memory usage.'
    },
    {
      pattern: /\.push\s*\(\s*[^)]+\s*\)(?!.*\.length)/,
      message: 'Consider pre-allocating array size for better performance.'
    }
  ];

  // Check for network optimization
  const networkPatterns = [
    {
      pattern: /fetch\s*\(\s*[^,]+(?!.*compress)/,
      message: 'Consider enabling compression for network requests.'
    },
    {
      pattern: /axios\.get\s*\(\s*[^,]+(?!.*gzip)/,
      message: 'Consider enabling gzip compression for axios requests.'
    }
  ];

  // Apply all performance checks
  const allPatterns = [
    ...memoryLeakPatterns,
    ...loopPatterns,
    ...domPatterns,
    ...asyncPatterns,
    ...databasePatterns,
    ...cachingPatterns,
    ...resourcePatterns,
    ...complexityPatterns,
    ...memoryPatterns,
    ...networkPatterns
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
    summary: `Performance Analysis Results:
- Performance Issues Detected: ${suggestions.length}
- Areas Checked:
  * Memory Leaks
  * Loop Efficiency
  * DOM Performance
  * Async Operations
  * Database Operations
  * Caching
  * Resource Loading
  * Algorithm Complexity
  * Memory Usage
  * Network Optimization`,
    suggestions
  };
} 
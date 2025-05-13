import { Feedback, Suggestion } from './core.js';

export async function analyzeSecurity(code: string): Promise<Feedback> {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');

  // Check for SQL injection vulnerabilities
  const sqlInjectionPatterns = [
    {
      pattern: /\.query\s*\(\s*['"`]\s*SELECT.*\$\{/,
      message: 'Potential SQL injection vulnerability. Use parameterized queries instead of string interpolation.'
    },
    {
      pattern: /\.query\s*\(\s*['"`]\s*INSERT.*\$\{/,
      message: 'Potential SQL injection vulnerability. Use parameterized queries instead of string interpolation.'
    },
    {
      pattern: /\.query\s*\(\s*['"`]\s*UPDATE.*\$\{/,
      message: 'Potential SQL injection vulnerability. Use parameterized queries instead of string interpolation.'
    },
    {
      pattern: /\.query\s*\(\s*['"`]\s*DELETE.*\$\{/,
      message: 'Potential SQL injection vulnerability. Use parameterized queries instead of string interpolation.'
    }
  ];

  // Check for XSS vulnerabilities
  const xssPatterns = [
    {
      pattern: /\.innerHTML\s*=\s*[^;]+\$/,
      message: 'Potential XSS vulnerability. Avoid using innerHTML with user input.'
    },
    {
      pattern: /\.outerHTML\s*=\s*[^;]+\$/,
      message: 'Potential XSS vulnerability. Avoid using outerHTML with user input.'
    },
    {
      pattern: /document\.write\s*\(\s*[^;]+\$/,
      message: 'Potential XSS vulnerability. Avoid using document.write with user input.'
    },
    {
      pattern: /eval\s*\(\s*[^;]+\$/,
      message: 'Potential XSS vulnerability. Avoid using eval with user input.'
    }
  ];

  // Check for command injection vulnerabilities
  const commandInjectionPatterns = [
    {
      pattern: /child_process\.exec\s*\(\s*[^;]+\$/,
      message: 'Potential command injection vulnerability. Use child_process.execFile with proper argument arrays.'
    },
    {
      pattern: /child_process\.spawn\s*\(\s*[^;]+\$/,
      message: 'Potential command injection vulnerability. Use proper argument arrays with spawn.'
    }
  ];

  // Check for file path traversal vulnerabilities
  const pathTraversalPatterns = [
    {
      pattern: /fs\.readFile\s*\(\s*[^;]+\$/,
      message: 'Potential path traversal vulnerability. Validate and sanitize file paths.'
    },
    {
      pattern: /fs\.writeFile\s*\(\s*[^;]+\$/,
      message: 'Potential path traversal vulnerability. Validate and sanitize file paths.'
    }
  ];

  // Check for insecure cryptographic practices
  const cryptoPatterns = [
    {
      pattern: /crypto\.createHash\s*\(\s*['"]md5['"]/,
      message: 'MD5 is cryptographically broken. Use SHA-256 or better.'
    },
    {
      pattern: /crypto\.createHash\s*\(\s*['"]sha1['"]/,
      message: 'SHA-1 is cryptographically weak. Use SHA-256 or better.'
    },
    {
      pattern: /\.sign\s*\(\s*[^,]+,\s*['"]sha1['"]/,
      message: 'SHA-1 is cryptographically weak. Use SHA-256 or better.'
    }
  ];

  // Check for hardcoded secrets
  const secretPatterns = [
    {
      pattern: /(?:password|secret|key|token)\s*=\s*['"][^'"]{8,}['"]/,
      message: 'Potential hardcoded secret detected. Use environment variables or secure secret management.'
    },
    {
      pattern: /(?:api[_-]?key|access[_-]?token)\s*=\s*['"][^'"]{8,}['"]/,
      message: 'Potential hardcoded API key or token detected. Use environment variables or secure secret management.'
    }
  ];

  // Check for insecure HTTP usage
  const httpPatterns = [
    {
      pattern: /http:\/\//,
      message: 'Insecure HTTP protocol detected. Use HTTPS instead.'
    },
    {
      pattern: /new\s+WebSocket\s*\(\s*['"]ws:\/\//,
      message: 'Insecure WebSocket protocol detected. Use WSS instead.'
    }
  ];

  // Check for insecure cookie settings
  const cookiePatterns = [
    {
      pattern: /\.cookie\s*=\s*[^;]+(?!;\s*secure)/,
      message: 'Cookie set without secure flag. Add secure flag for HTTPS-only cookies.'
    },
    {
      pattern: /\.cookie\s*=\s*[^;]+(?!;\s*httpOnly)/,
      message: 'Cookie set without httpOnly flag. Add httpOnly flag to prevent XSS access.'
    }
  ];

  // Check for CORS misconfigurations
  const corsPatterns = [
    {
      pattern: /Access-Control-Allow-Origin:\s*\*/,
      message: 'Overly permissive CORS policy. Specify exact origins instead of wildcard.'
    },
    {
      pattern: /Access-Control-Allow-Methods:\s*\*/,
      message: 'Overly permissive CORS methods. Specify exact methods needed.'
    }
  ];

  // Check for rate limiting
  const rateLimitPatterns = [
    {
      pattern: /express\.Router\s*\(\s*\)(?!.*rateLimit)/,
      message: 'No rate limiting detected. Consider adding rate limiting middleware.'
    }
  ];

  // Check for input validation
  const inputValidationPatterns = [
    {
      pattern: /req\.body(?!.*validate)/,
      message: 'No input validation detected. Consider adding validation middleware.'
    },
    {
      pattern: /req\.query(?!.*validate)/,
      message: 'No query parameter validation detected. Consider adding validation middleware.'
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
    }
  ];

  // Apply all security checks
  const allPatterns = [
    ...sqlInjectionPatterns,
    ...xssPatterns,
    ...commandInjectionPatterns,
    ...pathTraversalPatterns,
    ...cryptoPatterns,
    ...secretPatterns,
    ...httpPatterns,
    ...cookiePatterns,
    ...corsPatterns,
    ...rateLimitPatterns,
    ...inputValidationPatterns,
    ...errorHandlingPatterns
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
    summary: `Security Analysis Results:
- Security Issues Detected: ${suggestions.length}
- Areas Checked:
  * SQL Injection
  * Cross-Site Scripting (XSS)
  * Command Injection
  * Path Traversal
  * Cryptographic Practices
  * Secret Management
  * HTTP Security
  * Cookie Security
  * CORS Configuration
  * Rate Limiting
  * Input Validation
  * Error Handling`,
    suggestions
  };
} 
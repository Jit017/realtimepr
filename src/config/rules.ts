export interface CustomRule {
  id: string;
  description: string;
  pattern: RegExp;
  message: string;
  severity: 'error' | 'warning' | 'info';
  fix?: (match: RegExpMatchArray) => string;
}

export interface RuleSet {
  name: string;
  rules: CustomRule[];
}

export const defaultRules: RuleSet[] = [
  {
    name: 'Code Style',
    rules: [
      {
        id: 'no-console',
        description: 'Disallow console statements',
        pattern: /console\.(log|error|warn|info|debug)/,
        message: 'Avoid using console statements in production code',
        severity: 'warning',
        fix: (match) => `// ${match[0]}`
      },
      {
        id: 'no-debugger',
        description: 'Disallow debugger statements',
        pattern: /debugger/,
        message: 'Remove debugger statements',
        severity: 'error',
        fix: () => '// debugger'
      }
    ]
  },
  {
    name: 'Security',
    rules: [
      {
        id: 'no-eval',
        description: 'Disallow eval()',
        pattern: /eval\s*\(/,
        message: 'Avoid using eval() as it can lead to security vulnerabilities',
        severity: 'error'
      },
      {
        id: 'no-inner-html',
        description: 'Disallow innerHTML',
        pattern: /\.innerHTML\s*=/,
        message: 'Avoid using innerHTML as it can lead to XSS attacks',
        severity: 'error',
        fix: (match) => match[0].replace('innerHTML', 'textContent')
      }
    ]
  },
  {
    name: 'Performance',
    rules: [
      {
        id: 'no-for-in',
        description: 'Prefer for...of over for...in',
        pattern: /for\s*\(\s*[^)]+\s+in\s+/,
        message: 'Consider using for...of instead of for...in for better performance',
        severity: 'warning'
      },
      {
        id: 'no-nested-loops',
        description: 'Avoid deeply nested loops',
        pattern: /for\s*\([^)]+\)\s*{[^}]*for\s*\([^)]+\)/,
        message: 'Deeply nested loops can impact performance',
        severity: 'warning'
      }
    ]
  }
];

export function createCustomRule(
  id: string,
  description: string,
  pattern: string | RegExp,
  message: string,
  severity: 'error' | 'warning' | 'info' = 'warning',
  fix?: (match: RegExpMatchArray) => string
): CustomRule {
  return {
    id,
    description,
    pattern: typeof pattern === 'string' ? new RegExp(pattern) : pattern,
    message,
    severity,
    fix
  };
}

export function createRuleSet(name: string, rules: CustomRule[]): RuleSet {
  return {
    name,
    rules
  };
}

export function validateRule(rule: CustomRule): boolean {
  return (
    typeof rule.id === 'string' &&
    typeof rule.description === 'string' &&
    rule.pattern instanceof RegExp &&
    typeof rule.message === 'string' &&
    ['error', 'warning', 'info'].includes(rule.severity) &&
    (!rule.fix || typeof rule.fix === 'function')
  );
} 
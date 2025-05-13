export interface LanguageConfig {
  name: string;
  extensions: string[];
  parser: string;
  rules: Record<string, any>;
}

export const supportedLanguages: Record<string, LanguageConfig> = {
  typescript: {
    name: 'TypeScript',
    extensions: ['.ts', '.tsx'],
    parser: '@typescript-eslint/parser',
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  },
  javascript: {
    name: 'JavaScript',
    extensions: ['.js', '.jsx'],
    parser: '@babel/eslint-parser',
    rules: {
      'no-var': 'warn',
      'prefer-const': 'warn',
    }
  },
  python: {
    name: 'Python',
    extensions: ['.py'],
    parser: 'python-parser',
    rules: {
      'pep8': 'warn',
      'pylint': 'warn',
    }
  },
  java: {
    name: 'Java',
    extensions: ['.java'],
    parser: 'java-parser',
    rules: {
      'checkstyle': 'warn',
      'pmd': 'warn',
    }
  },
  go: {
    name: 'Go',
    extensions: ['.go'],
    parser: 'go-parser',
    rules: {
      'gofmt': 'warn',
      'golint': 'warn',
    }
  }
}; 
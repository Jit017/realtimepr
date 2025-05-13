import { Feedback, Suggestion } from './core';

interface ComplexityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maintainabilityIndex: number;
}

function calculateCyclomaticComplexity(code: string): number {
  const complexityFactors = [
    /if\s*\(/g,
    /else\s*{/g,
    /for\s*\(/g,
    /while\s*\(/g,
    /do\s*{/g,
    /switch\s*\(/g,
    /case\s+/g,
    /catch\s*\(/g,
    /&&/g,
    /\|\|/g,
    /\?/g,
    /:/g
  ];
  
  return complexityFactors.reduce((total, pattern) => {
    const matches = code.match(pattern);
    return total + (matches ? matches.length : 0);
  }, 1);
}

function calculateCognitiveComplexity(code: string): number {
  const lines = code.split('\n');
  let complexity = 0;
  let nestingLevel = 0;

  for (const line of lines) {
    if (line.match(/if\s*\(|for\s*\(|while\s*\(|switch\s*\(/)) {
      complexity += (1 + nestingLevel);
      nestingLevel++;
    } else if (line.match(/else\s*{|catch\s*\(/)) {
      complexity += (1 + nestingLevel);
    } else if (line.match(/}/)) {
      nestingLevel = Math.max(0, nestingLevel - 1);
    }
  }

  return complexity;
}

function calculateMaintainabilityIndex(complexity: number, loc: number): number {
  const volume = loc * Math.log2(complexity || 1);
  return Math.max(0, (171 - 5.2 * Math.log(volume) - 0.23 * complexity - 16.2 * Math.log(loc)) * 100 / 171);
}

export async function analyzeCodeMetrics(code: string): Promise<Feedback> {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');
  const metrics: ComplexityMetrics = {
    cyclomaticComplexity: calculateCyclomaticComplexity(code),
    cognitiveComplexity: calculateCognitiveComplexity(code),
    maintainabilityIndex: calculateMaintainabilityIndex(
      calculateCyclomaticComplexity(code),
      lines.length
    )
  };

  // Check for high complexity
  if (metrics.cyclomaticComplexity > 10) {
    suggestions.push({
      line: 1,
      message: `High cyclomatic complexity (${metrics.cyclomaticComplexity}). Consider breaking down the code into smaller functions.`
    });
  }

  if (metrics.cognitiveComplexity > 15) {
    suggestions.push({
      line: 1,
      message: `High cognitive complexity (${metrics.cognitiveComplexity}). The code might be hard to understand and maintain.`
    });
  }

  if (metrics.maintainabilityIndex < 65) {
    suggestions.push({
      line: 1,
      message: `Low maintainability index (${metrics.maintainabilityIndex.toFixed(2)}). Consider refactoring to improve code maintainability.`
    });
  }

  // Check for code smells
  const codeSmells = detectCodeSmells(code);
  suggestions.push(...codeSmells);

  return {
    summary: `Code Analysis Results:
- Cyclomatic Complexity: ${metrics.cyclomaticComplexity}
- Cognitive Complexity: ${metrics.cognitiveComplexity}
- Maintainability Index: ${metrics.maintainabilityIndex.toFixed(2)}
- Code Smells Detected: ${codeSmells.length}`,
    suggestions
  };
}

function detectCodeSmells(code: string): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');

  // Check for long functions
  let currentFunctionLines = 0;
  let currentFunctionStart = 0;
  let inFunction = false;

  lines.forEach((line, index) => {
    if (line.match(/function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|let\s+\w+\s*=\s*\(/)) {
      inFunction = true;
      currentFunctionStart = index + 1;
      currentFunctionLines = 0;
    } else if (inFunction && line.match(/}/)) {
      inFunction = false;
      if (currentFunctionLines > 20) {
        suggestions.push({
          line: currentFunctionStart,
          message: `Function is too long (${currentFunctionLines} lines). Consider breaking it into smaller functions.`
        });
      }
    } else if (inFunction) {
      currentFunctionLines++;
    }
  });

  // Check for magic numbers
  lines.forEach((line, index) => {
    if (line.match(/[^a-zA-Z](\d{2,})[^a-zA-Z]/)) {
      suggestions.push({
        line: index + 1,
        message: 'Magic number detected. Consider using named constants.'
      });
    }
  });

  // Check for commented out code
  lines.forEach((line, index) => {
    if (line.match(/^\s*\/\/\s*[a-zA-Z]/)) {
      suggestions.push({
        line: index + 1,
        message: 'Commented out code detected. Consider removing if no longer needed.'
      });
    }
  });

  return suggestions;
} 
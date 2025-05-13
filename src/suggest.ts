import { Feedback } from './core.js';

export async function suggestImprovements(code: string, filePath: string): Promise<Feedback> {
  const suggestions = [];
  const lines = code.split('\n');
  // Example: Suggest adding comments if none found
  if (!code.match(/\/\/|#/)) {
    suggestions.push({
      line: 1,
      message: 'Consider adding comments to improve code readability.'
    });
  }
  // Example: Warn about long lines
  lines.forEach((line, idx) => {
    if (line.length > 100) {
      suggestions.push({
        line: idx + 1,
        message: 'Line exceeds 100 characters. Consider breaking it up.'
      });
    }
  });
  // Example: Suggest better variable naming (very basic)
  if (code.match(/var |let |const /) && code.match(/(foo|bar|baz)/)) {
    suggestions.push({
      line: 1,
      message: 'Avoid generic variable names like foo, bar, baz.'
    });
  }
  return {
    summary: suggestions.length ? `${suggestions.length} suggestion(s) for improvement.` : 'No suggestions found.',
    suggestions,
  };
} 
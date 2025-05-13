import { Feedback, Suggestion } from './core';

export async function bestPractices(code: string, filePath: string): Promise<Feedback> {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');
  // Check for magic numbers
  lines.forEach((line, idx) => {
    if (line.match(/[^a-zA-Z](\d{2,})[^a-zA-Z]/)) {
      suggestions.push({
        line: idx + 1,
        message: 'Possible magic number detected. Consider using named constants.'
      });
    }
    // Check for missing semicolons in JS/TS
    if ((filePath.endsWith('.js') || filePath.endsWith('.ts')) &&
        line.trim() &&
        !line.trim().endsWith(';') &&
        !line.trim().endsWith('{') &&
        !line.trim().endsWith('}') &&
        !line.trim().startsWith('//') &&
        !line.trim().startsWith('*') &&
        !line.trim().startsWith('import') &&
        !line.trim().startsWith('export') &&
        !line.trim().endsWith(',')) {
      suggestions.push({
        line: idx + 1,
        message: 'Possible missing semicolon.'
      });
    }
    // Check for lack of error handling in try/catch
    if (line.match(/try ?{/) && !lines[idx + 1]?.match(/catch ?\(/)) {
      suggestions.push({
        line: idx + 1,
        message: 'try block without catch detected.'
      });
    }
  });
  return {
    summary: suggestions.length ? `${suggestions.length} best practice issue(s) found.` : 'No best practice issues found.',
    suggestions,
  };
} 
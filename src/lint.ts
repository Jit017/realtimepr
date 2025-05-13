import { ESLint } from 'eslint';
import { Feedback } from './core.js';
import tmp from 'tmp';
import fs from 'fs';

export async function lintFile(code: string, filePath: string): Promise<Feedback> {
  const eslint = new ESLint();
  
  // Write code to a temp file for ESLint to process
  const tmpFile = tmp.fileSync({ postfix: filePath.endsWith('.ts') ? '.ts' : '.js' });
  fs.writeFileSync(tmpFile.name, code);
  const results = await eslint.lintFiles([tmpFile.name]);
  tmpFile.removeCallback();

  const suggestions = [];
  let errorCount = 0;
  for (const result of results) {
    errorCount += result.errorCount;
    for (const msg of result.messages) {
      suggestions.push({
        line: msg.line,
        message: msg.message + (msg.ruleId ? ` [${msg.ruleId}]` : ''),
      });
    }
  }
  return {
    summary: `${errorCount} issue(s) found by ESLint.`,
    suggestions,
  };
} 
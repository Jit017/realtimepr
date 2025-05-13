import { lintFile } from './lint';
import { suggestImprovements } from './suggest';
import { bestPractices } from './bestpractices';
import { openAIFeedback } from './openai';
import fs from 'fs/promises';
import path from 'path';

export interface Suggestion {
  line: number;
  message: string;
}

export interface Feedback {
  summary: string;
  suggestions: Suggestion[];
}

export async function analyzeFile(
  filePath: string,
  type: string,
  useOpenAI: boolean
): Promise<Feedback> {
  const absPath = path.resolve(filePath);
  const code = await fs.readFile(absPath, 'utf8');
  let feedback: Feedback = { summary: '', suggestions: [] };

  if (useOpenAI) {
    feedback = await openAIFeedback(code, type);
  } else {
    switch (type) {
      case 'linting':
        feedback = await lintFile(code, absPath);
        break;
      case 'suggestions':
        feedback = await suggestImprovements(code, absPath);
        break;
      case 'best-practices':
        feedback = await bestPractices(code, absPath);
        break;
      default:
        throw new Error('Unknown feedback type: ' + type);
    }
  }
  return feedback;
} 
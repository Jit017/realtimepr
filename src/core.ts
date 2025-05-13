import { lintFile } from './lint.js';
import { suggestImprovements } from './suggest.js';
import { bestPractices } from './bestpractices.js';
import { openAIFeedback } from './openai.js';
import { analyzeCodeMetrics } from './analysis.js';
import { analyzeSecurity } from './security.js';
import { analyzePerformance } from './performance.js';
import { analyzeStyle } from './style.js';
import { analyzeDependencies } from './dependencies.js';
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
        feedback = await bestPractices(code);
        break;
      case 'analysis':
        feedback = await analyzeCodeMetrics(code);
        break;
      case 'security':
        feedback = await analyzeSecurity(code);
        break;
      case 'performance':
        feedback = await analyzePerformance(code);
        break;
      case 'style':
        feedback = await analyzeStyle(code);
        break;
      case 'dependencies':
        feedback = await analyzeDependencies(code, absPath);
        break;
      default:
        throw new Error('Unknown feedback type: ' + type);
    }
  }
  return feedback;
} 
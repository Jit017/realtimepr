import fs from 'fs';
import path from 'path';
import { supportedLanguages } from './config/languages.js';
import { Feedback } from './core.js';
import { analyzeCodeMetrics } from './analysis.js';
import { bestPractices } from './bestpractices.js';
import { analyzeSecurity } from './security.js';
import { analyzePerformance } from './performance.js';
import { analyzeStyle } from './style.js';
import { analyzeDependencies } from './dependencies.js';

export interface ProjectAnalysisResult {
  files: Array<{
    path: string;
    language: string;
    analysis: Feedback;
  }>;
  summary: {
    totalFiles: number;
    totalIssues: number;
    byLanguage: Record<string, number>;
    bySeverity: Record<string, number>;
  };
}

export async function analyzeProject(
  projectPath: string,
  options: {
    include?: string[];
    exclude?: string[];
    analysisTypes?: string[];
  } = {}
): Promise<ProjectAnalysisResult> {
  const {
    include = ['**/*'],
    exclude = ['node_modules/**', 'dist/**', 'build/**'],
    analysisTypes = ['analysis', 'bestpractices', 'security', 'performance', 'style', 'dependencies']
  } = options;

  const files = await findFiles(projectPath, include, exclude);
  const results: ProjectAnalysisResult['files'] = [];
  let totalIssues = 0;
  const byLanguage: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const language = detectLanguage(file);
    const analysis = await analyzeFile(content, file, analysisTypes);

    results.push({
      path: file,
      language,
      analysis
    });

    totalIssues += analysis.suggestions.length;
    byLanguage[language] = (byLanguage[language] || 0) + analysis.suggestions.length;
    
    // Count by severity (assuming severity is part of the message)
    analysis.suggestions.forEach(suggestion => {
      const severity = suggestion.message.includes('error') ? 'error' :
                      suggestion.message.includes('warning') ? 'warning' : 'info';
      bySeverity[severity] = (bySeverity[severity] || 0) + 1;
    });
  }

  return {
    files: results,
    summary: {
      totalFiles: files.length,
      totalIssues,
      byLanguage,
      bySeverity
    }
  };
}

async function findFiles(
  dir: string,
  include: string[],
  exclude: string[]
): Promise<string[]> {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!exclude.some(pattern => new RegExp(pattern).test(fullPath))) {
        files.push(...await findFiles(fullPath, include, exclude));
      }
    } else if (entry.isFile()) {
      if (include.some(pattern => new RegExp(pattern).test(fullPath)) &&
          !exclude.some(pattern => new RegExp(pattern).test(fullPath))) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function detectLanguage(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  const language = Object.entries(supportedLanguages).find(([_, config]) =>
    config.extensions.includes(extension)
  )?.[0];
  
  return language || 'unknown';
}

async function analyzeFile(
  content: string,
  filePath: string,
  analysisTypes: string[]
): Promise<Feedback> {
  const results: Feedback[] = [];

  for (const type of analysisTypes) {
    switch (type) {
      case 'analysis':
        results.push(await analyzeCodeMetrics(content));
        break;
      case 'bestpractices':
        results.push(await bestPractices(content));
        break;
      case 'security':
        results.push(await analyzeSecurity(content));
        break;
      case 'performance':
        results.push(await analyzePerformance(content));
        break;
      case 'style':
        results.push(await analyzeStyle(content));
        break;
      case 'dependencies':
        results.push(await analyzeDependencies(content, filePath));
        break;
    }
  }

  return {
    summary: `Analysis complete for ${filePath}`,
    suggestions: results.flatMap(r => r.suggestions)
  };
} 
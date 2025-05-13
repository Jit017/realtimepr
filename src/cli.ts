import { Command } from 'commander';
import chalk from 'chalk';
import { analyzeFile } from './core.js';

const program = new Command();

program
  .name('realtimepr')
  .description('Real-time code review and feedback CLI tool')
  .argument('<file>', 'Source code file to analyze')
  .option('-t, --type <type>', 'Feedback type: linting | suggestions | best-practices | analysis | security | performance | style | dependencies', 'linting')
  .option('--openai', 'Use OpenAI for deeper feedback (requires API key)')
  .action(async (file, options) => {
    try {
      const feedback = await analyzeFile(file, options.type, options.openai);
      if (feedback.summary) {
        console.log(chalk.bold.cyan('\nSummary:'));
        console.log(feedback.summary);
      }
      if (feedback.suggestions && feedback.suggestions.length > 0) {
        console.log(chalk.bold.green('\nSuggestions:'));
        for (const s of feedback.suggestions) {
          console.log(
            chalk.yellow(`Line ${s.line}:`) + ' ' + chalk.white(s.message)
          );
        }
      } else {
        console.log(chalk.green('No issues found!'));
      }
    } catch (err: unknown) {
      console.error(chalk.red('Error:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program.parse(process.argv); 
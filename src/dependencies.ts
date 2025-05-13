import { Feedback, Suggestion } from './core.js';
import fs from 'fs/promises';
import path from 'path';

interface Dependency {
  name: string;
  version: string;
  type: 'dependencies' | 'devDependencies';
}

interface ImportInfo {
  line: number;
  module: string;
  isDefault: boolean;
  isNamespace: boolean;
  importedItems: string[];
}

export async function analyzeDependencies(code: string, filePath: string): Promise<Feedback> {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');

  // Find all import statements with detailed information
  const imports = lines
    .map((line, index) => {
      // Match default imports
      const defaultMatch = line.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
      if (defaultMatch) {
        return {
          line: index + 1,
          module: defaultMatch[2],
          isDefault: true,
          isNamespace: false,
          importedItems: [defaultMatch[1]]
        };
      }

      // Match namespace imports
      const namespaceMatch = line.match(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
      if (namespaceMatch) {
        return {
          line: index + 1,
          module: namespaceMatch[2],
          isDefault: false,
          isNamespace: true,
          importedItems: [namespaceMatch[1]]
        };
      }

      // Match named imports
      const namedMatch = line.match(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/);
      if (namedMatch) {
        return {
          line: index + 1,
          module: namedMatch[2],
          isDefault: false,
          isNamespace: false,
          importedItems: namedMatch[1].split(',').map(item => item.trim())
        };
      }

      return null;
    })
    .filter((imp): imp is ImportInfo => imp !== null);

  // Check for unused imports
  const usedModules = new Set<string>();
  const usedItems = new Set<string>();
  
  // Track usage of imported items
  lines.forEach((line, index) => {
    imports.forEach(imp => {
      if (line.includes(imp.module)) {
        usedModules.add(imp.module);
      }
      imp.importedItems.forEach(item => {
        if (line.includes(item)) {
          usedItems.add(item);
        }
      });
    });
  });

  // Report unused imports
  imports.forEach(imp => {
    if (!usedModules.has(imp.module)) {
      suggestions.push({
        line: imp.line,
        message: `Unused import: ${imp.module}`
      });
    }
    imp.importedItems.forEach(item => {
      if (!usedItems.has(item)) {
        suggestions.push({
          line: imp.line,
          message: `Unused import: ${item} from ${imp.module}`
        });
      }
    });
  });

  // Check for potential missing dependencies
  const potentialDependencies = new Set<string>();
  lines.forEach((line, index) => {
    const requireMatch = line.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
    if (requireMatch && !usedModules.has(requireMatch[1])) {
      potentialDependencies.add(requireMatch[1]);
      suggestions.push({
        line: index + 1,
        message: `Potential missing dependency: ${requireMatch[1]}`
      });
    }
  });

  // Check for circular dependencies
  const circularDeps = detectCircularDependencies(imports);
  circularDeps.forEach(({ line, module }) => {
    suggestions.push({
      line,
      message: `Potential circular dependency detected with module: ${module}`
    });
  });

  // Check for deprecated dependencies
  const deprecatedDeps = await checkDeprecatedDependencies(imports);
  deprecatedDeps.forEach(({ line, module, version }) => {
    suggestions.push({
      line,
      message: `Module ${module} (${version}) might be deprecated. Consider updating or replacing it.`
    });
  });

  // Check for duplicate imports
  const duplicateImports = findDuplicateImports(imports);
  duplicateImports.forEach(({ line, module }) => {
    suggestions.push({
      line,
      message: `Duplicate import of module: ${module}`
    });
  });

  // Check for mixed import styles
  const mixedImports = findMixedImportStyles(imports);
  mixedImports.forEach(({ line, module }) => {
    suggestions.push({
      line,
      message: `Mixed import styles detected for module: ${module}. Consider using consistent import style.`
    });
  });

  // Check for relative vs absolute imports
  const relativeImports = findRelativeImports(imports);
  relativeImports.forEach(({ line, module }) => {
    suggestions.push({
      line,
      message: `Consider using absolute imports instead of relative imports for: ${module}`
    });
  });

  return {
    summary: `Dependency Analysis Results:
- Total Imports: ${imports.length}
- Unused Imports: ${imports.length - usedModules.size}
- Potential Missing Dependencies: ${potentialDependencies.size}
- Circular Dependencies: ${circularDeps.length}
- Deprecated Dependencies: ${deprecatedDeps.length}
- Duplicate Imports: ${duplicateImports.length}
- Mixed Import Styles: ${mixedImports.length}
- Relative Imports: ${relativeImports.length}`,
    suggestions
  };
}

function detectCircularDependencies(imports: ImportInfo[]): { line: number; module: string }[] {
  const circular: { line: number; module: string }[] = [];
  const visited = new Set<string>();
  const stack = new Set<string>();

  function visit(module: string, line: number) {
    if (stack.has(module)) {
      circular.push({ line, module });
      return;
    }
    if (visited.has(module)) return;

    visited.add(module);
    stack.add(module);

    // Find all imports of this module
    imports
      .filter(imp => imp.module === module)
      .forEach(imp => visit(imp.module, imp.line));

    stack.delete(module);
  }

  imports.forEach(imp => visit(imp.module, imp.line));
  return circular;
}

async function checkDeprecatedDependencies(imports: ImportInfo[]): Promise<{ line: number; module: string; version: string }[]> {
  const deprecated: { line: number; module: string; version: string }[] = [];
  
  try {
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    imports.forEach(({ line, module }) => {
      const depName = module.split('/')[0];
      if (allDeps[depName]) {
        // This is a very basic check. In a real implementation, you'd want to:
        // 1. Check npm registry for deprecation status
        // 2. Check for outdated versions
        // 3. Check for security vulnerabilities
        if (allDeps[depName].startsWith('^0.') || allDeps[depName].startsWith('~0.')) {
          deprecated.push({
            line,
            module: depName,
            version: allDeps[depName]
          });
        }
      }
    });
  } catch (error) {
    console.error('Error reading package.json:', error);
  }

  return deprecated;
}

function findDuplicateImports(imports: ImportInfo[]): { line: number; module: string }[] {
  const duplicates: { line: number; module: string }[] = [];
  const seen = new Set<string>();

  imports.forEach(imp => {
    if (seen.has(imp.module)) {
      duplicates.push({ line: imp.line, module: imp.module });
    }
    seen.add(imp.module);
  });

  return duplicates;
}

function findMixedImportStyles(imports: ImportInfo[]): { line: number; module: string }[] {
  const mixed: { line: number; module: string }[] = [];
  const importStyles = new Map<string, Set<'default' | 'namespace' | 'named'>>();

  imports.forEach(imp => {
    if (!importStyles.has(imp.module)) {
      importStyles.set(imp.module, new Set());
    }
    const styles = importStyles.get(imp.module)!;
    
    if (imp.isDefault) styles.add('default');
    if (imp.isNamespace) styles.add('namespace');
    if (!imp.isDefault && !imp.isNamespace) styles.add('named');

    if (styles.size > 1) {
      mixed.push({ line: imp.line, module: imp.module });
    }
  });

  return mixed;
}

function findRelativeImports(imports: ImportInfo[]): { line: number; module: string }[] {
  return imports
    .filter(imp => imp.module.startsWith('.'))
    .map(imp => ({ line: imp.line, module: imp.module }));
} 
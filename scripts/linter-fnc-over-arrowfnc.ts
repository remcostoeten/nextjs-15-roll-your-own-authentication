#!/usr/bin/env tsx

import enquirer from 'enquirer';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import ts from 'typescript';

type Mode = 'check' | 'dryRun' | 'run' | 'revert';

// Create a separate logging system
const Logger = {
    buffer: [] as string[],
    log: (...args: any[]) => {
        console.log(...args);
        Logger.buffer.push(args.join(' '));
    },
    error: (...args: any[]) => {
        console.error(...args);
    },
    hasArrowFunctions: () => {
        return Logger.buffer.some(line => line.includes('🔸 Arrow found:'));
    },
    clear: () => {
        Logger.buffer = [];
    }
};

const determineMode = async (): Promise<Mode> => {
    if (process.argv.includes('--check-only')) {
        return 'check';
    }

    const { mode } = await enquirer.prompt<{ mode: Mode }>({
        type: 'select',
        name: 'mode',
        message: 'What would you like to do?',
        choices: [
            { name: 'check', message: '🔍 Check only (log all top-level arrows)' },
            { name: 'dryRun', message: '🧪 Dry run (show changes without saving)' },
            { name: 'run', message: '🚀 Convert arrows to function declarations' },
            { name: 'revert', message: '↩️ Revert back to arrow functions' }
        ]
    });
    return mode;
};

const toArrow = (name: string, params: string, body: string, async = false) =>
    `const ${name} = ${async ? 'async ' : ''}(${params}) => ${body}`;

const toFunction = (
    name: string,
    params: string,
    body: string,
    async = false
) => `${async ? 'async ' : ''}function ${name}(${params}) ${body}`;

const processSource = (code: string, file: string, mode: Mode): string | null => {
    let changed = false;
    const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);
    let result = code;

    source.forEachChild((node) => {
        const loc = source.getLineAndCharacterOfPosition(node.getStart()).line + 1;

        if (ts.isVariableStatement(node) && mode !== 'revert') {
            for (const decl of node.declarationList.declarations) {
                if (
                    decl.initializer &&
                    ts.isArrowFunction(decl.initializer) &&
                    ts.isIdentifier(decl.name)
                ) {
                    const name = decl.name.text;
                    const async = decl.initializer.modifiers?.some(
                        (m) => m.kind === ts.SyntaxKind.AsyncKeyword
                    );
                    const params = decl.initializer.parameters
                        .map((p) => code.slice(p.getStart(), p.getEnd()))
                        .join(', ');
                    const body = code.slice(
                        decl.initializer.body.getStart(),
                        decl.initializer.body.getEnd()
                    );
                    const replacement = toFunction(name, params, body, async);
                    const start = node.getStart();
                    const end = node.getEnd();

                    if (mode === 'check') {
                        Logger.log(`🔸 Arrow found: ${file}:${loc}`);
                    } else if (mode === 'dryRun') {
                        Logger.log(`💡 Would convert: ${file}:${loc}`);
                        Logger.log('→', replacement);
                    } else if (mode === 'run') {
                        result = result.slice(0, start) + replacement + result.slice(end);
                        changed = true;
                        Logger.log(`✅ Converted: ${file}:${loc}`);
                    }
                }
            }
        } else if (
            ts.isFunctionDeclaration(node) &&
            mode === 'revert' &&
            node.name &&
            node.body
        ) {
            const name = node.name.text;
            const async = node.modifiers?.some(
                (m) => m.kind === ts.SyntaxKind.AsyncKeyword
            );
            const params = node.parameters
                .map((p) => code.slice(p.getStart(), p.getEnd()))
                .join(', ');
            const body = code.slice(node.body.getStart(), node.body.getEnd());
            const replacement = toArrow(name, params, body, async);
            const start = node.getStart();
            const end = node.getEnd();

            result = result.slice(0, start) + replacement + result.slice(end);
            changed = true;
            Logger.log(`↩️ Reverted: ${file}:${loc}`);
        }
    });

    return changed ? result : null;
};

const walkDir = (dir: string, mode: Mode): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walkDir(full, mode);
        else if (/\.(ts|tsx)$/.test(extname(full))) {
            const code = readFileSync(full, 'utf8');
            const result = processSource(code, full, mode);
            if ((mode === 'run' || mode === 'revert') && result && result !== code) {
                writeFileSync(full, result);
            }
        }
    }
};

(async () => {
    const currentNodeVersion = process.versions.node;
    const requiredNodeVersion = 23;

    const [majorVersion] = currentNodeVersion.split('.').map(Number);

    if (majorVersion < requiredNodeVersion) {
        Logger.error(
            `🚨 This script requires Node.js version ${requiredNodeVersion} or higher.`
        );
        Logger.error('Please switch to a supported Node.js version using nvm:');
        Logger.error('  nvm use 23');
        Logger.error('Then re-run the script:');
        Logger.error('  node scripts/check-arrow-fnc.ts');
        process.exit(1);
    }

    const mode = await determineMode();
    console.log();
    walkDir('src', mode);

    if (mode === 'check' && Logger.hasArrowFunctions()) {
        const { fix } = await enquirer.prompt<{ fix: boolean }>({
            type: 'confirm',
            name: 'fix',
            message: 'Top-level arrow functions found. Would you like to convert them to function declarations?',
            initial: true
        });

        if (fix) {
            Logger.log('\nRunning in "run" mode to convert...');
            Logger.clear(); // Clear the buffer before running again
            walkDir('src', 'run');
        } else {
            Logger.log('Skipping conversion.');
        }
    }
})();

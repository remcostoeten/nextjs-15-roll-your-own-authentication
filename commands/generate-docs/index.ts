#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import fs from 'fs-extra';

const execAsync = promisify(exec);

interface DocConfig {
	source: string[];
	output: string;
	template?: string;
	readme?: string;
}

const config: DocConfig = {
	source: ['src/core/**/*.ts', 'src/core/**/*.tsx', '!src/**/*.test.ts', '!src/**/*.test.tsx'],
	output: 'docs',
	template: 'node_modules/better-docs/typescript',
	readme: 'README.md',
};

async function generateDocs() {
	try {
		// Ensure output directory exists
		await fs.ensureDir(config.output);

		// Build jsdoc command
		const command = [
			'jsdoc',
			...config.source,
			'-d',
			config.output,
			config.template ? `-t ${config.template}` : '',
			config.readme ? `-R ${config.readme}` : '',
			'--configure jsdoc.json',
		]
			.filter(Boolean)
			.join(' ');

		console.log(chalk.blue('Generating documentation...'));
		console.log(chalk.gray(`Running command: ${command}`));

		const { stdout, stderr } = await execAsync(command);

		if (stdout) console.log(stdout);
		if (stderr) console.error(chalk.yellow(stderr));

		console.log(chalk.green('✓ Documentation generated successfully!'));
		console.log(chalk.blue(`Documentation is available in the ${config.output} directory`));
	} catch (error) {
		console.error(chalk.red('Error generating documentation:'), error);
		process.exit(1);
	}
}

generateDocs();

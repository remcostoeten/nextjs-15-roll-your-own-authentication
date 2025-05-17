#!/usr/bin/env node
import path from 'path';
import chalk from 'chalk';
import { prompt } from 'enquirer';
import fs from 'fs-extra';

interface ScaffoldAnswers {
	moduleName: string;
	needsModule: boolean;
	folders: string[];
	needsPage: boolean;
	pagePath?: string;
}

const AVAILABLE_FOLDERS = [
	'components',
	'hooks',
	'api',
	'api/queries',
	'api/mutations',
	'api/schemas',
	'api/models',
];

async function createView(moduleName: string, basePath: string) {
	const viewName = `${moduleName}-view`;
	const viewContent = `import { type ReactElement } from 'react'

export default function ${moduleName}View(): ReactElement {
  return <h1>${moduleName} view</h1>
}
`;
	await fs.outputFile(path.join(basePath, 'views', viewName, 'index.tsx'), viewContent);
	console.log(chalk.green(`✓ Created view: ${viewName}`));
}

async function createModuleFolders(moduleName: string, folders: string[], basePath: string) {
	const modulePath = path.join(basePath, 'modules', moduleName);

	// Create base module directory
	await fs.ensureDir(modulePath);

	// Create types.ts by default
	const typesContent = `export interface ${moduleName}Props {
  // Add your types here
}
`;
	await fs.outputFile(path.join(modulePath, 'types.ts'), typesContent);

	// Create selected folders
	for (const folder of folders) {
		await fs.ensureDir(path.join(modulePath, folder));
		console.log(chalk.green(`✓ Created folder: ${folder}`));
	}
}

async function createPage(pagePath: string, moduleName: string) {
	const pageContent = `import { type Metadata } from 'next'
import { generateMetadata } from '@/core/utils/generate-metadata'
import ${moduleName}View from '@/views/${moduleName}-view'

export const metadata: Metadata = generateMetadata({
  title: '${moduleName}',
  description: '${moduleName} page'
})

export default function Page() {
  return <${moduleName}View />
}
`;
	await fs.outputFile(path.join(process.cwd(), 'src/app', pagePath, 'page.tsx'), pageContent);
	console.log(chalk.green(`✓ Created page at: ${pagePath}`));
}

async function run() {
	try {
		const answers = await prompt<ScaffoldAnswers>([
			{
				type: 'input',
				name: 'moduleName',
				message: 'What is the name of your feature? (without -view suffix)',
				validate: (value) => value.length > 0,
			},
			{
				type: 'confirm',
				name: 'needsModule',
				message: 'Do you need a modules directory?',
				default: true,
			},
			{
				type: 'multiselect',
				name: 'folders',
				message: 'Select the folders you want to create:',
				choices: AVAILABLE_FOLDERS,
				skip: (state: Record<string, unknown>) => !state.needsModule,
			},
			{
				type: 'confirm',
				name: 'needsPage',
				message: 'Do you need a page?',
				default: true,
			},
			{
				type: 'input',
				name: 'pagePath',
				message: 'Enter the page path (e.g., (auth)/login):',
				skip: (state: Record<string, unknown>) => !state.needsPage,
			},
		]);

		const basePath = path.join(process.cwd(), 'src');

		// Create view
		await createView(answers.moduleName, basePath);

		// Create module if needed
		if (answers.needsModule) {
			await createModuleFolders(answers.moduleName, answers.folders, basePath);
		}

		// Create page if needed
		if (answers.needsPage && answers.pagePath) {
			await createPage(answers.pagePath, answers.moduleName);
		}

		console.log(chalk.blue('\n✨ Feature scaffold complete!'));
	} catch (error) {
		console.error(chalk.red('Error:'), error);
		process.exit(1);
	}
}

run();

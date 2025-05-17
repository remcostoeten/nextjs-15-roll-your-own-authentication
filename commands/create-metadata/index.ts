#!/usr/bin/env node
import path from 'path';
import chalk from 'chalk';
import { prompt } from 'enquirer';
import fs from 'fs-extra';

interface MetadataAnswers {
	name: string;
	type: 'view' | 'layout' | 'page';
	directory: string;
}

async function createMetadataFile(answers: MetadataAnswers) {
	const { name, type, directory } = answers;
	const metadataContent = `import { type Metadata } from 'next';
import { generateMetadata } from '@/core/utils/generate-metadata';

export const metadata: Metadata = generateMetadata({
  title: '${name}',
  description: '${name} ${type}'
});
`;

	const targetDir = path.join(process.cwd(), 'src/core/config/metadata', directory);
	const fileName = `${name}.metadata.ts`;
	const filePath = path.join(targetDir, fileName);

	await fs.ensureDir(targetDir);
	await fs.writeFile(filePath, metadataContent);

	console.log(chalk.green(`✓ Created metadata file: ${filePath}`));
}

async function run() {
	try {
		const answers = await prompt<MetadataAnswers>([
			{
				type: 'input',
				name: 'name',
				message: 'What is the name of your metadata file?',
				validate: (value) => value.length > 0,
			},
			{
				type: 'select',
				name: 'type',
				message: 'What type of metadata is this?',
				choices: ['view', 'layout', 'page'],
			},
			{
				type: 'input',
				name: 'directory',
				message:
					'Which directory should this go in? (relative to src/core/config/metadata)',
				initial: 'views',
			},
		]);

		await createMetadataFile(answers);
		console.log(chalk.blue('\n✨ Metadata file created successfully!'));
	} catch (error) {
		console.error(chalk.red('Error:'), error);
		process.exit(1);
	}
}

run();

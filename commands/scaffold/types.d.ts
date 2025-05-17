declare module 'enquirer' {
	interface PromptOptions {
		type: 'input' | 'confirm' | 'multiselect' | 'select';
		name: string;
		message: string;
		initial?: string | boolean | number;
		default?: string | boolean | number;
		choices?: string[];
		validate?: (value: string) => boolean | string;
		skip?: (state: Record<string, unknown>) => boolean;
	}

	export interface ScaffoldAnswers {
		needsModule: boolean;
		needsPage: boolean;
		folders?: string[];
		pagePath?: string;
	}

	export interface MetadataAnswers {
		name: string;
		type: 'view' | 'layout' | 'page';
		directory: string;
	}

	export function prompt<T>(questions: PromptOptions[]): Promise<T>;
}

export interface Question {
	type: 'input' | 'confirm' | 'multiselect';
	name: string;
	message: string;
	initial?: string | boolean | number;
	default?: string | boolean | number;
	skip?: (state: Record<string, unknown>) => boolean;
	choices?: string[];
}

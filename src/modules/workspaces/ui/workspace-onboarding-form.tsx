'use client';
import { toast } from '@/shared/components/toast';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, Icons } from 'ui';
import { createWorkspace } from '../server/mutations/create-workspace';

const WORKSPACE_TEMPLATES = [
	{ emoji: '🏢', name: 'Company', description: 'For business and corporate projects' },
	{ emoji: '🚀', name: 'Startup', description: 'For fast-moving startup projects' },
	{ emoji: '🎨', name: 'Creative', description: 'For design and creative work' },
	{ emoji: '🔬', name: 'Research', description: 'For research and development' },
	{ emoji: '📚', name: 'Education', description: 'For educational projects' },
	{ emoji: '💼', name: 'Personal', description: 'For personal projects and tasks' },
];

export function WorkspaceOnboardingForm() {
	const [selectedTemplate, setSelectedTemplate] = useState(WORKSPACE_TEMPLATES[0]);
	const [workspaceName, setWorkspaceName] = useState('');
	const [description, setDescription] = useState('');
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!workspaceName.trim()) {
			toast.error('Please enter a workspace name');
			return;
		}

		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.append('title', workspaceName.trim());
				formData.append('emoji', selectedTemplate.emoji);
				formData.append('description', description.trim());

				const result = await createWorkspace(formData);

				if (result.success) {
					toast.success('Workspace created successfully!');
					router.push('/dashboard');
				} else {
					toast.error(result.error || 'Failed to create workspace');
				}
			} catch (error) {
				toast.error('Failed to create workspace');
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Workspace Templates */}
			<div>
				<label className="block text-sm font-medium text-white mb-3">
					Choose a template
				</label>
				<div className="grid grid-cols-2 gap-3">
					{WORKSPACE_TEMPLATES.map((template) => (
						<button
							key={template.name}
							type="button"
							onClick={() => setSelectedTemplate(template)}
							className={`p-4 rounded-lg border text-left transition-colors ${
								selectedTemplate.name === template.name
									? 'border-white bg-white/5 text-white'
									: 'border-[rgb(28,28,28)] bg-[rgb(15,15,15)] text-white/70 hover:border-white/20 hover:text-white'
							}`}
						>
							<div className="text-2xl mb-2">{template.emoji}</div>
							<div className="font-medium text-sm">{template.name}</div>
							<div className="text-xs text-white/50 mt-1">{template.description}</div>
						</button>
					))}
				</div>
			</div>

			{/* Workspace Name */}
			<div>
				<label
					htmlFor="workspaceName"
					className="block text-sm font-medium text-white mb-2"
				>
					Workspace name
				</label>
				<input
					id="workspaceName"
					type="text"
					value={workspaceName}
					onChange={(e) => setWorkspaceName(e.target.value)}
					placeholder="My Awesome Workspace"
					className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
					required
				/>
			</div>

			{/* Description */}
			<div>
				<label htmlFor="description" className="block text-sm font-medium text-white mb-2">
					Description (optional)
				</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="What's this workspace for?"
					rows={3}
					className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 resize-none"
				/>
			</div>

			{/* Submit Button */}
			<Button
				type="submit"
				disabled={isPending || !workspaceName.trim()}
				className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50"
			>
				{isPending ? (
					<>
						<Icons.spinner className="w-4 h-4 animate-spin mr-2" />
						Creating workspace...
					</>
				) : (
					<>
						<span className="mr-2">{selectedTemplate.emoji}</span>
						Create workspace
					</>
				)}
			</Button>
		</form>
	);
}

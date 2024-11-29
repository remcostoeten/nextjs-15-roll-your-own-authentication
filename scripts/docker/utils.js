import { spawn } from 'child_process'

export function copyToClipboard(text) {
	const command = process.platform === 'darwin' ? 'pbcopy' : 'xclip'
	const args =
		process.platform === 'darwin' ? [] : ['-selection', 'clipboard']

	const proc = spawn(command, args)
	proc.stdin.end(text)
}

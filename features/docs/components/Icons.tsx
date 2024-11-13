/**
 * @author remco stoeten
 * @description Collection of icon components and helper functions for file type identification.
 * Includes icons for programming languages, web technologies, documents, media, and development tools.
 */

import { type LucideProps } from 'lucide-react'
import {
	RiFileCodeFill,
	RiFileCodeLine,
	RiFileExcelFill,
	RiFileExcelLine,
	RiFileLockFill,
	RiFileLockLine,
	RiFileMusicFill,
	RiFileMusicLine,
	RiFilePdfFill,
	RiFilePdfLine,
	RiFilePptFill,
	RiFilePptLine,
	RiFileSearchFill,
	RiFileSearchLine,
	RiFileSettingsFill,
	RiFileSettingsLine,
	RiFileShieldFill,
	RiFileShieldLine,
	RiFileTextFill,
	RiFileTextLine,
	RiFileVideoFill,
	RiFileVideoLine,
	RiFileWarningFill,
	RiFileWarningLine,
	RiFileWordFill,
	RiFileWordLine,
	RiFileZipFill,
	RiFileZipLine,
	RiFolder2Fill,
	RiFolder2Line,
	RiFolderOpenFill,
	RiFolderOpenLine,
	RiImageFill,
	RiImageLine
} from 'react-icons/ri'
import {
	SiAngular,
	SiC,
	SiCplusplus,
	SiCsharp,
	SiCss3,
	SiDocker,
	SiGit,
	SiGo,
	SiHtml5,
	SiJavascript,
	SiJest,
	SiJson,
	SiKotlin,
	SiLess,
	SiMarkdown,
	SiMongodb,
	SiNextdotjs,
	SiNpm,
	SiPhp,
	SiPostgresql,
	SiPython,
	SiReact,
	SiRuby,
	SiRust,
	SiSass,
	SiSwift,
	SiTailwindcss,
	SiTypescript,
	SiVercel,
	SiVuedotjs,
	SiYaml,
	SiYarn
} from 'react-icons/si'

export interface IconProps extends LucideProps {
	filled?: boolean
}

// Generic File Icons
export const FolderIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFolder2Fill {...props} /> : <RiFolder2Line {...props} />

export const FolderOpenIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFolderOpenFill {...props} /> : <RiFolderOpenLine {...props} />

export const FileIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileTextFill {...props} /> : <RiFileTextLine {...props} />

export const FileCodeIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileCodeFill {...props} /> : <RiFileCodeLine {...props} />

// Programming Language Icons
export const TypeScriptIcon = SiTypescript
export const JavaScriptIcon = SiJavascript
export const PythonIcon = SiPython
export const RustIcon = SiRust
export const GoIcon = SiGo
export const RubyIcon = SiRuby
export const PhpIcon = SiPhp
export const KotlinIcon = SiKotlin
export const SwiftIcon = SiSwift
export const CplusplusIcon = SiCplusplus
export const CIcon = SiC
export const CsharpIcon = SiCsharp

// Web Technology Icons
export const HtmlIcon = SiHtml5
export const CssIcon = SiCss3
export const SassIcon = SiSass
export const LessIcon = SiLess
export const TailwindIcon = SiTailwindcss
export const ReactIcon = SiReact
export const VueIcon = SiVuedotjs
export const AngularIcon = SiAngular
export const NextjsIcon = SiNextdotjs
export const VercelIcon = SiVercel

// Document Icons
export const MarkdownIcon = SiMarkdown
export const JsonIcon = SiJson
export const YamlIcon = SiYaml
export const PdfIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFilePdfFill {...props} /> : <RiFilePdfLine {...props} />

// Media Icons
export const ImageIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiImageFill {...props} /> : <RiImageLine {...props} />

export const VideoIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileVideoFill {...props} /> : <RiFileVideoLine {...props} />

export const AudioIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileMusicFill {...props} /> : <RiFileMusicLine {...props} />

// Archive Icons
export const ZipIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileZipFill {...props} /> : <RiFileZipLine {...props} />

// Office Icons
export const ExcelIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileExcelFill {...props} /> : <RiFileExcelLine {...props} />

export const WordIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileWordFill {...props} /> : <RiFileWordLine {...props} />

export const PowerPointIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFilePptFill {...props} /> : <RiFilePptLine {...props} />

// Development Icons
export const GitIcon = SiGit
export const DockerIcon = SiDocker
export const NpmIcon = SiNpm
export const YarnIcon = SiYarn
export const JestIcon = SiJest
export const PostgresIcon = SiPostgresql
export const MongoIcon = SiMongodb

// Special File Icons
export const ConfigIcon = ({ filled, ...props }: IconProps) =>
	filled ? (
		<RiFileSettingsFill {...props} />
	) : (
		<RiFileSettingsLine {...props} />
	)

export const SecurityIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileShieldFill {...props} /> : <RiFileShieldLine {...props} />

export const LockIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileLockFill {...props} /> : <RiFileLockLine {...props} />

export const SearchIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileSearchFill {...props} /> : <RiFileSearchLine {...props} />

export const WarningIcon = ({ filled, ...props }: IconProps) =>
	filled ? <RiFileWarningFill {...props} /> : <RiFileWarningLine {...props} />

// Helper function to get icon by file extension
export function getIconByExtension(
	extension: string,
	props: IconProps = {}
): React.ReactElement {
	const iconMap: Record<string, React.ComponentType<IconProps>> = {
		// Programming Languages
		ts: TypeScriptIcon,
		tsx: TypeScriptIcon,
		js: JavaScriptIcon,
		jsx: JavaScriptIcon,
		py: PythonIcon,
		rs: RustIcon,
		go: GoIcon,
		rb: RubyIcon,
		php: PhpIcon,
		kt: KotlinIcon,
		swift: SwiftIcon,
		cpp: CplusplusIcon,
		c: CIcon,
		cs: CsharpIcon,

		// Web Technologies
		html: HtmlIcon,
		css: CssIcon,
		scss: SassIcon,
		less: LessIcon,

		// Documents
		md: MarkdownIcon,
		mdx: MarkdownIcon,
		json: JsonIcon,
		yaml: YamlIcon,
		yml: YamlIcon,
		pdf: PdfIcon,

		// Media
		png: ImageIcon,
		jpg: ImageIcon,
		jpeg: ImageIcon,
		gif: ImageIcon,
		svg: ImageIcon,
		mp4: VideoIcon,
		mov: VideoIcon,
		mp3: AudioIcon,
		wav: AudioIcon,

		// Archives
		zip: ZipIcon,
		rar: ZipIcon,
		'7z': ZipIcon,
		tar: ZipIcon,
		gz: ZipIcon,

		// Office
		xlsx: ExcelIcon,
		xls: ExcelIcon,
		doc: WordIcon,
		docx: WordIcon,
		ppt: PowerPointIcon,
		pptx: PowerPointIcon,

		// Special files
		gitignore: GitIcon,
		dockerignore: DockerIcon,
		dockerfile: DockerIcon,
		env: ConfigIcon,
		lock: LockIcon
	}

	const Icon = iconMap[extension.toLowerCase()] || FileIcon
	return <Icon {...props} />
}

// Helper function to get icon by filename
export function getIconByFilename(
	filename: string,
	props: IconProps = {}
): React.ReactElement {
	const specialFiles: Record<string, React.ComponentType<IconProps>> = {
		'package.json': NpmIcon,
		'package-lock.json': NpmIcon,
		'yarn.lock': YarnIcon,
		'.gitignore': GitIcon,
		'.env': ConfigIcon,
		dockerfile: DockerIcon,
		'docker-compose.yml': DockerIcon,
		'docker-compose.yaml': DockerIcon,
		'jest.config.js': JestIcon,
		'jest.config.ts': JestIcon,
		'tsconfig.json': TypeScriptIcon,
		'next.config.js': NextjsIcon,
		'next.config.ts': NextjsIcon,
		'vercel.json': VercelIcon,
		'tailwind.config.js': TailwindIcon,
		'tailwind.config.ts': TailwindIcon
	}

	// First check for special filenames
	if (filename.toLowerCase() in specialFiles) {
		const Icon = specialFiles[filename.toLowerCase()]
		return <Icon {...props} />
	}

	// Otherwise, get icon by extension
	const extension = filename.split('.').pop() || ''
	return getIconByExtension(extension, props)
}

export const FileTree = FolderIcon

export default {
	// Helper functions
	getIconByExtension,
	getIconByFilename,

	// Generic File Icons
	FolderIcon,
	FolderOpenIcon,
	FileIcon,
	FileCodeIcon,

	// Programming Language Icons
	TypeScriptIcon,
	JavaScriptIcon,
	PythonIcon,
	RustIcon,
	GoIcon,
	RubyIcon,
	PhpIcon,
	KotlinIcon,
	SwiftIcon,
	CplusplusIcon,
	CIcon,
	CsharpIcon,

	// Web Technology Icons
	HtmlIcon,
	CssIcon,
	SassIcon,
	LessIcon,
	TailwindIcon,
	ReactIcon,
	VueIcon,
	AngularIcon,
	NextjsIcon,
	VercelIcon,

	// Document Icons
	MarkdownIcon,
	JsonIcon,
	YamlIcon,
	PdfIcon,

	// Media Icons
	ImageIcon,
	VideoIcon,
	AudioIcon,

	// Archive Icons
	ZipIcon,

	// Office Icons
	ExcelIcon,
	WordIcon,
	PowerPointIcon,

	// Development Icons
	GitIcon,
	DockerIcon,
	NpmIcon,
	YarnIcon,
	JestIcon,
	PostgresIcon,
	MongoIcon,

	// Special File Icons
	ConfigIcon,
	SecurityIcon,
	LockIcon,
	SearchIcon,
	WarningIcon,

	// File Tree Icon
	FileTree
} as const

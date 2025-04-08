"use client"

import { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface SnippetSyntaxHighlighterProps {
  code: string
  language: string
  showLineNumbers?: boolean
}

export function SnippetSyntaxHighlighter({ code, language, showLineNumbers = true }: SnippetSyntaxHighlighterProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    )
  }

  // Map common language names to ones supported by the highlighter
  const languageMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "jsx",
    tsx: "tsx",
    py: "python",
    rb: "ruby",
    go: "go",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    rust: "rust",
    swift: "swift",
    kotlin: "kotlin",
    dart: "dart",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    yaml: "yaml",
    md: "markdown",
    sql: "sql",
    sh: "bash",
    bash: "bash",
    plain: "text",
    text: "text",
  }

  const mappedLanguage = languageMap[language.toLowerCase()] || language.toLowerCase()

  return (
    <SyntaxHighlighter
      language={mappedLanguage}
      style={vscDarkPlus}
      showLineNumbers={showLineNumbers}
      wrapLines={true}
      customStyle={{
        margin: 0,
        padding: "1rem",
        borderRadius: 0,
        fontSize: "0.875rem",
      }}
    >
      {code}
    </SyntaxHighlighter>
  )
}


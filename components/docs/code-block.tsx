"use client"

import { FC } from "react"

interface CodeBlockProps {
  language: string
  code: string
  fileName?: string
}

interface CodeTabsProps {
  tabs: {
    title: string
    language: string
    code: string
    fileName?: string
  }[]
}

export const CodeBlock: FC<CodeBlockProps> = ({ language, code, fileName }) => {
  return (
    <div className="relative rounded-lg bg-slate-950 p-4">
      {fileName && <div className="mb-2 text-sm text-slate-400">{fileName}</div>}
      <pre className="overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export const CodeTabs: FC<CodeTabsProps> = ({ tabs }) => {
  return (
    <div className="rounded-lg border border-slate-200">
      <div className="flex border-b border-slate-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className="px-4 py-2 text-sm hover:bg-slate-100"
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="p-4">
        <CodeBlock
          language={tabs[0].language}
          code={tabs[0].code}
          fileName={tabs[0].fileName}
        />
      </div>
    </div>
  )
}

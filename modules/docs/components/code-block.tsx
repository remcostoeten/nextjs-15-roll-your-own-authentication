"use client"

import { useState } from "react"
import { Check, Copy, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/utilities/utils"
import { Button } from "@/components/ui/button"
import Prism from "prismjs"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/themes/prism-tomorrow.css"
import { useEffect } from "react"

interface CodeBlockProps {
  code: string
  language: string
  fileName?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeBlock({ code, language, fileName, showLineNumbers = true, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Prism.highlightAll()
  }, [code, language])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const element = document.createElement("a")
    const file = new Blob([code], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = fileName || `code.${language}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className={cn("relative my-4 rounded-md border", className)}>
      {fileName && (
        <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
          <div className="text-sm text-muted-foreground">{fileName}</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy code</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={downloadCode}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download code</span>
            </Button>
          </div>
        </div>
      )}
      <pre className={cn("overflow-x-auto p-4", showLineNumbers && "line-numbers", !fileName && "rounded-md")}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      {!fileName && (
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      )}
    </div>
  )
}

interface CodeTabsProps {
  tabs: {
    title: string
    language: string
    code: string
    fileName?: string
  }[]
  className?: string
}

export function CodeTabs({ tabs, className }: CodeTabsProps) {
  return (
    <Tabs defaultValue={tabs[0].title} className={cn("my-4", className)}>
      <div className="flex items-center justify-between">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.title} value={tab.title}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab.title} value={tab.title}>
          <CodeBlock code={tab.code} language={tab.language} fileName={tab.fileName} />
        </TabsContent>
      ))}
    </Tabs>
  )
}


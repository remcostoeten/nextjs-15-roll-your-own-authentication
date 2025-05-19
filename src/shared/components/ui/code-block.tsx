import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'

interface CodeBlockProps {
  code: Array<{
    lineNumber: number
    content: Array<{
      type: string
      content: string
    }>
  }>
  language?: string
  showLineNumbers?: boolean
  className?: string
  title?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  showLineNumbers = true,
  className,
  title,
}) => {
  // Convert our custom format to a single string for prism
  const codeString = code
    .map(line => 
      line.content
        .map(segment => segment.content)
        .join('')
    )
    .join('\n')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative rounded-lg overflow-hidden',
        'bg-[#1E1E1E] dark:bg-[#1A1A1A]',
        'shadow-xl dark:shadow-2xl',
        className
      )}
    >
      {/* Code Block Header */}
      {title && (
        <div className="flex items-center px-4 py-2 bg-[#2D2D2D] dark:bg-[#252525] border-b border-[#404040]">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <span className="text-sm text-gray-400">{title}</span>
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <Highlight
          theme={themes.nightOwl}
          code={codeString}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn(
                className,
                'p-4 overflow-x-auto',
                'text-sm md:text-base',
                'font-mono'
              )}
              style={style}
            >
              {tokens.map((line, i) => {
                const lineNumber = i + 1
                return (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    className="table-row"
                  >
                    {showLineNumbers && (
                      <span className="table-cell pr-4 text-gray-500 select-none">
                        {lineNumber}
                      </span>
                    )}
                    <span className="table-cell">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                )
              })}
            </pre>
          )}
        </Highlight>

        {/* Gradient Border Effect */}
        <div className="absolute -top-[2px] left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute top-0 -left-[2px] w-[2px] h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
      </div>
    </motion.div>
  )
} 
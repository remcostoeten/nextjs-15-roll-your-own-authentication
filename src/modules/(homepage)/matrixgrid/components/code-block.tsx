"use client"

import { useState, useEffect, useRef } from "react"
import { Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Update the code examples to better represent the core authentication syntax
const USER_CREATION_CODE = [
  {
    lineNumber: 1,
    content: [{ type: "comment", content: "// auth/jwt-handler.ts" }],
  },
  {
    lineNumber: 2,
    content: [{ type: "string", content: "'use server'" }],
  },
  {
    lineNumber: 3,
    content: [],
  },
  {
    lineNumber: 4,
    content: [
      { type: "keyword", content: "import" },
      { type: "punctuation", content: " { " },
      { type: "variable", content: "SignJWT, jwtVerify " },
      { type: "punctuation", content: "} " },
      { type: "keyword", content: "from" },
      { type: "string", content: " 'jose'" },
    ],
  },
  {
    lineNumber: 5,
    content: [
      { type: "keyword", content: "import" },
      { type: "punctuation", content: " { " },
      { type: "variable", content: "cookies " },
      { type: "punctuation", content: "} " },
      { type: "keyword", content: "from" },
      { type: "string", content: " 'next/headers'" },
    ],
  },
  {
    lineNumber: 6,
    content: [],
  },
  {
    lineNumber: 7,
    content: [
      { type: "keyword", content: "const" },
      { type: "variable", content: " JWT_SECRET " },
      { type: "operator", content: "= " },
      { type: "keyword", content: "new" },
      { type: "variable", content: " TextEncoder" },
      { type: "punctuation", content: "()." },
      { type: "function", content: "encode" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "process" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "env" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "JWT_SECRET " },
      { type: "operator", content: "|| " },
      { type: "string", content: "'your-secret-key'" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 8,
    content: [],
  },
  {
    lineNumber: 9,
    content: [{ type: "comment", content: "/**" }],
  },
  {
    lineNumber: 10,
    content: [{ type: "comment", content: " * Create a JWT token with the provided payload" }],
  },
  {
    lineNumber: 11,
    content: [{ type: "comment", content: " */" }],
  },
  {
    lineNumber: 12,
    content: [
      { type: "keyword", content: "export async function" },
      { type: "function", content: " createToken" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "payload" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "any" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "expiresIn" },
      { type: "punctuation", content: " = " },
      { type: "string", content: "'1d'" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 13,
    content: [
      { type: "keyword", content: "  try" },
      { type: "punctuation", content: " {" },
    ],
  },
  {
    lineNumber: 14,
    content: [
      { type: "keyword", content: "    const" },
      { type: "variable", content: " token " },
      { type: "operator", content: "= " },
      { type: "keyword", content: "await new" },
      { type: "variable", content: " SignJWT" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "payload" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 15,
    content: [
      { type: "punctuation", content: "      ." },
      { type: "function", content: "setProtectedHeader" },
      { type: "punctuation", content: "({ " },
      { type: "property", content: "alg" },
      { type: "punctuation", content: ": " },
      { type: "string", content: "'HS256'" },
      { type: "punctuation", content: " })" },
    ],
  },
  {
    lineNumber: 16,
    content: [
      { type: "punctuation", content: "      ." },
      { type: "function", content: "setIssuedAt" },
      { type: "punctuation", content: "()" },
    ],
  },
  {
    lineNumber: 17,
    content: [
      { type: "punctuation", content: "      ." },
      { type: "function", content: "setExpirationTime" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "expiresIn" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 18,
    content: [
      { type: "punctuation", content: "      ." },
      { type: "function", content: "sign" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "JWT_SECRET" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 19,
    content: [],
  },
  {
    lineNumber: 20,
    content: [
      { type: "keyword", content: "    return" },
      { type: "punctuation", content: " { " },
      { type: "property", content: "token" },
      { type: "punctuation", content: " }" },
    ],
  },
  {
    lineNumber: 21,
    content: [
      { type: "punctuation", content: "  } " },
      { type: "keyword", content: "catch" },
      { type: "punctuation", content: " (" },
      { type: "variable", content: "error" },
      { type: "punctuation", content: ") {" },
    ],
  },
  {
    lineNumber: 22,
    content: [
      { type: "keyword", content: "    return" },
      { type: "punctuation", content: " { " },
      { type: "property", content: "error" },
      { type: "punctuation", content: ": " },
      { type: "string", content: "'Failed to create token'" },
      { type: "punctuation", content: " }" },
    ],
  },
  {
    lineNumber: 23,
    content: [{ type: "punctuation", content: "  }" }],
  },
  {
    lineNumber: 24,
    content: [{ type: "punctuation", content: "}" }],
  },
]

const USER_LOGIN_CODE = [
  {
    lineNumber: 1,
    content: [{ type: "comment", content: "// auth/password-utils.ts" }],
  },
  {
    lineNumber: 2,
    content: [{ type: "string", content: "'use server'" }],
  },
  {
    lineNumber: 3,
    content: [],
  },
  {
    lineNumber: 4,
    content: [
      { type: "keyword", content: "import" },
      { type: "punctuation", content: " * " },
      { type: "keyword", content: "as" },
      { type: "variable", content: " bcrypt " },
      { type: "keyword", content: "from" },
      { type: "string", content: " 'bcryptjs'" },
    ],
  },
  {
    lineNumber: 5,
    content: [],
  },
  {
    lineNumber: 6,
    content: [{ type: "comment", content: "/**" }],
  },
  {
    lineNumber: 7,
    content: [{ type: "comment", content: " * Hash a password using bcrypt" }],
  },
  {
    lineNumber: 8,
    content: [{ type: "comment", content: " */" }],
  },
  {
    lineNumber: 9,
    content: [
      { type: "keyword", content: "export async function" },
      { type: "function", content: " hashPassword" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "password" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: "): " },
      { type: "keyword", content: "Promise" },
      { type: "punctuation", content: "<" },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: "> {" },
    ],
  },
  {
    lineNumber: 10,
    content: [
      { type: "keyword", content: "  const" },
      { type: "variable", content: " saltRounds " },
      { type: "operator", content: "= " },
      { type: "number", content: "10" },
    ],
  },
  {
    lineNumber: 11,
    content: [
      { type: "keyword", content: "  return" },
      { type: "variable", content: " bcrypt" },
      { type: "punctuation", content: "." },
      { type: "function", content: "hash" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "password" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "saltRounds" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 12,
    content: [{ type: "punctuation", content: "}" }],
  },
  {
    lineNumber: 13,
    content: [],
  },
  {
    lineNumber: 14,
    content: [{ type: "comment", content: "/**" }],
  },
  {
    lineNumber: 15,
    content: [{ type: "comment", content: " * Compare a password with a hash" }],
  },
  {
    lineNumber: 16,
    content: [{ type: "comment", content: " */" }],
  },
  {
    lineNumber: 17,
    content: [
      { type: "keyword", content: "export async function" },
      { type: "function", content: " comparePasswords" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "password" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "hashedPassword" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: "): " },
      { type: "keyword", content: "Promise" },
      { type: "punctuation", content: "<" },
      { type: "keyword", content: "boolean" },
      { type: "punctuation", content: "> {" },
    ],
  },
  {
    lineNumber: 18,
    content: [
      { type: "keyword", content: "  return" },
      { type: "variable", content: " bcrypt" },
      { type: "punctuation", content: "." },
      { type: "function", content: "compare" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "password" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "hashedPassword" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 19,
    content: [{ type: "punctuation", content: "}" }],
  },
  {
    lineNumber: 20,
    content: [],
  },
  {
    lineNumber: 21,
    content: [{ type: "comment", content: "/**" }],
  },
  {
    lineNumber: 22,
    content: [{ type: "comment", content: " * Generate a secure random token" }],
  },
  {
    lineNumber: 23,
    content: [{ type: "comment", content: " */" }],
  },
  {
    lineNumber: 24,
    content: [
      { type: "keyword", content: "export function" },
      { type: "function", content: " generateToken" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "length" },
      { type: "punctuation", content: " = " },
      { type: "number", content: "32" },
      { type: "punctuation", content: "): " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: " {" },
    ],
  },
  {
    lineNumber: 25,
    content: [
      { type: "keyword", content: "  const" },
      { type: "variable", content: " buffer " },
      { type: "operator", content: "= " },
      { type: "keyword", content: "new" },
      { type: "variable", content: " Uint8Array" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "length" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 26,
    content: [
      { type: "variable", content: "  crypto" },
      { type: "punctuation", content: "." },
      { type: "function", content: "getRandomValues" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "buffer" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 27,
    content: [
      { type: "keyword", content: "  return" },
      { type: "variable", content: " Array" },
      { type: "punctuation", content: "." },
      { type: "function", content: "from" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "buffer" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 28,
    content: [
      { type: "punctuation", content: "    ." },
      { type: "function", content: "map" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "b " },
      { type: "operator", content: "=> " },
      { type: "variable", content: "b" },
      { type: "punctuation", content: "." },
      { type: "function", content: "toString" },
      { type: "punctuation", content: "(" },
      { type: "number", content: "16" },
      { type: "punctuation", content: ")." },
      { type: "function", content: "padStart" },
      { type: "punctuation", content: "(" },
      { type: "number", content: "2" },
      { type: "punctuation", content: ", " },
      { type: "string", content: "'0'" },
      { type: "punctuation", content: "))" },
    ],
  },
  {
    lineNumber: 29,
    content: [
      { type: "punctuation", content: "    ." },
      { type: "function", content: "join" },
      { type: "punctuation", content: "(" },
      { type: "string", content: "''" },
      { type: "punctuation", content: ")" },
    ],
  },
  {
    lineNumber: 30,
    content: [{ type: "punctuation", content: "}" }],
  },
]

// Function to get raw code for copying based on active tab
const getRawCode = (activeTab: string) => {
  const codeExample = activeTab === "jwt-handler.ts" ? USER_CREATION_CODE : USER_LOGIN_CODE
  return codeExample.map((line) => line.content.map((token) => token.content).join("")).join("\n")
}

export function CodeBlock() {
  const [activeTab, setActiveTab] = useState("jwt-handler.ts")
  const [copied, setCopied] = useState(false)
  const [visibleLines, setVisibleLines] = useState(0)
  const codeContainerRef = useRef<HTMLDivElement>(null)

  const copyCode = () => {
    navigator.clipboard.writeText(getRawCode(activeTab))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Reset visible lines when tab changes
  useEffect(() => {
    setVisibleLines(0)
  }, [activeTab])

  useEffect(() => {
    // Animate code lines appearing one by one
    const codeExample = activeTab === "jwt-handler.ts" ? USER_CREATION_CODE : USER_LOGIN_CODE

    if (visibleLines < codeExample.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1)
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [visibleLines, activeTab])

  // Get the current code example based on active tab
  const currentCodeExample = activeTab === "jwt-handler.ts" ? USER_CREATION_CODE : USER_LOGIN_CODE

  return (
    <motion.div
      className="w-full rounded-lg border border-[#1E1E1E] bg-[#0D0C0C] overflow-hidden shadow-lg sticky-code-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Tab header */}
      <motion.div
        className="flex items-center justify-between border-b border-[#1E1E1E] bg-[#0D0C0C] px-4 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex">
          {["jwt-handler.ts", "password-utils.ts"].map((tab, index) => (
            <motion.button
              key={tab}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                index === 0 ? "" : "ml-1"
              } ${
                activeTab === tab
                  ? "text-[#F2F0ED] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#4e9815]"
                  : "text-[#8C877D] hover:text-[#ADADAD]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </motion.button>
          ))}
        </div>
        <motion.button
          onClick={copyCode}
          className="rounded-full p-1.5 hover:bg-[#1E1E1E] transition-colors duration-200"
          aria-label={copied ? "Copied" : "Copy code"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="h-4 w-4 text-[#4e9815]" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="h-4 w-4 text-[#8C877D]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Code content */}
      <div className="relative h-[400px] overflow-hidden">
        <div ref={codeContainerRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden">
          <table className="w-full border-collapse">
            <tbody>
              {currentCodeExample.map((line, index) => (
                <motion.tr
                  key={`${activeTab}-${line.lineNumber}`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{
                    opacity: index < visibleLines ? 1 : 0,
                    y: index < visibleLines ? 0 : -5,
                  }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <td className="w-12 pr-4 text-right font-mono text-xs text-[#444] select-none bg-[#0A0A0A] border-r border-[#1E1E1E]">
                    {String(line.lineNumber).padStart(2, "0")}
                  </td>
                  <td className="pl-4 font-mono text-sm">
                    {line.content.map((token, i) => (
                      <span key={i} className={`token ${token.type}`}>
                        {token.content}
                      </span>
                    ))}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-[#1E1E1E] bg-[#0D0C0C] px-4 py-2 text-xs text-[#444] font-mono">
        {activeTab === "jwt-handler.ts" ? "auth/jwt-handler.ts" : "auth/password-utils.ts"}
      </div>
    </motion.div>
  )
}


"use client"

import { useState, useEffect, useRef } from "react"
import { Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Define the code with syntax highlighting tokens for user creation
const USER_CREATION_CODE = [
  {
    lineNumber: 1,
    content: [{ type: "comment", content: "// auth-utils.ts - Copy and paste this file into your project" }],
  },
  {
    lineNumber: 2,
    content: [
      { type: "keyword", content: "import" },
      { type: "punctuation", content: " { " },
      { type: "variable", content: "randomBytes, pbkdf2Sync " },
      { type: "punctuation", content: "} " },
      { type: "keyword", content: "from" },
      { type: "string", content: " 'crypto'" },
    ],
  },
  {
    lineNumber: 3,
    content: [],
  },
  {
    lineNumber: 4,
    content: [{ type: "comment", content: "// Hash a password with PBKDF2 - no dependencies needed" }],
  },
  {
    lineNumber: 5,
    content: [
      { type: "keyword", content: "export function" },
      { type: "function", content: " hashPassword" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "password" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: "): " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: " {" },
    ],
  },
  {
    lineNumber: 6,
    content: [
      { type: "keyword", content: "  const" },
      { type: "variable", content: " salt " },
      { type: "operator", content: "= " },
      { type: "function", content: "randomBytes" },
      { type: "punctuation", content: "(" },
      { type: "number", content: "16" },
      { type: "punctuation", content: ")." },
      { type: "function", content: "toString" },
      { type: "punctuation", content: "(" },
      { type: "string", content: "'hex'" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 7,
    content: [
      { type: "keyword", content: "  const" },
      { type: "variable", content: " hash " },
      { type: "operator", content: "= " },
      { type: "function", content: "pbkdf2Sync" },
      { type: "punctuation", content: "(" },
    ],
  },
  {
    lineNumber: 8,
    content: [
      { type: "variable", content: "    password" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 9,
    content: [
      { type: "variable", content: "    salt" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 10,
    content: [
      { type: "number", content: "    1000" },
      { type: "punctuation", content: "," },
      { type: "comment", content: " // iterations" },
    ],
  },
  {
    lineNumber: 11,
    content: [
      { type: "number", content: "    64" },
      { type: "punctuation", content: "," },
      { type: "comment", content: " // key length" },
    ],
  },
  {
    lineNumber: 12,
    content: [
      { type: "string", content: "    'sha512'" },
      { type: "comment", content: " // digest" },
    ],
  },
  {
    lineNumber: 13,
    content: [
      { type: "punctuation", content: "  )." },
      { type: "function", content: "toString" },
      { type: "punctuation", content: "(" },
      { type: "string", content: "'hex'" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 14,
    content: [],
  },
  {
    lineNumber: 15,
    content: [
      { type: "keyword", content: "  return" },
      { type: "punctuation", content: " `" },
      { type: "variable", content: "${salt}" },
      { type: "punctuation", content: ":" },
      { type: "variable", content: "${hash}" },
      { type: "punctuation", content: "`;" },
      { type: "comment", content: " // Store both salt and hash" },
    ],
  },
  {
    lineNumber: 16,
    content: [{ type: "punctuation", content: "}" }],
  },
  {
    lineNumber: 17,
    content: [],
  },
  {
    lineNumber: 18,
    content: [{ type: "comment", content: "// Verify a password against a stored hash" }],
  },
  {
    lineNumber: 19,
    content: [
      { type: "keyword", content: "export function" },
      { type: "function", content: " verifyPassword" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "password" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "storedHash" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: "): " },
      { type: "keyword", content: "boolean" },
      { type: "punctuation", content: " {" },
    ],
  },
  {
    lineNumber: 20,
    content: [
      { type: "keyword", content: "  const" },
      { type: "punctuation", content: " [" },
      { type: "variable", content: "salt" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "originalHash" },
      { type: "punctuation", content: "] = " },
      { type: "variable", content: "storedHash" },
      { type: "punctuation", content: "." },
      { type: "function", content: "split" },
      { type: "punctuation", content: "(" },
      { type: "string", content: "':'" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 21,
    content: [
      { type: "keyword", content: "  const" },
      { type: "variable", content: " hash " },
      { type: "operator", content: "= " },
      { type: "function", content: "pbkdf2Sync" },
      { type: "punctuation", content: "(" },
    ],
  },
  {
    lineNumber: 22,
    content: [
      { type: "variable", content: "    password" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 23,
    content: [
      { type: "variable", content: "    salt" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 24,
    content: [
      { type: "number", content: "    1000" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 25,
    content: [
      { type: "number", content: "    64" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 26,
    content: [{ type: "string", content: "    'sha512'" }],
  },
  {
    lineNumber: 27,
    content: [
      { type: "punctuation", content: "  )." },
      { type: "function", content: "toString" },
      { type: "punctuation", content: "(" },
      { type: "string", content: "'hex'" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 28,
    content: [],
  },
  {
    lineNumber: 29,
    content: [
      { type: "keyword", content: "  return" },
      { type: "variable", content: " hash " },
      { type: "operator", content: "===" },
      { type: "variable", content: " originalHash" },
      { type: "punctuation", content: ";" },
    ],
  },
  {
    lineNumber: 30,
    content: [{ type: "punctuation", content: "}" }],
  },
  {
    lineNumber: 31,
    content: [],
  },
  {
    lineNumber: 32,
    content: [{ type: "comment", content: "// Generate a secure random token for sessions" }],
  },
  {
    lineNumber: 33,
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
    lineNumber: 34,
    content: [
      { type: "keyword", content: "  return" },
      { type: "function", content: " randomBytes" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "length" },
      { type: "punctuation", content: ")." },
      { type: "function", content: "toString" },
      { type: "punctuation", content: "(" },
      { type: "string", content: "'hex'" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 35,
    content: [{ type: "punctuation", content: "}" }],
  },
]

// Define the code with syntax highlighting tokens for user login
const USER_LOGIN_CODE = [
  {
    lineNumber: 1,
    content: [{ type: "comment", content: "// auth.ts - Copy and paste this file into your project" }],
  },
  {
    lineNumber: 2,
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
    lineNumber: 3,
    content: [
      { type: "keyword", content: "import" },
      { type: "punctuation", content: " { " },
      { type: "variable", content: "verifyPassword, generateToken " },
      { type: "punctuation", content: "} " },
      { type: "keyword", content: "from" },
      { type: "string", content: " './auth-utils'" },
    ],
  },
  {
    lineNumber: 4,
    content: [],
  },
  {
    lineNumber: 5,
    content: [{ type: "comment", content: "// Define your user type - customize as needed" }],
  },
  {
    lineNumber: 6,
    content: [
      { type: "keyword", content: "type" },
      { type: "variable", content: " User " },
      { type: "operator", content: "= " },
      { type: "punctuation", content: "{" },
    ],
  },
  {
    lineNumber: 7,
    content: [
      { type: "property", content: "  id" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ";" },
    ],
  },
  {
    lineNumber: 8,
    content: [
      { type: "property", content: "  email" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ";" },
    ],
  },
  {
    lineNumber: 9,
    content: [
      { type: "property", content: "  password" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ";" },
    ],
  },
  {
    lineNumber: 10,
    content: [
      { type: "property", content: "  name" },
      { type: "punctuation", content: "?: " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ";" },
    ],
  },
  {
    lineNumber: 11,
    content: [
      { type: "property", content: "  role" },
      { type: "punctuation", content: ": " },
      { type: "string", content: "'user'" },
      { type: "punctuation", content: " | " },
      { type: "string", content: "'admin'" },
      { type: "punctuation", content: ";" },
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
    content: [{ type: "comment", content: "// Server action for user login - use in your route handlers" }],
  },
  {
    lineNumber: 15,
    content: [
      { type: "keyword", content: "export async function" },
      { type: "function", content: " loginUser" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "email" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "password" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ") {" },
    ],
  },
  {
    lineNumber: 16,
    content: [
      { type: "keyword", content: "  try" },
      { type: "punctuation", content: " {" },
    ],
  },
  {
    lineNumber: 17,
    content: [{ type: "comment", content: "    // In a real app, fetch user from your database" }],
  },
  {
    lineNumber: 18,
    content: [
      { type: "keyword", content: "    const" },
      { type: "variable", content: " user " },
      { type: "operator", content: "= " },
      { type: "keyword", content: "await" },
      { type: "function", content: " findUserByEmail" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "email" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 19,
    content: [],
  },
  {
    lineNumber: 20,
    content: [
      { type: "keyword", content: "    if" },
      { type: "punctuation", content: " (!" },
      { type: "variable", content: "user" },
      { type: "punctuation", content: ") {" },
    ],
  },
  {
    lineNumber: 21,
    content: [
      { type: "keyword", content: "      throw new" },
      { type: "function", content: " Error" },
      { type: "punctuation", content: "(" },
      { type: "string", content: "'Invalid email or password'" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 22,
    content: [{ type: "punctuation", content: "    }" }],
  },
  {
    lineNumber: 23,
    content: [],
  },
  {
    lineNumber: 24,
    content: [{ type: "comment", content: "    // Verify password using our utility" }],
  },
  {
    lineNumber: 25,
    content: [
      { type: "keyword", content: "    const" },
      { type: "variable", content: " isValid " },
      { type: "operator", content: "= " },
      { type: "function", content: "verifyPassword" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "password" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "user" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "password" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 26,
    content: [],
  },
  {
    lineNumber: 27,
    content: [
      { type: "keyword", content: "    if" },
      { type: "punctuation", content: " (!" },
      { type: "variable", content: "isValid" },
      { type: "punctuation", content: ") {" },
    ],
  },
  {
    lineNumber: 28,
    content: [
      { type: "keyword", content: "      throw new" },
      { type: "function", content: " Error" },
      { type: "punctuation", content: "(" },
      { type: "string", content: "'Invalid email or password'" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 29,
    content: [{ type: "punctuation", content: "    }" }],
  },
  {
    lineNumber: 30,
    content: [],
  },
  {
    lineNumber: 31,
    content: [{ type: "comment", content: "    // Create a session token" }],
  },
  {
    lineNumber: 32,
    content: [
      { type: "keyword", content: "    const" },
      { type: "variable", content: " token " },
      { type: "operator", content: "= " },
      { type: "function", content: "generateToken" },
      { type: "punctuation", content: "();" },
    ],
  },
  {
    lineNumber: 33,
    content: [
      { type: "keyword", content: "    const" },
      { type: "variable", content: " expires " },
      { type: "operator", content: "= " },
      { type: "keyword", content: "new " },
      { type: "function", content: "Date" },
      { type: "punctuation", content: "();" },
    ],
  },
  {
    lineNumber: 34,
    content: [
      { type: "variable", content: "    expires" },
      { type: "punctuation", content: "." },
      { type: "function", content: "setDate" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "expires" },
      { type: "punctuation", content: "." },
      { type: "function", content: "getDate" },
      { type: "punctuation", content: "() + " },
      { type: "number", content: "7" },
      { type: "punctuation", content: ");" },
      { type: "comment", content: " // 7 days" },
    ],
  },
  {
    lineNumber: 35,
    content: [],
  },
  {
    lineNumber: 36,
    content: [{ type: "comment", content: "    // Store session in your database" }],
  },
  {
    lineNumber: 37,
    content: [
      { type: "keyword", content: "    await" },
      { type: "function", content: " createSession" },
      { type: "punctuation", content: "({" },
    ],
  },
  {
    lineNumber: 38,
    content: [
      { type: "property", content: "      token" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 39,
    content: [
      { type: "property", content: "      userId" },
      { type: "punctuation", content: ": " },
      { type: "variable", content: "user" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "id" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 40,
    content: [{ type: "property", content: "      expires" }],
  },
  {
    lineNumber: 41,
    content: [{ type: "punctuation", content: "    });" }],
  },
  {
    lineNumber: 42,
    content: [],
  },
  {
    lineNumber: 43,
    content: [{ type: "comment", content: "    // Set the cookie - Next.js built-in, no dependencies" }],
  },
  {
    lineNumber: 44,
    content: [
      { type: "variable", content: "    cookies" },
      { type: "punctuation", content: "()." },
      { type: "function", content: "set" },
      { type: "punctuation", content: "({" },
    ],
  },
  {
    lineNumber: 45,
    content: [
      { type: "property", content: "      name" },
      { type: "punctuation", content: ": " },
      { type: "string", content: "'session'" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 46,
    content: [
      { type: "property", content: "      value" },
      { type: "punctuation", content: ": " },
      { type: "variable", content: "token" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 47,
    content: [
      { type: "property", content: "      httpOnly" },
      { type: "punctuation", content: ": " },
      { type: "boolean", content: "true" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 48,
    content: [
      { type: "property", content: "      secure" },
      { type: "punctuation", content: ": " },
      { type: "variable", content: "process" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "env" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "NODE_ENV" },
      { type: "operator", content: " === " },
      { type: "string", content: "'production'" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 49,
    content: [
      { type: "property", content: "      expires" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 50,
    content: [
      { type: "property", content: "      path" },
      { type: "punctuation", content: ": " },
      { type: "string", content: "'/'" },
    ],
  },
  {
    lineNumber: 51,
    content: [{ type: "punctuation", content: "    });" }],
  },
  {
    lineNumber: 52,
    content: [],
  },
  {
    lineNumber: 53,
    content: [
      { type: "keyword", content: "    return" },
      { type: "punctuation", content: " {" },
    ],
  },
  {
    lineNumber: 54,
    content: [
      { type: "property", content: "      success" },
      { type: "punctuation", content: ": " },
      { type: "boolean", content: "true" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 55,
    content: [
      { type: "property", content: "      user" },
      { type: "punctuation", content: ": {" },
    ],
  },
  {
    lineNumber: 56,
    content: [
      { type: "property", content: "        id" },
      { type: "punctuation", content: ": " },
      { type: "variable", content: "user" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "id" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 57,
    content: [
      { type: "property", content: "        email" },
      { type: "punctuation", content: ": " },
      { type: "variable", content: "user" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "email" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 58,
    content: [
      { type: "property", content: "        name" },
      { type: "punctuation", content: ": " },
      { type: "variable", content: "user" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "name" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 59,
    content: [
      { type: "property", content: "        role" },
      { type: "punctuation", content: ": " },
      { type: "variable", content: "user" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "role" },
    ],
  },
  {
    lineNumber: 60,
    content: [{ type: "punctuation", content: "      }" }],
  },
  {
    lineNumber: 61,
    content: [{ type: "punctuation", content: "    };" }],
  },
  {
    lineNumber: 62,
    content: [
      { type: "punctuation", content: "  } " },
      { type: "keyword", content: "catch" },
      { type: "punctuation", content: " (" },
      { type: "variable", content: "error" },
      { type: "punctuation", content: ") {" },
    ],
  },
  {
    lineNumber: 63,
    content: [
      { type: "function", content: "    console" },
      { type: "punctuation", content: "." },
      { type: "function", content: "error" },
      { type: "punctuation", content: "(" },
      { type: "string", content: "'Login error:'" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "error" },
      { type: "punctuation", content: ");" },
    ],
  },
  {
    lineNumber: 64,
    content: [
      { type: "keyword", content: "    return" },
      { type: "punctuation", content: " {" },
    ],
  },
  {
    lineNumber: 65,
    content: [
      { type: "property", content: "      success" },
      { type: "punctuation", content: ": " },
      { type: "boolean", content: "false" },
      { type: "punctuation", content: "," },
    ],
  },
  {
    lineNumber: 66,
    content: [
      { type: "property", content: "      error" },
      { type: "punctuation", content: ": " },
      { type: "variable", content: "error" },
      { type: "punctuation", content: " instanceof " },
      { type: "function", content: "Error " },
      { type: "punctuation", content: "? " },
      { type: "variable", content: "error" },
      { type: "punctuation", content: "." },
      { type: "variable", content: "message " },
      { type: "punctuation", content: ": " },
      { type: "string", content: "'An unknown error occurred'" },
    ],
  },
  {
    lineNumber: 67,
    content: [{ type: "punctuation", content: "    };" }],
  },
  {
    lineNumber: 68,
    content: [{ type: "punctuation", content: "  }" }],
  },
  {
    lineNumber: 69,
    content: [{ type: "punctuation", content: "}" }],
  },
  {
    lineNumber: 70,
    content: [],
  },
  {
    lineNumber: 71,
    content: [{ type: "comment", content: "// Helper functions to implement with your database of choice" }],
  },
  {
    lineNumber: 72,
    content: [
      { type: "keyword", content: "async function" },
      { type: "function", content: " findUserByEmail" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "email" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: "): " },
      { type: "keyword", content: "Promise" },
      { type: 'punctuation", content  content: "<' },
      { type: "variable", content: "User " },
      { type: "punctuation", content: "| " },
      { type: "keyword", content: "null" },
      { type: "punctuation", content: ">" },
    ],
  },
  {
    lineNumber: 73,
    content: [
      { type: "punctuation", content: "  " },
      { type: "comment", content: "// Implement with your database" },
    ],
  },
  {
    lineNumber: 74,
    content: [
      { type: "keyword", content: "  return null" },
      { type: "punctuation", content: ";" },
    ],
  },
  {
    lineNumber: 75,
    content: [{ type: "punctuation", content: "}" }],
  },
  {
    lineNumber: 76,
    content: [],
  },
  {
    lineNumber: 77,
    content: [
      { type: "keyword", content: "async function" },
      { type: "function", content: " createSession" },
      { type: "punctuation", content: "(" },
      { type: "variable", content: "session" },
      { type: "punctuation", content: ": { " },
      { type: "variable", content: "token" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "userId" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "string" },
      { type: "punctuation", content: ", " },
      { type: "variable", content: "expires" },
      { type: "punctuation", content: ": " },
      { type: "keyword", content: "Date " },
      { type: "punctuation", content: "}) {" },
    ],
  },
  {
    lineNumber: 78,
    content: [{ type: "comment", content: "  // Implement with your database" }],
  },
  {
    lineNumber: 79,
    content: [{ type: "punctuation", content: "}" }],
  },
]

// Function to get raw code for copying based on active tab
const getRawCode = (activeTab: string) => {
  const codeExample = activeTab === "createUser.ts" ? USER_CREATION_CODE : USER_LOGIN_CODE
  return codeExample.map((line) => line.content.map((token) => token.content).join("")).join("\n")
}

export function CodeBlock() {
  const [activeTab, setActiveTab] = useState("createUser.ts")
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
    const codeExample = activeTab === "createUser.ts" ? USER_CREATION_CODE : USER_LOGIN_CODE

    if (visibleLines < codeExample.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1)
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [visibleLines, activeTab])

  // Get the current code example based on active tab
  const currentCodeExample = activeTab === "createUser.ts" ? USER_CREATION_CODE : USER_LOGIN_CODE

  return (
    <motion.div
      className="w-full rounded-lg border border-[#1E1E1E] bg-[#0D0C0C] overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div
        className="flex items-center justify-between border-b border-[#1E1E1E] bg-[#0D0C0C] px-4 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex">
          {["createUser.ts", "loginUser.ts"].map((tab, index) => (
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

      {/* Fixed height code container to prevent layout shifts */}
      <div ref={codeContainerRef} className="h-[350px] overflow-hidden p-6">
        <pre className="text-sm selection:bg-[#0f0]/20 selection:text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentCodeExample.map((line, index) => (
                <motion.div
                  key={`${activeTab}-${line.lineNumber}`}
                  className="code-line"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{
                    opacity: index < visibleLines ? 1 : 0,
                    x: index < visibleLines ? 0 : -5,
                  }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <span className="line-number text-[#8C877D]">{String(line.lineNumber).padStart(2, "0")}</span>
                  {line.content.map((token, i) => (
                    <span key={i} className={`token ${token.type}`}>
                      {token.content}
                    </span>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </pre>
      </div>

      <div className="border-t border-[#1E1E1E] bg-[#0D0C0C] px-4 py-2"></div>
    </motion.div>
  )
}


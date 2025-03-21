"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Lock, Database, Terminal, Code, RefreshCw, Zap, Wrench } from "lucide-react"

export function SecurityShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })
  const [activeTab, setActiveTab] = useState<number>(0)

  // Auth independence principles data
  const independencePrinciples = [
    {
      title: "No More Broken Adapters",
      description:
        "Tired of waiting for library maintainers to update adapters for your database? Or finding out your auth provider silently dropped support for your database? Build exactly what you need without dependencies on third-party roadmaps or surprise deprecations.",
      icon: <Wrench className="h-5 w-5 text-[#4e9815]" />,
      code: `import { eq } from 'drizzle-orm';
import { db } from './db';
import { users from './schema';

// Your own custom database adapter - simple and direct
export async function getUserByEmail(email: string) {
 // Use Drizzle ORM directly - no adapters needed
 const result = await db.select()
   .from(users)
   .where(eq(users.email, email))
   .limit(1);
 
 return result[0] || null;
 
 // No more waiting for adapter updates
 // No more "We don't support that database anymore"
 // No more workarounds for missing features
}`,
    },
    {
      title: "Escape Deprecation Hell",
      description:
        "Auth libraries constantly change APIs, deprecate features, and force migrations. 'We've completely rewritten our library for the 5th time this year!' Own your code and never worry about breaking changes from dependencies again.",
      icon: <RefreshCw className="h-5 w-5 text-[#4e9815]" />,
      code: `// Before: Using a third-party library
import { getServerSession } from "some-auth-library"
// DEPRECATED: This will break in the next version!
// Please migrate to our new API...
// Oh, and we've changed our pricing model too!

// After: Your own implementation with Drizzle
import { eq } from 'drizzle-orm';
import { db } from './db';
import { sessions from './schema';

export async function getSession(request: Request) {
 const sessionId = request.cookies.get('session')?.value;
 if (!sessionId) return null;
 
 const result = await db.select({
   session: sessions,
   user: users
 })
 .from(sessions)
 .leftJoin(users, eq(sessions.userId, users.id))
 .where(eq(sessions.id, sessionId))
 .limit(1);
 
 return result[0] || null;
}`,
    },
    {
      title: "Own Your User Data",
      description:
        "Keep complete control of your user data. No vendor lock-in, no unexpected pricing changes, and no third-party data access. Your users, your data. No more 'Oops, we had a data breach but it's not our fault' emails to send to your users.",
      icon: <Database className="h-5 w-5 text-[#4e9815]" />,
      code: `import { db } from './db';
import { users from './schema';
import { hashPassword } from './auth-utils';

// Store user data directly in your database
export async function createUser({ 
 email, 
 password,
 profile 
}: UserInput) {
 const hashedPassword = await hashPassword(password);
 
 // Your database, your schema, your control
 const result = await db.insert(users).values({
   email,
   password: hashedPassword,
   role: 'user',
   // Add any fields you want without limitations
   metadata: {
     preferences: profile.preferences,
     theme: profile.theme,
     // No third-party access to your user data
     // No "upgrade to premium to access basic features"
   }
 }).returning();
 
 return result[0];
}`,
    },
    {
      title: "Simpler Than You Think",
      description:
        "Authentication isn't rocket science. With modern Web APIs and Next.js features, you can build secure auth with less code than you'd write to configure and customize third-party libraries. And you won't need a PhD to understand the docs.",
      icon: <Zap className="h-5 w-5 text-[#4e9815]" />,
      code: `// Complete JWT implementation in just a few lines
// No 400-page documentation to read
// No cryptic error messages
export async function createToken(payload: Record<string, any>, secret: string) {
 // 1. Create header and payload
 const header = { alg: 'HS256', typ: 'JWT' };
 const encodedHeader = btoa(JSON.stringify(header));
 const encodedPayload = btoa(JSON.stringify(payload));
 
 // 2. Sign with Web Crypto API
 const encoder = new TextEncoder();
 const data = encoder.encode(\`\${encodedHeader}.\${encodedPayload}\`);
 const key = await crypto.subtle.importKey(
   'raw', encoder.encode(secret), 
   { name: 'HMAC', hash: 'SHA-256' }, 
   false, ['sign']
 );
 const signature = await crypto.subtle.sign('HMAC', key, data);
 const encodedSignature = btoa(
   String.fromCharCode(...new Uint8Array(signature))
 );
 
 // 3. Return complete JWT
 return \`\${encodedHeader}.\${encodedPayload}.\${encodedSignature}\`;
}`,
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  // Terminal typing effect for code with syntax highlighting
  const TerminalCode = ({ code }: { code: string }) => {
    const [displayedCode, setDisplayedCode] = useState("")
    const codeRef = useRef<HTMLPreElement>(null)
    const isCodeInView = useInView(codeRef, { once: true })

    // Calculate the number of lines to determine a consistent height
    const lineCount = code.split("\n").length
    const minHeight = `${lineCount * 1.5}rem` // Approximate height based on line count

    useEffect(() => {
      if (isCodeInView) {
        // Speed up the animation by adding more characters at once
        const charsPerFrame = 10 // Increase this number to speed up the animation

        if (displayedCode.length < code.length) {
          const timeout = setTimeout(() => {
            const nextLength = Math.min(displayedCode.length + charsPerFrame, code.length)
            setDisplayedCode(code.substring(0, nextLength))
          }, 5)

          return () => clearTimeout(timeout)
        }
      }
    }, [isCodeInView, displayedCode, code])

    return (
      <div className="bg-[#0D0C0C] border border-[#1E1E1E] rounded-md p-6 mt-4 relative overflow-hidden shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-red-500/50"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500/50"></div>
          <div className="h-2 w-2 rounded-full bg-green-500/50"></div>
          <span className="text-xs text-[#8C877D] ml-2 font-mono">drizzle-auth.ts</span>
        </div>

        {/* Add a min-height to prevent layout shifts */}
        <pre
          ref={codeRef}
          className="text-sm font-mono whitespace-pre-wrap break-words"
          style={{ maxWidth: "100%", minHeight }}
        >
          {displayedCode.split("\n").map((line, i) => (
            <div key={i} className="leading-6">
              {line.split(" ").map((word, j) => {
                // Keywords
                if (/^(import|from|export|const|function|async|await|return)$/.test(word)) {
                  return (
                    <span key={j} className="text-[#cf9c2]">
                      {word}{" "}
                    </span>
                  )
                }
                // Drizzle functions
                if (/^(select|from|where|eq|limit)$/.test(word)) {
                  return (
                    <span key={j} className="text-[#4e9815]">
                      {word}{" "}
                    </span>
                  )
                }
                // Comments
                if (word.startsWith("//")) {
                  return (
                    <span key={j} className="text-[#8C877D]">
                      {word}{" "}
                    </span>
                  )
                }
                // Strings
                if (/(["'])(.*?)\1/.test(word)) {
                  return (
                    <span key={j} className="text-[#ff4800]">
                      {word}{" "}
                    </span>
                  )
                }
                // Variables and other text
                return (
                  <span key={j} className="text-[#f2f0ed]">
                    {word}{" "}
                  </span>
                )
              })}
            </div>
          ))}
          <span className="inline-block w-2 h-4 bg-[#4e9815] animate-pulse ml-0.5"></span>
        </pre>

        {/* Matrix-like background effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5 z-0">
          <div className="absolute inset-0 bg-[#0D0C0C]"></div>
          <div className="absolute inset-0 opacity-10 bg-gradient-to-b from-transparent to-[#4e9815]/20"></div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-24 bg-[#0D0C0C] relative overflow-hidden border-t border-[#1E1E1E]">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxRTFFMUUiIGZpbGwtb3BhY2l0eT0iMC4wNSIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMnYyNGgyVjE4em0tMTAgMGgydjI0aC0yVjE4ek0xOCAzNnYtMmgyNHYyaC0yNHptMC0xMGgyNHYyaC0yNHYtMnoiIHN0cm9rZT0iIzFFMUUxRSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')]"></div>

      {/* Green glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/3 bg-[#4e9815] opacity-5 blur-[100px] rounded-full"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <motion.div
          ref={containerRef}
          className="mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <div className="inline-flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-[#4e9815] mr-2" />
              <h2 className="text-3xl font-bold text-[#F2F0ED]">
                Break Free from Auth Libraries
              </h2>
            </div>
            <p className="text-[#8C877D] max-w-2xl mx-auto">
              Stop fighting with bad docs, missing adapters, and constant deprecations. Authentication isn't that hard.
              Take control and build exactly what you need.
            </p>
          </motion.div>

          {/* Tabs navigation */}
          <motion.div className="flex flex-wrap justify-center gap-3 mb-10" variants={itemVariants}>
            {independencePrinciples.map((principle, index) => (
              <motion.button
                key={index}
                className={`
        px-4 py-2.5 rounded-md text-sm flex items-center gap-2 transition-all duration-300
        relative overflow-hidden border 
        ${
          activeTab === index
            ? "bg-[#0D0C0C] text-[#F2F0ED] border-[#4e9815] shadow-[0_0_10px_rgba(78,152,21,0.3)]"
            : "text-[#8C877D] border-[#1E1E1E] hover:border-[#4e9815]/50"
        }
      `}
                onClick={() => setActiveTab(index)}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ y: 0 }}
              >
                {/* Matrix-inspired background effect on hover */}
                <div
                  className={`
          absolute inset-0 bg-gradient-to-b from-transparent to-[#4e9815]/10
          opacity-0 transition-opacity duration-300
          ${activeTab === index ? "opacity-100" : "group-hover:opacity-50"}
        `}
                />

                {/* Animated bottom border */}
                <div
                  className={`
          absolute bottom-0 left-0 h-[2px] bg-[#4e9815]
          transition-all duration-300 ease-out
          ${activeTab === index ? "w-full" : "w-0 group-hover:w-full"}
        `}
                />

                {/* Icon with glow effect */}
                <div
                  className={`
        relative z-10 transition-transform duration-200
        ${activeTab === index ? "scale-110" : ""}
      `}
                >
                  {principle.icon}
                </div>

                {/* Text with gradient effect when active */}
                <span
                  className={`
        relative z-10 font-medium
        ${activeTab === index ? "text-[#4e9815]" : ""}
      `}
                >
                  {principle.title}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Content area */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            variants={itemVariants}
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Left column: Description */}
            <div className="bg-[#0D0C0C] border border-[#1E1E1E] rounded-md p-6 h-full lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                {independencePrinciples[activeTab].icon}
                <h3 className="text-xl font-semibold text-[#F2F0ED]">{independencePrinciples[activeTab].title}</h3>
              </div>
              <p className="text-[#8C877D] mb-6">{independencePrinciples[activeTab].description}</p>

              <div className="flex items-center gap-2 text-xs text-[#4e9815] font-mono mt-auto">
                <Terminal className="h-3 w-3" />
                <span>$ cat auth-utils.ts &gt; your-project/auth-utils.ts</span>
              </div>
            </div>

            {/* Right column: Code example - wider than left column */}
            <div className="lg:col-span-2">
              <TerminalCode code={independencePrinciples[activeTab].code} />
            </div>
          </motion.div>

          {/* Comparison table */}
          <motion.div className="mt-20 border border-[#1E1E1E] rounded-md overflow-hidden" variants={itemVariants}>
            <div className="bg-[#1E1E1E]/30 p-4 border-b border-[#1E1E1E]">
              <h3 className="text-[#F2F0ED] font-semibold">Auth Libraries vs. Roll Your Own</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E1E1E]">
                    <th className="p-4 text-left text-[#8C877D]">Feature</th>
                    <th className="p-4 text-left text-[#8C877D]">Auth Libraries</th>
                    <th className="p-4 text-left text-[#8C877D]">Roll Your Own</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#1E1E1E]">
                    <td className="p-4 text-[#F2F0ED]">Documentation</td>
                    <td className="p-4 text-[#8C877D] relative group">
                      <span>400-page docs that still don't answer your question</span>
                      <div className="absolute left-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs bg-[#1E1E1E] border border-[#2D2D2D] rounded px-2 py-1 absolute bottom-full mb-2 w-64 text-[#F2F0ED] shadow-lg z-10">
                          <span className="font-bold">🧩 NextAuth:</span> "See our migration guide for the 5th time this
                          year!"
                          <div className="absolute top-full left-4 h-2 w-2 rotate-45 bg-[#1E1E1E] border-r border-b border-[#2D2D2D]"></div>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[#4e9815]">You wrote it, you understand it</td>
                  </tr>
                  <tr className="border-b border-[#1E1E1E]">
                    <td className="p-4 text-[#F2F0ED]">Database Support</td>
                    <td className="p-4 text-[#8C877D] relative group">
                      <span>"We've decided to drop support for your database"</span>
                      <div className="absolute left-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs bg-[#1E1E1E] border border-[#2D2D2D] rounded px-2 py-1 absolute bottom-full mb-2 w-64 text-[#F2F0ED] shadow-lg z-10">
                          <span className="font-bold">🔐 Auth0:</span> "We're sunsetting our MongoDB integration. Please
                          migrate to our preferred solution."
                          <div className="absolute top-full left-4 h-2 w-2 rotate-45 bg-[#1E1E1E] border-r border-b border-[#2D2D2D]"></div>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[#4e9815]">Works with any database you want</td>
                  </tr>
                  <tr className="border-b border-[#1E1E1E]">
                    <td className="p-4 text-[#F2F0ED]">API Stability</td>
                    <td className="p-4 text-[#8C877D] relative group">
                      <span>"We've completely rewritten our API again!"</span>
                      <div className="absolute left-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs bg-[#1E1E1E] border border-[#2D2D2D] rounded px-2 py-1 absolute bottom-full mb-2 w-64 text-[#F2F0ED] shadow-lg z-10">
                          <span className="font-bold">🔑 Clerk:</span> "Introducing our new v4 API with breaking changes
                          to everything you've implemented!"
                          <div className="absolute top-full left-4 h-2 w-2 rotate-45 bg-[#1E1E1E] border-r border-b border-[#2D2D2D]"></div>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[#4e9815]">Completely under your control</td>
                  </tr>
                  <tr className="border-b border-[#1E1E1E]">
                    <td className="p-4 text-[#F2F0ED]">Customization</td>
                    <td className="p-4 text-[#8C877D] relative group">
                      <span>"That's not supported in our free tier"</span>
                      <div className="absolute left-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs bg-[#1E1E1E] border border-[#2D2D2D] rounded px-2 py-1 absolute bottom-full mb-2 w-64 text-[#F2F0ED] shadow-lg z-10">
                          <span className="font-bold">🔒 Supabase Auth:</span> "Custom email templates? That'll be
                          $25/month please!"
                          <div className="absolute top-full left-4 h-2 w-2 rotate-45 bg-[#1E1E1E] border-r border-b border-[#2D2D2D]"></div>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[#4e9815]">Unlimited flexibility</td>
                  </tr>
                  <tr className="border-b border-[#1E1E1E]">
                    <td className="p-4 text-[#F2F0ED]">Pricing</td>
                    <td className="p-4 text-[#8C877D] relative group">
                      <span>"We've updated our pricing model again"</span>
                      <div className="absolute left-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs bg-[#1E1E1E] border border-[#2D2D2D] rounded px-2 py-1 absolute bottom-full mb-2 w-64 text-[#F2F0ED] shadow-lg z-10">
                          <span className="font-bold">💰 Firebase Auth:</span> "Free tier? Yes! Until you hit 50k users,
                          then $0.06/user/month. Surprise!"
                          <div className="absolute top-full left-4 h-2 w-2 rotate-45 bg-[#1E1E1E] border-r border-b border-[#2D2D2D]"></div>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[#4e9815]">Free forever, no surprise bills</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-[#F2F0ED]">Data Ownership</td>
                    <td className="p-4 text-[#8C877D] relative group">
                      <span>"We had a data breach but it's not our fault"</span>
                      <div className="absolute left-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs bg-[#1E1E1E] border border-[#2D2D2D] rounded px-2 py-1 absolute bottom-full mb-2 w-64 text-[#F2F0ED] shadow-lg z-10">
                          <span className="font-bold">🔓 Any Auth Provider:</span> "We take security seriously™ but our
                          third-party vendor had an oopsie!"
                          <div className="absolute top-full left-4 h-2 w-2 rotate-45 bg-[#1E1E1E] border-r border-b border-[#2D2D2D]"></div>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[#4e9815]">100% owned by you</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div className="mt-16 text-center" variants={itemVariants}>
            <a
              href="/docs/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4e9815]/10 hover:bg-[#4e9815]/20 border border-[#4e9815]/30 rounded-md text-[#F2F0ED] transition-all duration-200"
            >
              <Code className="h-4 w-4" />
              <span>Start Building Your Own Auth</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


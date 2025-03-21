import { TextScrambler } from "@/shared/components/effects"
import { Github, Twitter, Terminal, Code, Shield, ExternalLink } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-[#1E1E1E] bg-[#0D0C0C] overflow-hidden">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Logo and description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-5 w-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded bg-white opacity-80"></div>
                <div className="absolute inset-[2px] rounded bg-[#0D0C0C]"></div>
                <div className="absolute inset-[4px] rounded bg-[#4e9815] opacity-70"></div>
                <div className="absolute inset-[6px] rounded bg-[#0D0C0C]"></div>
                <div className="absolute inset-[8px] rounded bg-white opacity-90"></div>
              </div>
              <span className="bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent font-semibold">
                ROLL-YOUR-OWN-AUTH
              </span>
            </div>

            <p className="text-[#8C877D] text-sm mb-4">
              Because real developers don't need training wheels. Pure Next.js 15 authentication implementations.
            </p>

            <div className="flex items-center text-xs text-[#4e9815] font-mono">
              <span className="mr-1">$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="text-[#F2F0ED] font-mono mb-4 flex items-center">
              <Terminal className="h-4 w-4 mr-2 text-[#4e9815]" />
              <span>system.links</span>
            </h3>

            <ul className="space-y-2">
              {[
                { name: "Documentation", href: "/docs" },
                { name: "Changelog", href: "/changelog" },
                { name: "Examples", href: "/examples" },
                { name: "Community", href: "/community" },
                { name: "License", href: "/license" },
              ].map((link) => (
                <li key={link.name}>
                  <div className="flex items-center">
                    <Code className="h-3 w-3 mr-2 text-[#4e9815] opacity-70" />
                    <TextScrambler href={link.href} text={link.name} isActive={false} className="text-sm" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Security note */}
          <div>
            <h3 className="text-[#F2F0ED] font-mono mb-4 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-[#4e9815]" />
              <span>security.note</span>
            </h3>

            <p className="text-[#8C877D] text-sm mb-4">
              This project demonstrates authentication concepts for educational purposes. Always follow security best
              practices in production environments.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8C877D] hover:text-[#F2F0ED] transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8C877D] hover:text-[#F2F0ED] transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-12 pt-6 border-t border-[#1E1E1E] flex flex-col md:flex-row justify-between items-center">
          <div className="text-[#8C877D] text-xs mb-4 md:mb-0 font-mono">
            <span className="text-[#4e9815]">/* </span>© {currentYear} RollYourOwnAuth. All rights reserved.
            <span className="text-[#4e9815]"> */</span>
          </div>

          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8C877D] hover:text-[#F2F0ED] transition-colors duration-200 text-xs flex items-center"
          >
            Built with Next.js 15
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Terminal-inspired bottom border */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0D0C0C] via-[#4e9815] to-[#0D0C0C] opacity-30"></div>
    </footer>
  )
}


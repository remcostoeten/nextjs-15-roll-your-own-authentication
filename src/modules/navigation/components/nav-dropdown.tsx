'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { navAnimations } from '../animations/nav-animations'
import { navStyles } from '../styles/nav-styles'
import type { NavItem } from '../types'
import { TextScrambler } from "@/shared/components/effects"

type TProps = {
  item: NavItem
  isActive: boolean
  isOpen: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function NavDropdown({ item, isActive, isOpen, onMouseEnter, onMouseLeave }: TProps) {
  return (
    <div
      className={navStyles.item.wrapper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center gap-1">
        <TextScrambler
          href={item.href}
          text={item.name}
          isActive={isActive}
        />
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && item.items && (
          <motion.div
            className={navStyles.dropdown.container}
            variants={navAnimations.dropdown}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul className={navStyles.dropdown.list}>
              {item.items.map((subItem) => (
                <li key={subItem.name} className={navStyles.dropdown.item}>
                  <TextScrambler
                    href={subItem.href}
                    text={subItem.name}
                    isActive={isActive}
                  />
                </li>
              ))}
            </ul>

            <div className={navStyles.dropdown.footer}>
              <span className="text-xs font-mono">Press / to search</span>
              <div className={navStyles.dropdown.pulse} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
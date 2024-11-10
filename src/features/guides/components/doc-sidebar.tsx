'use client'

import { cn } from '@/lib/utils'
import { ChevronRight, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger, Sheet, SheetContent, SheetTrigger } from 'ui'

type DocSection = {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  subsections?: DocSection[]
}

type DocSidebarProps = {
  sections: DocSection[]
  className?: string
  collapsible?: boolean
  defaultOpenSections?: string[]
  onSectionChange?: (sectionId: string) => void
}

export default function DocSidebar({
  sections,
  className,
  collapsible = true,
  defaultOpenSections = [],
  onSectionChange
}: DocSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(defaultOpenSections))
  const [lastActivated, setLastActivated] = useState<{id: string, time: number}>()
  const DEBOUNCE_TIME = 2000 // 2 seconds between activations

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now()
        let newActiveSection: string | null = null

        // Sort entries by their position from top to bottom
        const sortedEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            const rectA = a.boundingClientRect
            const rectB = b.boundingClientRect
            return rectA.top - rectB.top
          })

        // Take the first visible section
        if (sortedEntries.length > 0) {
          const entry = sortedEntries[0]
          const shouldActivate = !lastActivated || 
            lastActivated.id !== entry.target.id || 
            (now - lastActivated.time) > DEBOUNCE_TIME

          if (shouldActivate) {
            newActiveSection = entry.target.id
            setLastActivated({ id: entry.target.id, time: now })
          }
        }

        // If no section is visible and we're at the top, activate first section
        if (!newActiveSection && window.scrollY < 100) {
          newActiveSection = sections[0]?.id
        }

        if (newActiveSection) {
          setActiveSection(newActiveSection)
          onSectionChange?.(newActiveSection)
        }
      },
      {
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0, 0.1]
      }
    )

    // Helper function to get all section IDs
    const getAllSectionIds = (sections: DocSection[]): string[] => {
      return sections.reduce((acc: string[], section) => {
        acc.push(section.id)
        if (section.subsections?.length) {
          acc.push(...getAllSectionIds(section.subsections))
        }
        return acc
      }, [])
    }

    // Observe all sections
    const allSectionIds = getAllSectionIds(sections)
    allSectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [sections, lastActivated, onSectionChange])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
      
      // Open parent sections if needed
      const newOpenSections = new Set(openSections)
      sections.forEach((section) => {
        if (section.id === sectionId || 
          section.subsections?.some(sub => sub.id === sectionId)) {
          newOpenSections.add(section.id)
        }
      })
      setOpenSections(newOpenSections)
      onSectionChange?.(sectionId)
    }
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const renderSection = (section: DocSection, depth = 0) => {
    const hasSubsections = section.subsections?.length > 0
    const isOpen = openSections.has(section.id)
    const isActive = activeSection === section.id

    const activeStyles = isActive ? {
      background: 'bg-neutral-800/75',
      border: 'border-l-2 border-purple-500',
      text: 'text-white font-medium',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]'
    } : {
      background: '',
      border: 'border-l-2 border-transparent',
      text: 'text-neutral-400',
      shadow: ''
    }

    if (hasSubsections && collapsible) {
      return (
        <Collapsible
          key={section.id}
          open={isOpen}
          onOpenChange={() => toggleSection(section.id)}
        >
          <CollapsibleTrigger className="w-full">
            <div
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm rounded-md',
                'hover:bg-neutral-800/50',
                'transition-all duration-300 ease-in-out my-0.5',
                activeStyles.background,
                activeStyles.border,
                activeStyles.text,
                activeStyles.shadow
              )}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform duration-300',
                  isOpen && 'transform rotate-90'
                )}
              />
              {section.icon && (
                <section.icon className="h-4 w-4" />
              )}
              {section.label}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-4 border-l border-neutral-800 my-1">
              {section.subsections.map((subsection) =>
                renderSection(subsection, depth + 1)
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <button
        key={section.id}
        onClick={() => scrollToSection(section.id)}
        className={cn(
          'w-full flex items-center gap-2 text-left px-4 py-3 text-sm rounded-md',
          'hover:bg-neutral-800/50',
          'transition-all duration-300 ease-in-out my-0.5',
          activeStyles.background,
          activeStyles.border,
          activeStyles.text,
          activeStyles.shadow,
          depth > 0 && 'text-sm'
        )}
      >
        {section.icon && <section.icon className="h-4 w-4" />}
        {section.label}
      </button>
    )
  }

  const SidebarContent = () => (
    <nav
      className={cn(
        'max-h-[calc(100vh-5rem)] overflow-y-auto',
        'scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent',
        className
      )}
    >
      <ul className="space-y-1 py-4">
        {sections.map((section) => (
          <li key={section.id}>{renderSection(section)}</li>
        ))}
      </ul>
    </nav>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-20">
        <SidebarContent />
      </div>

      {/* Mobile Sheet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-3 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="h-full bg-neutral-900/95 backdrop-blur-sm">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
} 

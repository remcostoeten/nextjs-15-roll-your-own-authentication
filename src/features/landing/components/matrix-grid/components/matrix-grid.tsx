'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import styles from '../styles/matrix-grid.module.css'
import MatrixGridLayout from './matrix-grid-layout'
import { useMatrixRain } from '../hooks/use-matrix-rain'
import { isMatrixGridAnimationEnabled } from '@/core/config/feature-flags'
import { matrixGridContent } from '../config/data'
import { MATRIX_GRID_CONFIG } from '../config/matrix-config'

const Arrow = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.arrow}>
    <path d="M1.057 1.011v11.859h17.21" stroke="currentColor" strokeLinecap="square" strokeLinejoin="bevel" />
    <path d="m13.467 7.354 5.516 5.516" stroke="currentColor" strokeLinecap="square" strokeLinejoin="bevel" />
    <path d="m18.983 12.87-5.516 5.516" stroke="currentColor" strokeLinecap="square" strokeLinejoin="bevel" />
  </svg>
)

const MotionLink = motion(Link)

const MatrixRain = () => {
  const canvasRef = useMatrixRain(true)

  return (
    <div className={styles.matrixRain} aria-hidden="true">
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default function MatrixGrid() {
  const [mounted, setMounted] = useState(false)
  const animationsEnabled = isMatrixGridAnimationEnabled('grid')
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const xPercent = (x / rect.width) * 100
      const yPercent = (y / rect.height) * 100
      
      card.style.setProperty('--mouse-x', `${xPercent}%`)
      card.style.setProperty('--mouse-y', `${yPercent}%`)
    }

    const handleMouseEnter = (card: HTMLElement) => {
      card.style.setProperty('--spotlight-color', MATRIX_GRID_CONFIG.SPOTLIGHT.COLOR)
      card.style.setProperty('--spotlight-strength', MATRIX_GRID_CONFIG.SPOTLIGHT.STRENGTH.toString())
      card.style.setProperty('--spotlight-radius', `${MATRIX_GRID_CONFIG.SPOTLIGHT.RADIUS}%`)
    }

    cardRefs.current.forEach(card => {
      if (card) {
        card.addEventListener('mousemove', (e) => handleMouseMove(e, card))
        card.addEventListener('mouseenter', () => handleMouseEnter(card))
      }
    })

    return () => {
      cardRefs.current.forEach(card => {
        if (card) {
          card.removeEventListener('mousemove', (e) => handleMouseMove(e, card))
          card.removeEventListener('mouseenter', () => handleMouseEnter(card))
        }
      })
    }
  }, [mounted])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }

  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <MatrixGridLayout>
      <motion.div 
        className={styles.container}
        initial="hidden"
        animate="visible"
        variants={MATRIX_GRID_CONFIG.ANIMATIONS.STAGGERED_ENTRANCE ? containerVariants : {}}
      >
        <div className={styles.wrapper}>
          <motion.header className={styles.header} variants={animationsEnabled ? itemVariants : {}}>
            <motion.h2 
              className={styles.title}
              variants={animationsEnabled ? textVariants : {}}
            >
              {matrixGridContent.header.title}
            </motion.h2>
            <motion.p 
              className={styles.subtitle}
              variants={animationsEnabled ? textVariants : {}}
            >
              {matrixGridContent.header.subtitle}
            </motion.p>
          </motion.header>

          <AnimatePresence>
            {mounted && (
              <motion.div 
                className={styles.grid}
                variants={animationsEnabled ? containerVariants : {}}
              >
                {matrixGridContent.tools.map((tool, index) => (
                  <MotionLink
                    key={tool.title}
                    href={tool.href}
                    className={`${styles.card} ${tool.isLarge ? styles.platformCard : ''}`}
                    variants={animationsEnabled ? itemVariants : {}}
                    ref={el => cardRefs.current[index] = el}
                    {...(tool.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <MatrixRain />
                    <div className={styles.cardSpotlight}></div>
                    <motion.div className={`${styles.cardContent} ${styles.cardContentWrapper}`} variants={animationsEnabled ? textVariants : {}}>
                      <div>
                        <motion.div className={styles.cardHeader} variants={animationsEnabled ? textVariants : {}}>
                          <motion.h3 className={styles.cardTitle} variants={animationsEnabled ? textVariants : {}}>{tool.title}</motion.h3>
                          {tool.tag && (
                            <motion.div 
                              className={`${styles.tag} ${tool.tag.type === 'new' ? styles.tagNew : styles.tagSoon}`}
                              variants={animationsEnabled ? textVariants : {}}
                            >
                              {tool.tag.text}
                            </motion.div>
                          )}
                        </motion.div>
                        <motion.div className={styles.cardDescription} variants={animationsEnabled ? textVariants : {}}>{tool.description}</motion.div>
                      </div>
                      {!tool.isLarge && <motion.div variants={animationsEnabled ? textVariants : {}}><Arrow /></motion.div>}
                    </motion.div>
                    {tool.isLarge && (
                      <>
                        <motion.div className={styles.skeletonLoader} aria-hidden="true" variants={animationsEnabled ? itemVariants : {}} />
                        <motion.div className={styles.platformGradient} variants={animationsEnabled ? itemVariants : {}} />
                        <motion.div className={styles.verticalFadetop} variants={animationsEnabled ? itemVariants : {}} />
                      </>
                    )}
                    <motion.div className={styles.horizontalBorder} variants={animationsEnabled ? itemVariants : {}} />
                  </MotionLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </MatrixGridLayout>
  )
}


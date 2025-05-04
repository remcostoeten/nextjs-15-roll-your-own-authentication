'use client';

/* Todo:
- Fix mobile menu
*/

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { For } from '@/components/ui/core/for';
import {
  CONTAINER_VARIANTS,
  DEMO_ITEMS,
  ITEM_VARIANTS,
  MATRIX_BACKGROUND,
  navItems,
} from '../../constants';
import { DemoDropdown } from './demo-dropdown';
import { LoginButton } from './login-button';
import { Logo } from './logo';
import { MobileMenu } from './mobile-nav';
import { GithubLink, NavItem } from './nav-item';




export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrolled && window.scrollY > 20) {
      setScrolled(true);
    } else if (scrolled && window.scrollY <= 20) {
      setScrolled(false);
    }
  }, [scrolled]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const throttleScroll = () => {
      let waiting = false;
      return () => {
        if (!waiting) {
          waiting = true;
          window.requestAnimationFrame(() => {
            handleScroll();
            waiting = false;
          });
        }
      };
    };

    const throttledHandleScroll = throttleScroll();
    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [handleScroll]);



  const headerClasses = `fixed top-0 z-50 w-full h-16 border-b transition-all duration-300 overflow-visible ${
    scrolled
      ? 'border-[#4e9815]/30 bg-[#0D0C0C]/90 backdrop-blur-md'
      : 'border-[#1E1E1E] bg-[#0D0C0C]/80 backdrop-blur-sm'
  }`;

  const matrixBgStyles = {
    ...MATRIX_BACKGROUND,
    animation: 'matrix-rain 20s linear infinite',
  };

  return (
    <motion.header
      ref={headerRef}
      className={headerClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div
        className={`absolute container inset-0 overflow-hidden transition-opacity duration-500 ${scrolled ? 'opacity-5' : 'opacity-0'}`}
        style={matrixBgStyles}
      />

      <div className="container flex h-16 items-center justify-between overflow-visible px-6">
        <Logo />

        <motion.nav
          className="hidden items-center gap-8 overflow-visible md:flex"
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          <nav className="flex items-center space-x-6">
            <For
              each={navItems}
               keyExtractor={(item) => item.name}
              memoizeChildren={true}
              as="div"  
              className='flex items-center space-x-6'            >
              {(item) => (
                <NavItem
                  name={item.name}
                  href={item.href}
                  isActive={pathname === item.href}
                />
              )}
            </For>
          </nav>

          <motion.div
            variants={ITEM_VARIANTS}
            className="flex items-center justify-center"
          >
            <DemoDropdown demoItems={DEMO_ITEMS} />
          </motion.div>

          <motion.div variants={ITEM_VARIANTS}>
            <GithubLink />
          </motion.div>

          <motion.div variants={ITEM_VARIANTS}>
            <LoginButton />
          </motion.div>
        </motion.nav>

        <div className="md:hidden">
          <motion.button
            onClick={toggleMenu}
            className="relative p-2 text-[#8C877D] transition-colors hover:text-white"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>

            <span
              className={`absolute inset-0 rounded-full bg-[#4e9815] blur transition-opacity duration-300 ${isMenuOpen ? 'opacity-20' : 'opacity-0'}`}
            ></span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            navItems={navItems}
            demoItems={DEMO_ITEMS}
            pathname={pathname}
            toggleMenu={toggleMenu}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}

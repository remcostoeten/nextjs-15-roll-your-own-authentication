/**.
 * @module homepage
 * @description This module provides constants, animations and configuration settings
 **/

export const navItems = [
  { name: '_home', href: '/' },
  { name: '_Pdashboard', href: '/dashboard' },
];

/**
 * Motion variants for staggered container animations
 */
export const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }
  
  /**
   * Motion variants for individual items within a container
   */
  export const ITEM_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }
  
  /**
   * Motion variants for mobile menu slide-in/out animation
   */
  export const MOBILE_MENU_VARIANTS = {
    hidden: { opacity: 0, x: '100%' },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
      },
    },
  }
  
  // src/core/constants/ui-elements.ts
  
  /**
   * Demo menu items configuration
   */
  export const DEMO_ITEMS = [
    {
      name: 'JWT Authentication',
      href: '/demos/jwt',
      description: 'Implement secure JWT tokens without dependencies',
    },
    {
      name: 'OAuth Integration',
      href: '/demos/oauth',
      description: 'Build your own OAuth provider connections',
    },
    {
      name: 'Password Hashing',
      href: '/demos/password',
      description: 'Secure password storage with PBKDF2',
    },
    {
      name: 'Feature Flags',
      href: '/demos/feature-flags',
      description: 'Build your own feature flag system',
      soon: true,
    },
    {
      name: 'Role-Based Access',
      href: '/demos/rbac',
      description: 'Implement RBAC with protected routes',
      soon: true,
    },
  ]
  
  /**
   * Matrix background pattern styles for decorative elements
   */
  export const MATRIX_BACKGROUND = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='matrix' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ctext x='0' y='15' fontFamily='monospace' fontSize='15' fill='%230f0' opacity='0.3'%3E0%3C/text%3E%3Ctext x='10' y='10' fontFamily='monospace' fontSize='10' fill='%230f0' opacity='0.3'%3E1%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23matrix)'/%3E%3C/svg%3E\")",
    backgroundSize: '50px 50px',
  }
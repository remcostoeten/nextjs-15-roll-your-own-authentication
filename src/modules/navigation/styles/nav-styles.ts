export const navStyles = {
  container: 'hidden md:flex items-center gap-8',
  list: 'flex items-center gap-4',
  item: {
    base: 'relative group',
    wrapper: 'flex items-center justify-center relative hover:text-[#4e9815] transition-colors duration-300',
    icon: 'hidden lg:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300',
  },
  actions: 'flex items-center gap-4',
  githubLink: 'hover:text-[#4e9815] transition-colors duration-200',
  dropdown: {
    container: 'absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-sm border border-[#4e9815]/20 rounded-lg shadow-lg overflow-hidden',
    list: 'py-2',
    item: 'px-4 py-2 hover:bg-[#4e9815]/10 transition-colors duration-200',
    footer: 'px-4 py-2 border-t border-[#4e9815]/20 bg-muted/50',
    pulse: 'absolute bottom-2 right-2 w-2 h-2 bg-[#4e9815] rounded-full animate-pulse'
  },
  github: {
    button: 'relative overflow-hidden rounded-full p-2 hover:bg-[#4e9815]/10 transition-colors duration-200 group',
    highlight: 'absolute inset-0 bg-[#4e9815]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
    icon: 'w-5 h-5 group-hover:text-[#4e9815] transition-colors duration-200'
  },
  login: {
    button: 'relative overflow-hidden px-4 py-2 rounded-lg border border-[#4e9815]/30 bg-[#4e9815]/10 hover:bg-[#4e9815]/20 transition-all duration-300 group',
    text: 'font-mono text-sm text-[#4e9815] group-hover:text-white transition-colors duration-300',
    glow: 'absolute inset-0 -z-10 bg-gradient-to-r from-[#4e9815]/0 via-[#4e9815]/30 to-[#4e9815]/0 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300'
  }
} as const 
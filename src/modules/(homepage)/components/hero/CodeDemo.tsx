import { motion } from 'framer-motion'
import { CodeBlock } from '@/shared/components/ui/code-block'
import { USER_CREATION_CODE, USER_LOGIN_CODE } from './data/syntax-highlighting'
import { cn } from '@/lib/utils'

interface CodeDemoProps {
  className?: string
}

export const CodeDemo: React.FC<CodeDemoProps> = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CodeBlock
          code={USER_CREATION_CODE}
          title="User Creation"
          language="typescript"
          className="h-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <CodeBlock
          code={USER_LOGIN_CODE}
          title="User Login"
          language="typescript"
          className="h-full"
        />
      </motion.div>
    </div>
  )
} 
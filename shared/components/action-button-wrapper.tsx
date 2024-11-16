'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'auth';

type ActionButtonProps = {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  variant?: ButtonVariant;
  formState?: 'success' | 'error' | null;
};

/**
 * A button component that handles loading states and animations
 * @author Remco Stoeten
 */
export default function ActionButton({ 
  text = "Submit",
  type = "button",
  isLoading = false,
  className = "",
  disabled = false,
  onClick,
  variant = "default",
  formState = null
}: ActionButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Update status based on external loading state and form state
  useEffect(() => {
    if (isLoading) {
      setStatus('loading');
    } else if (formState === 'success') {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } else if (formState === 'error') {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    } else if (!isLoading && status === 'loading') {
      setStatus('idle');
    }
  }, [isLoading, formState]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (status !== 'idle' || !onClick) return;
    
    try {
      setStatus('loading');
      await onClick(event);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const variantStyles: Record<ButtonVariant, string> = {
    default: "bg-blue-500 hover:bg-blue-600 text-white",
    destructive: "bg-red-500 hover:bg-red-600 text-white",
    outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700",
    auth: "w-full bg-primary hover:bg-primary/90 text-white"
  };

  const baseStyles = "relative flex items-center justify-center w-36 h-10 rounded-lg transition-all duration-300 overflow-hidden";
  
  const buttonStyles = cn(
    baseStyles,
    variantStyles[variant],
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  );

  return (
    <button
      type={type}
      disabled={disabled || ['loading', 'success', 'error'].includes(status)}
      onClick={handleClick}
      className={buttonStyles}
    >
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -15,
              transition: { duration: 0.3, type: 'spring' },
            }}
          >
            {text}
          </motion.span>
        )}

        {status === 'loading' && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.3 } }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Loader2 className="animate-spin" size={20} />
          </motion.span>
        )}

        {['success', 'error'].includes(status) && (
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 15, scale: 0 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { delay: 0.1, duration: 0.4 },
            }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.3 } }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {status === 'success' && <CircleCheck size={20} />}
            {status === 'error' && <CircleX size={20} />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

'use client';

import { CustomCheckbox } from '@/shared/components/ui/custom-checkbox';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Clock, Key, Settings2, Shield, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { useDevConfig } from '../hooks/use-dev-config';

type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

type Metric = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function AuthStateIndicator({ status }: { status: AuthStatus }) {
  const colors = {
    authenticated: 'bg-green-500',
    unauthenticated: 'bg-red-500',
    loading: 'bg-yellow-500 animate-pulse'
  } as const;

  return (
    <div className="flex items-center space-x-2">
      <div className={`h-2 w-2 rounded-full ${colors[status]}`} />
      <span className="text-sm capitalize text-white">{status}</span>
    </div>
  );
}

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const { skipPasswordValidation, togglePasswordValidation } = useDevConfig();
  const auth = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (process.env.NODE_ENV === 'production') return null;

  const metrics = auth.status === 'authenticated' ? ([
    {
      icon: User,
      label: 'User',
      value: auth.user.email,
    },
    {
      icon: Shield,
      label: 'Role',
      value: auth.user.role,
    },
    {
      icon: Key,
      label: 'ID',
      value: auth.user.id.slice(0, 8) + '...',
    },
    // Only show account age if createdAt exists
    'createdAt' in auth.user && {
      icon: Clock,
      label: 'Account Age',
      value: formatDistanceToNow(new Date(auth.user.createdAt as string), { addSuffix: true }),
    },
  ].filter((item): item is Metric => Boolean(item))) : [];

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={containerRef}>
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="relative"
      >
        <motion.button
          className="dev-tools-button group relative flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(11,11,11)] text-white shadow-lg hover:bg-[rgb(19,19,19)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-[rgb(11,11,11)]"
            initial={false}
            variants={{
              open: { opacity: 1 },
              closed: { opacity: 0 },
            }}
          />
          <motion.div
            className="relative z-10"
            variants={{
              open: { rotate: 180, scale: 1 },
              closed: { rotate: 0, scale: 1 },
            }}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Settings2 className="h-5 w-5" />
            )}
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="dev-tools-panel absolute bottom-full right-0 mb-3 origin-bottom-right"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                duration: 0.15,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <div className="dev-tools-content w-[340px] rounded-lg border border-[rgb(19,19,19)] bg-[rgb(11,11,11)] p-4 shadow-2xl">
                <div className="space-y-6">
                  {/* Auth State Section */}
                  <div className="auth-state-section space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-white">Authentication State</h3>
                      <AuthStateIndicator status={auth.status as AuthStatus} />
                    </div>
                    {auth.status === 'authenticated' && (
                      <div className="metrics-container mt-3 space-y-3 rounded-md bg-[rgb(19,19,19)] p-3">
                        {metrics.map((metric, i) => (
                          <div key={i} className="metric-item flex items-center space-x-3 text-sm">
                            <metric.icon className="metric-icon h-4 w-4 text-gray-400" />
                            <span className="metric-label text-gray-400">{metric.label}:</span>
                            <span className="metric-value font-medium text-white">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dev Settings Section */}
                  <div className="dev-settings-section space-y-2 border-t border-[rgb(19,19,19)] pt-4">
                    <h3 className="text-base font-medium text-white">Development Settings</h3>
                    <div className="setting-item flex items-center justify-between">
                      <label className="text-sm font-medium text-white">Skip Password Validation</label>
                      <CustomCheckbox
                        checked={skipPasswordValidation}
                        onChange={() => togglePasswordValidation()}
                        variant="rounded"
                        size="sm"
                        color="#866efb"
                      />
                    </div>
                    <div className="setting-description text-xs text-gray-400">
                      {skipPasswordValidation ? 'Password validation is disabled' : 'Password validation is enabled'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

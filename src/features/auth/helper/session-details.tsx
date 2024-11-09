'use client'

import { type Session, type User } from '@/db/schema'

type SessionDetailsProps = {
  user: User
  lastSession: Session
  userSessions: Session[]
  statusColor: string
}

export default function SessionDetails({ 
  user, 
  lastSession, 
  userSessions, 
  statusColor 
}: SessionDetailsProps) {
  const roleLabel = user.role === 'admin' ? 'Admin' : 'User'

  return (
    <div className="fixed bottom-4 right-4 group z-50">
      {/* Collapsed State (Default) */}
      <div className="p-2 bg-black/50 backdrop-blur-lg border border-white/10 rounded-full group-hover:opacity-0 group-hover:scale-90 transition-all duration-200">
        <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`} />
      </div>

      {/* Expanded State (On Hover) */}
      <div className="absolute bottom-0 right-0 p-4 bg-black/50 backdrop-blur-lg border border-white/10 rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 min-w-[300px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
          <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse group-hover:animate-none`} />
          <span className="text-white font-medium">Authenticated</span>
        </div>

        {/* User Info */}
        <div className="space-y-3">
          {/* Role Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs ${
              user.role === 'admin'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {roleLabel}
            </span>
            <span className="text-neutral-400">{user.email}</span>
          </div>

          {/* User ID */}
          <div className="text-xs">
            <span className="text-neutral-500">ID: </span>
            <span className="font-mono text-neutral-400">{user.userId}</span>
          </div>

          {/* Session Info */}
          {lastSession && (
            <>
              <div className="text-xs">
                <span className="text-neutral-500">Last Active: </span>
                <span className="text-neutral-400">
                  {new Date(lastSession.lastUsed).toLocaleString()}
                </span>
              </div>

              {lastSession.ipAddress && (
                <div className="text-xs">
                  <span className="text-neutral-500">IP: </span>
                  <span className="font-mono text-neutral-400">
                    {lastSession.ipAddress}
                  </span>
                </div>
              )}

              {lastSession.userAgent && (
                <div className="text-xs">
                  <span className="text-neutral-500">Browser: </span>
                  <span className="text-neutral-400">
                    {lastSession.userAgent.split('/')[0]}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Session Expiry */}
          {lastSession?.expiresAt && (
            <div className="text-xs">
              <span className="text-neutral-500">Expires: </span>
              <span className="text-neutral-400">
                {new Date(lastSession.expiresAt).toLocaleString()}
              </span>
            </div>
          )}

          {/* Active Sessions Count */}
          <div className="text-xs">
            <span className="text-neutral-500">Active Sessions: </span>
            <span className="text-neutral-400">{userSessions.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 

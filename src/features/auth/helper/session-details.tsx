'use client'

type Session = {
    id: string;
    expiresAt?: string;
    lastUsed?: string;
    userAgent?: string;
}

type SessionDetailsProps = {
    user: {
        userId: string;
        email: string;
        role: string;
    };
    lastSession: {
        expiresAt?: string;
    } | null;
    userSessions: Session[];
    statusColor: string;
}

export function SessionDetails({ 
    user, 
    lastSession, 
    userSessions, 
    statusColor 
}: SessionDetailsProps) {
    return (
        <div className="fixed z-50 bottom-4 right-4 p-4 bg-black/50 backdrop-blur-lg border border-white/10 rounded-xl">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                <div>
                    <div className="text-sm text-neutral-200">{user.email}</div>
                    <div className="text-xs text-neutral-400">{user.role}</div>

                    {lastSession?.expiresAt && (
                        <div className="text-xs">
                            <span className="text-neutral-500">Expires: </span>
                            <span className="text-neutral-400">
                                {new Date(lastSession.expiresAt).toLocaleString()}
                            </span>
                        </div>
                    )}

                    <div className="text-xs">
                        <span className="text-neutral-500">Active Sessions: </span>
                        <span className="text-neutral-400">{userSessions.length}</span>
                    </div>
                </div>
            </div>
        </div>
    )
} 

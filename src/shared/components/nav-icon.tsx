import { LucideIcon } from 'lucide-react'

interface NavIconProps {
    Icon: LucideIcon
    className?: string
}

export function NavIcon({ Icon, className = "h-4 w-4" }: NavIconProps) {
    return <Icon className={className} />
} 
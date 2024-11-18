export default function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground align-middle shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
            {children}
        </kbd>
    )
}

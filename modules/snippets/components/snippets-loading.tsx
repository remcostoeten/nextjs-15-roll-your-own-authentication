export function SnippetsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  )
}


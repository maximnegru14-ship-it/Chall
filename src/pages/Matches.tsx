import MatchCard from "@/components/MatchCard"
import { useMatches } from "@/hooks/useData"
import { Button } from "@/components/ui/button"

export default function Matches() {
  const { matches, loading, error, reload } = useMatches()

  return (
    <div>
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <h1 className="text-xl font-bold tracking-tight">Matches</h1>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Loading matches...
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={reload}>Retry</Button>
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
          <p className="text-4xl">💔</p>
          <p className="font-semibold">No matches yet</p>
          <p className="text-sm">Go to Discover to find people!</p>
        </div>
      )}

      <div className="divide-y">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}

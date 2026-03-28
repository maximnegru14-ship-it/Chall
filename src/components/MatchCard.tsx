import { useNavigate } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatTime } from "@/lib/utils"
import type { Match } from "@/lib/api"

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate()
  const initials = match.user.name?.slice(0, 2).toUpperCase() ?? "??"

  return (
    <button
      onClick={() => navigate(`/chat/${match.user.id}`)}
      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-accent transition-colors text-left"
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={match.user.photo} alt={match.user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {match.is_new && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-pink-500 rounded-full border-2 border-background" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">{match.user.name}</p>
          {match.last_message_at && (
            <span className="text-xs text-muted-foreground">{formatTime(match.last_message_at)}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {match.last_message ?? <Badge variant="secondary" className="text-xs">New match! 🎉</Badge>}
        </p>
      </div>
    </button>
  )
}

import { Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTime } from "@/lib/utils"
import type { Post } from "@/lib/api"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const user = post.user
  const initials = user?.name?.slice(0, 2).toUpperCase() ?? "??"

  return (
    <article className="border-b bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.photo} alt={user?.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-semibold">{user?.name ?? "Unknown"}</p>
        </div>
        <span className="text-xs text-muted-foreground">{formatTime(post.created_at)}</span>
      </div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full aspect-square object-cover"
        />
      )}

      {/* Content */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Heart className="w-4 h-4" />
          <span>{post.likes} likes</span>
        </div>
        {post.content && (
          <p className="text-sm">
            <span className="font-semibold mr-1">{user?.name}</span>
            {post.content}
          </p>
        )}
      </div>
    </article>
  )
}

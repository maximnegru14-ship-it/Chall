import { LogOut, Grid3X3 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/useData"
import { useAuth } from "@/hooks/useAuth"

export default function Profile() {
  const { profile, posts, loading } = useProfile()
  const { logout } = useAuth()
  const initials = profile?.name?.slice(0, 2).toUpperCase() ?? "??"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading profile...
      </div>
    )
  }

  return (
    <div>
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Profile</h1>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      {/* Profile info */}
      <div className="px-4 py-6 flex gap-4 items-start border-b">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile?.photo} alt={profile?.name} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <h2 className="font-bold text-lg">{profile?.name ?? "You"}</h2>
          {profile?.age && <p className="text-sm text-muted-foreground">Age {profile.age}</p>}
          {profile?.bio && <p className="text-sm mt-1">{profile.bio}</p>}
          {profile?.created_at && (
            <p className="text-xs text-muted-foreground">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Posts grid */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground">
          <Grid3X3 className="w-4 h-4" />
          Posts
        </div>
        {posts.length === 0 ? (
          <p className="text-center py-10 text-sm text-muted-foreground">No posts yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {posts.map(post => (
              <div key={post.id} className="aspect-square bg-muted overflow-hidden">
                {post.image ? (
                  <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-purple-100 to-pink-100">
                    <p className="text-xs text-center text-gray-600 line-clamp-3">{post.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

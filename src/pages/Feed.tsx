import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import PostCard from "@/components/PostCard"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useFeed } from "@/hooks/useData"
import { createPost } from "@/lib/api"

export default function Feed() {
  const { posts, loading, error, reload } = useFeed()
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [posting, setPosting] = useState(false)

  const handlePost = async () => {
    if (!content.trim()) return
    setPosting(true)
    try {
      await createPost(content.trim())
      toast.success("Post created!")
      setContent("")
      setOpen(false)
      reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create post")
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <h1 className="text-xl font-bold tracking-tight">Feed</h1>
      </header>

      {/* Posts */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Loading feed...
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={reload}>Retry</Button>
        </div>
      )}
      {!loading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
          <p>No posts yet.</p>
          <p className="text-sm">Match with people to see their posts!</p>
        </div>
      )}
      {posts.map(post => <PostCard key={post.id} post={post} />)}

      {/* New Post Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-20 right-4 z-20 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              placeholder="What's on your mind?"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handlePost} disabled={posting || !content.trim()}>
                {posting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

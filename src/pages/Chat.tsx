import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeft, Send } from "lucide-react"
import { toast } from "sonner"
import MessageBubble from "@/components/MessageBubble"
import { Input } from "@/components/ui/input"
import { useMessages } from "@/hooks/useData"
import { sendMessage, getUser } from "@/lib/api"
import type { User } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

export default function Chat() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { messages, loading, reload } = useMessages(userId ?? "")
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userId) {
      getUser(userId).then(setOtherUser).catch(() => {})
    }
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || !userId) return
    setSending(true)
    try {
      await sendMessage(userId, text.trim())
      setText("")
      reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="font-semibold text-sm">{otherUser?.name ?? "Chat"}</p>
          {otherUser?.bio && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{otherUser.bio}</p>}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && <p className="text-center text-sm text-muted-foreground">Loading messages...</p>}
        {!loading && messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">No messages yet. Say hi! 👋</p>
        )}
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isSent={msg.sender_id === currentUser?.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t px-4 py-3 flex gap-2 bg-background">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Message..."
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="text-blue-500 disabled:opacity-40 hover:scale-110 transition-transform"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

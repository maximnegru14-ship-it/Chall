import { cn } from "@/lib/utils"
import { formatTime } from "@/lib/utils"
import type { Message } from "@/lib/api"

interface MessageBubbleProps {
  message: Message
  isSent: boolean
}

export default function MessageBubble({ message, isSent }: MessageBubbleProps) {
  return (
    <div className={cn("flex", isSent ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
          isSent
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        )}
      >
        <p>{message.content}</p>
        <p className={cn("text-xs mt-1", isSent ? "text-blue-100" : "text-muted-foreground")}>
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}

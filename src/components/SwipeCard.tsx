import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/api"

interface SwipeCardProps {
  user: User
  onSwipe: (direction: "left" | "right") => void
  isTop: boolean
}

export default function SwipeCard({ user, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const passOpacity = useTransform(x, [-100, 0], [1, 0])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe("right")
    } else if (info.offset.x < -100) {
      onSwipe("left")
    }
  }

  const initials = user.name?.slice(0, 2).toUpperCase() ?? "??"

  return (
    <motion.div
      style={{ x, rotate, position: "absolute", width: "100%", touchAction: "none" }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ scale: isTop ? 1 : 0.95 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-xl bg-card mx-4">
        {/* Photo */}
        {user.photo ? (
          <img src={user.photo} alt={user.name} className="w-full h-96 object-cover" />
        ) : (
          <div className="w-full h-96 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={undefined} alt={user.name} />
              <AvatarFallback className="text-4xl bg-white/20 text-white">{initials}</AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Like / Pass overlays */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-6 left-6 border-4 border-green-400 text-green-400 rounded-lg px-3 py-1 text-2xl font-bold rotate-[-20deg]"
            >
              LIKE ❤️
            </motion.div>
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-6 right-6 border-4 border-red-400 text-red-400 rounded-lg px-3 py-1 text-2xl font-bold rotate-[20deg]"
            >
              NOPE ✕
            </motion.div>
          </>
        )}

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h2 className="text-2xl font-bold">
            {user.name}
            {user.age && <span className="font-normal text-xl ml-2">{user.age}</span>}
          </h2>
          {user.bio && <p className="text-sm opacity-90 mt-1 line-clamp-2">{user.bio}</p>}
        </div>
      </div>
    </motion.div>
  )
}

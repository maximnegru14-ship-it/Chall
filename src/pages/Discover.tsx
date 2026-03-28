import { useState } from "react"
import { X, Heart } from "lucide-react"
import { AnimatePresence } from "motion/react"
import SwipeCard from "@/components/SwipeCard"
import { useDiscover } from "@/hooks/useData"
import { swipe } from "@/lib/api"

export default function Discover() {
  const { users, loading, removeUser } = useDiscover()
  const [matchUser, setMatchUser] = useState<string | null>(null)

  const handleSwipe = async (userId: string, direction: "left" | "right") => {
    removeUser(userId)
    if (direction === "right") {
      try {
        const result = await swipe(userId, "like")
        if (result.match) {
          setMatchUser(userId)
          setTimeout(() => setMatchUser(null), 3000)
        }
      } catch {
        // ignore
      }
    } else {
      swipe(userId, "pass").catch(() => {})
    }
  }

  const topUser = users[0]
  const nextUser = users[1]

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <h1 className="text-xl font-bold tracking-tight">Discover</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {loading && (
          <p className="text-muted-foreground">Finding people near you...</p>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center space-y-2">
            <p className="text-4xl">😔</p>
            <p className="text-lg font-semibold">No more people to discover</p>
            <p className="text-sm text-muted-foreground">Check back later!</p>
          </div>
        )}

        {/* Match overlay */}
        {matchUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-in fade-in">
            <div className="text-center text-white space-y-3 animate-in zoom-in">
              <p className="text-6xl">🎉</p>
              <p className="text-4xl font-bold">It's a Match!</p>
              <p className="text-lg opacity-80">You can now message each other</p>
            </div>
          </div>
        )}

        {/* Card stack */}
        {!loading && users.length > 0 && (
          <>
            <div className="relative w-full" style={{ height: "420px" }}>
              <AnimatePresence>
                {nextUser && (
                  <SwipeCard key={nextUser.id} user={nextUser} onSwipe={() => {}} isTop={false} />
                )}
                {topUser && (
                  <SwipeCard
                    key={topUser.id}
                    user={topUser}
                    onSwipe={dir => handleSwipe(topUser.id, dir)}
                    isTop={true}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="flex gap-6 mt-6">
              <button
                onClick={() => handleSwipe(topUser.id, "left")}
                className="w-14 h-14 rounded-full bg-white border-2 border-red-300 text-red-400 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X className="w-7 h-7" />
              </button>
              <button
                onClick={() => handleSwipe(topUser.id, "right")}
                className="w-14 h-14 rounded-full bg-white border-2 border-green-300 text-green-400 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart className="w-7 h-7" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

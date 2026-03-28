import { Outlet, useNavigate, useLocation } from "react-router"
import { Home, Compass, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { path: "/", icon: Home, label: "Feed" },
  { path: "/discover", icon: Compass, label: "Discover" },
  { path: "/matches", icon: Heart, label: "Matches" },
  { path: "/profile", icon: User, label: "Profile" },
]

export default function Layout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <nav className="flex border-t bg-background sticky bottom-0">
        {tabs.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors",
              pathname === path ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("w-5 h-5", pathname === path && "fill-foreground")} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

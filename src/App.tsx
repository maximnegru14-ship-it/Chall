import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { Toaster } from "sonner"
import { AuthProvider, useAuth } from "@/hooks/useAuth"
import Layout from "@/components/Layout"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import Feed from "@/pages/Feed"
import Discover from "@/pages/Discover"
import Matches from "@/pages/Matches"
import Chat from "@/pages/Chat"
import Profile from "@/pages/Profile"

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route element={<Layout />}>
            <Route path="/" element={<Feed />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </BrowserRouter>
  )
}

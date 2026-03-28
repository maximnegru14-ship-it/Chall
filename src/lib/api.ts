import { supabase } from "./supabase"

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/make-server-4ac76e94`

async function request<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token ?? ""}`,
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message ?? "Request failed")
  }

  return res.json() as Promise<T>
}

// Types
export interface User {
  id: string
  name: string
  email: string
  age?: number
  bio?: string
  photo?: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  image?: string
  likes: number
  created_at: string
  user?: User
}

export interface Match {
  id: string
  user: User
  last_message?: string
  last_message_at?: string
  is_new?: boolean
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
}

// Auth
export const signup = (data: { email: string; password: string; name: string; age: number; bio: string }) =>
  request("/signup", { method: "POST", body: JSON.stringify(data) })

export const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password })

// Discover
export const getDiscoverUsers = () => request<User[]>("/users/discover")

export const swipe = (targetUserId: string, action: "like" | "pass") =>
  request<{ match: boolean }>("/swipe", {
    method: "POST",
    body: JSON.stringify({ targetUserId, action }),
  })

// Matches
export const getMatches = () => request<Match[]>("/matches")

// Feed & Posts
export const getFeed = () => request<Post[]>("/posts/feed")

export const createPost = (content: string, image?: string) =>
  request<Post>("/posts", {
    method: "POST",
    body: JSON.stringify({ content, image }),
  })

export const getUserPosts = (userId: string) => request<Post[]>(`/posts/user/${userId}`)

// Messages
export const getMessages = (userId: string) => request<Message[]>(`/messages/${userId}`)

export const sendMessage = (recipientId: string, content: string) =>
  request<Message>("/messages", {
    method: "POST",
    body: JSON.stringify({ recipientId, content }),
  })

// Profile
export const getProfile = () => request<User>("/profile/me")

export const getUser = (id: string) => request<User>(`/users/${id}`)

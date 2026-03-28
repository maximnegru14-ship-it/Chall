import { useState, useEffect, useCallback } from "react"
import { getFeed, getMatches, getMessages, getDiscoverUsers, getProfile, getUserPosts } from "@/lib/api"
import type { Post, Match, Message, User } from "@/lib/api"

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getFeed()
      setPosts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load feed")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  return { posts, loading, error, reload: load }
}

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getMatches()
      setMatches(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load matches")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  return { matches, loading, error, reload: load }
}

export function useMessages(userId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await getMessages(userId)
      setMessages(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])
  return { messages, loading, reload: load }
}

export function useDiscover() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getDiscoverUsers()
      setUsers(data)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const removeUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
  }, [])

  return { users, loading, reload: load, removeUser }
}

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProfile(), getProfile().then(p => getUserPosts(p.id))])
      .then(([profileData, postsData]) => {
        setProfile(profileData)
        setPosts(postsData)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { profile, posts, loading }
}

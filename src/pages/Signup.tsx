import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signup } from "@/lib/api"
import { supabase } from "@/lib/supabase"

export default function Signup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "", bio: "" })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup({
        ...form,
        age: parseInt(form.age),
      })
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) throw error
      navigate("/")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create account</h1>
          <p className="text-gray-500 text-sm">Join the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { field: "name", label: "Full Name", type: "text", placeholder: "Your name" },
            { field: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { field: "password", label: "Password", type: "password", placeholder: "••••••••" },
            { field: "age", label: "Age", type: "number", placeholder: "25" },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <Input
                type={type}
                placeholder={placeholder}
                value={form[field as keyof typeof form]}
                onChange={set(field)}
                required
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              placeholder="Tell us about yourself..."
              value={form.bio}
              onChange={set("bio")}
              rows={2}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-purple-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://utaksmztzpmmmeguxecm.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0YWtzbXp0enBtbW1lZ3V4ZWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDExMDUsImV4cCI6MjA4ODcxNzEwNX0.FVBCndEp1T0msNR1xy4A6xfYYXxngrWG8m5eBCroY1s"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

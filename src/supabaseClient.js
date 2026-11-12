import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjnxldnkzdefwfpqclxq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbnhsZG5remRlZndmcHFjbHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2ODYzMjcsImV4cCI6MjEwODI2MjMyN30.mnaRfj-DsEu7NkrDZCEKl3w84BAA_hoHr5_QWdZw--w'

export const supabase = createClient(supabaseUrl, supabaseKey)
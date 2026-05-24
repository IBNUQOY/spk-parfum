import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdhrgegfuhirxccaqpnn.supabase.co'
const supabaseKey = 'sb_publishable_KRVGSpBdJP3y58kxnt18EA_DzEYy3ZR'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dnntumdrzpapurtrypwv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubnR1bWRyenBhcHVydHJ5cHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDA0MTcsImV4cCI6MjA5NjE3NjQxN30.U1DgX-vbtDWq56HevJlR5Vo2a5N38JSrYgjy4fexdbo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
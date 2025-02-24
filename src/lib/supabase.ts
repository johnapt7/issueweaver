
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xrxonfwdpvpmdciwxpnv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeG9uZndkcHZwbWRjaXd4cG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjI1NjAsImV4cCI6MjA1NTk5ODU2MH0.V1r3Ez7luU5Vfsy22odIPDC734jD1r6Ic8Laxrgvhls";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

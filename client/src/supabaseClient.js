import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://efypgmafkfwlilebbbcf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeXBnbWFma2Z3bGlsZWJiYmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4Mjk1MDIsImV4cCI6MjA0MDQwNTUwMn0.eeGyZ6SxQIdmDnf_VLl-BnYVS87rbm00-jPW5aMSy1w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

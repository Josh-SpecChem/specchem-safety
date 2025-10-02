import { createClient } from '@supabase/supabase-js';
import { ConfigurationService } from '../configuration';

const { url, anonKey } = ConfigurationService.getSupabaseConfig();

export const supabase = createClient(url, anonKey);
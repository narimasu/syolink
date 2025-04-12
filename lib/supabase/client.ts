import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// 環境変数のログ出力（デバッグ用）
console.log('Supabase URL exists:', !!supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

// クライアントサイド用のSupabaseクライアント
console.log('Creating Supabase client with URL:', supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// 初期化後のチェック
supabase.storage.listBuckets().then(({data, error}) => {
  if (error) {
    console.error('Error checking buckets after initialization:', error);
  } else {
    console.log('Buckets available after initialization:', data?.map(b => b.name) || []);
  }
});

// クライアントサイド用のSSR対応Supabaseクライアント
export const createClientSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// サーバー側でのみ使用する管理者権限を持つクライアント
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseServiceKey);
};
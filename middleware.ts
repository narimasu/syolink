import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が必要なページのパスパターン
const authRequiredPaths = [
  '/artworks/upload',
  '/profile',
  '/admin',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // SupabaseのSSRクライアントを作成
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return req.cookies.get(name)?.value;
        },
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // セッションを取得
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // 現在のパス
  const path = req.nextUrl.pathname;
  
  // 認証が必要なページかどうかを確認
  const isAuthRequired = authRequiredPaths.some(authPath => 
    path === authPath || path.startsWith(`${authPath}/`)
  );
  
  // 管理者ページかどうかを確認
  const isAdminPage = path === '/admin' || path.startsWith('/admin/');
  
  // 認証が必要なページで、ログインしていない場合
  if (isAuthRequired && !session) {
    // ログインページにリダイレクト
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  // 管理者ページで、管理者権限がない場合
  if (isAdminPage && session?.user.user_metadata.role !== 'admin') {
    // ホームページにリダイレクト
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return res;
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: [
    '/artworks/upload/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
};
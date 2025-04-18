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
  
  // 現在のパス
  const path = req.nextUrl.pathname;
  console.log('Middleware path:', path);
  
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
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    console.log('Session exists:', !!session);
    
    // 認証が必要なページかどうかを確認
    const isAuthRequired = authRequiredPaths.some(authPath => 
      path === authPath || path.startsWith(`${authPath}/`)
    );
    
    // 管理者ページかどうかを確認
    const isAdminPage = path === '/admin' || path.startsWith('/admin/');
    
    // 認証が必要なページで、ログインしていない場合
    if (isAuthRequired && !session) {
      console.log('Auth required but no session, redirecting to login');
      // ログインページにリダイレクト
      const redirectUrl = new URL('/auth/signin', req.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    // 管理者ページの場合で、セッションがある場合のみ管理者権限をチェック
    if (isAdminPage && session) {
      // ユーザーのIDを取得
      const userId = session.user.id;
      
      // ユーザーの役割を取得
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return NextResponse.redirect(new URL('/', req.url));
      }
      
      // 管理者でない場合はホームページにリダイレクト
      const isAdmin = userData?.role === 'admin';
      if (!isAdmin) {
        console.log('Admin page access denied, redirecting to home');
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    // エラーが発生した場合はホームページにリダイレクト
    if (authRequiredPaths.some(authPath => path === authPath || path.startsWith(`${authPath}/`))) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }
  
  return res;
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: [
    '/artworks/upload',
    '/artworks/upload/:path*',
    '/profile',
    '/profile/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
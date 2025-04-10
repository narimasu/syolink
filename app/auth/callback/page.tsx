'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URLパラメータからコードを取得
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/';
    
    const handleAuthCallback = async () => {
      if (code) {
        try {
          console.log('Auth callback with code:', code);
          const supabase = createClientSupabaseClient();
          
          // セッションを交換
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('認証エラー:', exchangeError);
            setError('認証に失敗しました。もう一度お試しください。');
            router.push('/auth/signin?error=認証に失敗しました');
            return;
          }
          
          console.log('Auth successful, redirecting to:', next);
          
          // 認証成功後のリダイレクト
          router.push(next);
        } catch (err) {
          console.error('コールバック処理エラー:', err);
          setError('認証処理中にエラーが発生しました。もう一度お試しください。');
          router.push('/auth/signin?error=認証処理中にエラーが発生しました');
        }
      } else {
        // コードがない場合はホームページにリダイレクト
        console.log('No auth code found, redirecting to home');
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-4 text-red-600">認証エラー</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">認証処理中...</h1>
        <p className="text-gray-600">しばらくお待ちください。自動的にリダイレクトされます。</p>
      </div>
    </div>
  );
}
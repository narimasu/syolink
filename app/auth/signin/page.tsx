'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { user, signIn, isLoading } = useSupabase();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ユーザーが既にログインしている場合はリダイレクト
  useEffect(() => {
    if (user && !isLoading) {
      console.log('User already signed in, redirecting to:', redirect);
      router.push(redirect);
    }
  }, [user, isLoading, router, redirect]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log('Attempting to sign in with:', email);
      await signIn(email, password);
      
      console.log('Sign in successful, redirecting to:', redirect);
      router.push(redirect);
      
    } catch (error: any) {
      console.error('Login error:', error);
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ロード中は何も表示しない
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <p>読み込み中...</p>
      </div>
    );
  }
  
  // ユーザーが既にログインしている場合は何も表示しない（useEffectでリダイレクト）
  if (user) {
    return null;
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="mb-2">ログイン</h1>
        <p className="text-gray-600">
          アカウントをお持ちでない場合は{' '}
          <Link href="/auth/signup" className="text-primary-500 hover:underline">
            会員登録
          </Link>
          {' '}してください
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSignIn} className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              ログイン状態を保持
            </label>
          </div>
          
          <div className="text-sm">
            <Link href="/auth/forgot-password" className="text-primary-500 hover:underline">
              パスワードをお忘れですか？
            </Link>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>
      </form>
    </div>
  );
}
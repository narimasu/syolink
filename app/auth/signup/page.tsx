'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useSupabase();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      setError('すべての項目を入力してください');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // signUp関数を呼び出し
      await signUp(email, password, username);
      
      // 成功時の処理
      setSuccess(true);
      
    } catch (error: any) {
      console.error('登録エラー詳細:', error);
      
      // エラーメッセージの詳細な処理
      if (error.message) {
        if (error.message.includes('already registered')) {
          setError('このメールアドレスは既に登録されています');
        } else {
          setError(`登録に失敗しました: ${error.message}`);
        }
      } else {
        setError('登録に失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="text-lg font-medium mb-2">会員登録が完了しました</h2>
          <p className="mb-4">
            登録したメールアドレスに確認メールを送信しました。メール内のリンクをクリックして、登録を完了してください。
          </p>
          <Link href="/auth/signin" className="btn-primary inline-block">
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="mb-2">会員登録</h1>
        <p className="text-gray-600">
          既にアカウントをお持ちの場合は{' '}
          <Link href="/auth/signin" className="text-primary-500 hover:underline">
            ログイン
          </Link>
          {' '}してください
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSignUp} className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            ユーザー名
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            required
          />
        </div>
        
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
          <p className="text-xs text-gray-500 mt-1">
            6文字以上の英数字を入力してください
          </p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード（確認）
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            required
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? '登録中...' : '会員登録'}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          会員登録すると、
          <Link href="/terms" className="text-primary-500 hover:underline">
            利用規約
          </Link>
          と
          <Link href="/privacy" className="text-primary-500 hover:underline">
            プライバシーポリシー
          </Link>
          に同意したことになります。
        </p>
      </form>
    </div>
  );
}
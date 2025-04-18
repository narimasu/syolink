'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (resetError) throw resetError;
      
      setSuccess(true);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError('パスワードリセットメールの送信に失敗しました。メールアドレスを確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="text-lg font-medium mb-2">パスワードリセットメールを送信しました</h2>
          <p className="mb-4">
            入力されたメールアドレスにパスワードリセット用のリンクを送信しました。
            メールを確認して、リンクをクリックしてパスワードをリセットしてください。
          </p>
          <p className="text-sm mb-4">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
          <Link href="/auth/signin" className="btn-primary inline-block">
            ログインページに戻る
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="mb-2">パスワードをお忘れですか？</h1>
        <p className="text-gray-600">
          アカウントに登録したメールアドレスを入力してください。
          パスワードリセット用のリンクをメールでお送りします。
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-4">
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
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting ? '送信中...' : 'パスワードリセットメールを送信'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <Link href="/auth/signin" className="text-primary-500 hover:underline text-sm">
            ログインページに戻る
          </Link>
        </div>
      </form>
    </div>
  );
}
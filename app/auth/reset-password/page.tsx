'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // ハッシュフラグメントからパスワードリセットトークンを確認
    const checkResetToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        setError('無効または期限切れのパスワードリセットリンクです。もう一度パスワードリセットをリクエストしてください。');
      }
      
      // セッションがない場合はトークンが無効
      if (!data.session) {
        setError('無効または期限切れのパスワードリセットリンクです。もう一度パスワードリセットをリクエストしてください。');
      }
    };
    
    checkResetToken();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!newPassword || !confirmPassword) {
      setError('すべての項目を入力してください');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // パスワード更新
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) throw updateError;
      
      setSuccess(true);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError('パスワードの変更に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="text-lg font-medium mb-2">パスワードを変更しました</h2>
          <p className="mb-4">
            パスワードが正常に変更されました。新しいパスワードでログインしてください。
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
        <h1 className="mb-2">新しいパスワードを設定</h1>
        <p className="text-gray-600">
          新しいパスワードを入力してください
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          {error && error.includes('無効または期限切れ') && (
            <div className="mt-2">
              <Link href="/auth/forgot-password" className="text-red-700 underline">
                パスワードリセットを再度リクエスト
              </Link>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            新しいパスワード
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            6文字以上の英数字を入力してください
          </p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            新しいパスワード（確認）
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
            disabled={isSubmitting || !!error}
            className="w-full btn-primary"
          >
            {isSubmitting ? '処理中...' : 'パスワードを変更する'}
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
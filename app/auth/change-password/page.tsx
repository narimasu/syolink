'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isLoading } = useSupabase();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // 認証チェック
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin?redirect=/auth/change-password');
    }
  }, [user, isLoading, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // バリデーション
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('すべての項目を入力してください');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // 現在のパスワードで認証を確認
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });
      
      if (signInError) {
        throw new Error('現在のパスワードが正しくありません');
      }
      
      // パスワード変更
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) throw updateError;
      
      // 成功
      setSuccess(true);
      
      // フォームをリセット
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error: any) {
      console.error('Error changing password:', error);
      setError(error.message || 'パスワード変更に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ロード中表示
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p>読み込み中...</p>
      </div>
    );
  }
  
  // ユーザー未ログインの場合は何も表示しない（useEffectでリダイレクト）
  if (!user) {
    return null;
  }
  
  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="text-lg font-medium mb-2">パスワードを変更しました</h2>
          <p className="mb-4">
            パスワードが正常に変更されました。新しいパスワードを使用してログインしてください。
          </p>
          <Link href="/profile" className="btn-primary inline-block">
            プロフィールに戻る
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-center mb-6">パスワード変更</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            現在のパスワード
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input"
            required
          />
        </div>
        
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
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting ? '処理中...' : 'パスワードを変更する'}
          </button>
        </div>
      </form>
    </div>
  );
}
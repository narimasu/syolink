'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, deleteAccount, isLoading } = useSupabase();
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ロード中表示
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p>読み込み中...</p>
      </div>
    );
  }
  
  // 未ログイン表示
  if (!user) {
    router.push('/auth/signin?redirect=/profile/settings');
    return null;
  }
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    // メールアドレスの確認
    if (confirmEmail !== user.email) {
      setError('メールアドレスが一致しません');
      return;
    }
    
    try {
      setIsDeleting(true);
      setError(null);
      
      await deleteAccount();
      
      // 成功したらホームページにリダイレクト
      // (deleteAccount内でリダイレクトするので不要)
    } catch (error: any) {
      console.error('Error deleting account:', error);
      setError('アカウントの削除に失敗しました: ' + error.message);
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6">アカウント設定</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">アカウント情報</h2>
          <p className="text-gray-600 mb-4">
            メールアドレス: <span className="font-medium">{user?.email}</span>
          </p>
          
          <div className="flex space-x-4">
            <Link href="/profile/edit" className="btn-secondary text-sm">
              プロフィール編集
            </Link>
            <Link href="/auth/change-password" className="btn-secondary text-sm">
              パスワード変更
            </Link>
          </div>
        </div>
        
        <hr className="border-gray-200" />
        
        <div>
          <h2 className="text-lg font-medium text-red-600 mb-2">危険な操作</h2>
          <p className="text-gray-600 mb-4">
            アカウントを削除すると、全ての作品、いいね、コメントが完全に削除され、元に戻すことはできません。
          </p>
          
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            アカウントを削除する
          </button>
        </div>
      </div>
      
      {/* 削除確認モーダル */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4 text-red-600">アカウントを完全に削除しますか？</h3>
            <p className="text-gray-600 mb-4">
              この操作は取り消せません。すべての作品、いいね、コメントが完全に削除されます。
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                確認のため、メールアドレスを入力してください
              </label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder={user?.email}
                className="input"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="btn-secondary"
                disabled={isDeleting}
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                disabled={isDeleting || confirmEmail !== user?.email}
              >
                {isDeleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/supabase/schema';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, isLoading } = useSupabase();
  
  const [profile, setProfile] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // ファイルドロップゾーン
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      
      // プレビュー用URL生成
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    },
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setProfile(data);
        setUsername(data.username);
        setPreviewUrl(data.avatar_url);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
  // 認証チェック
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin?redirect=/profile/edit');
    }
  }, [user, isLoading, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      
      let avatarUrl = profile.avatar_url;
      
      // アバター画像のアップロード
      if (uploadedFile) {
        // ファイルサイズのチェック
        if (uploadedFile.size > 2 * 1024 * 1024) {
          throw new Error('ファイルサイズが2MBを超えています');
        }
        
        // ファイル名を生成（ユーザーIDとタイムスタンプを含む一意のもの）
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        // ストレージにアップロード
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, uploadedFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) throw uploadError;
        
        // 公開URLを取得
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        avatarUrl = urlData.publicUrl;
      }
      
      // プロフィール情報の更新
      const { error: updateError } = await supabase
        .from('users')
        .update({
          username,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      setSuccessMessage('プロフィールを更新しました');
      
      // プロフィールを再取得
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      setProfile(updatedProfile);
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'プロフィールの更新に失敗しました');
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
  if (!user || !profile) {
    return null;
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6">プロフィール編集</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* アバター画像 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プロフィール画像
          </label>
          
          <div className="flex items-center">
            <div className="mr-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary-300"
            >
              <input {...getInputProps()} />
              <p className="text-sm text-gray-500">
                クリックまたはドラッグ＆ドロップで画像をアップロード
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, GIF形式（最大2MB）
              </p>
            </div>
          </div>
        </div>
        
        {/* ユーザー名 */}
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
        
        {/* メールアドレス（表示のみ） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={profile.email}
            className="input bg-gray-50"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            メールアドレスを変更するには、アカウント設定からパスワード変更を行ってください
          </p>
        </div>
        
        {/* 操作ボタン */}
        <div className="flex justify-between pt-4">
          <Link href="/profile" className="btn-secondary">
            キャンセル
          </Link>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '更新中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  );
}
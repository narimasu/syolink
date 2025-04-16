'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';
import { User, ArtworkWithDetails } from '@/lib/supabase/schema';
import ArtworkGrid from '@/app/components/features/artwork-grid';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useSupabase();
  
  const [profile, setProfile] = useState<User | null>(null);
  const [userArtworks, setUserArtworks] = useState<ArtworkWithDetails[]>([]);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'likes'
  
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
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    const fetchUserArtworks = async () => {
      if (!user) return;
      
      try {
        setIsLoadingArtworks(true);
        const { data, error } = await supabase
          .from('artworks')
          .select(`
            *,
            user:users(*),
            category:categories(*),
            theme:themes(*),
            likes_count:likes(count),
            comments_count:comments(count)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setUserArtworks(data as ArtworkWithDetails[]);
      } catch (error) {
        console.error('Error fetching user artworks:', error);
      } finally {
        setIsLoadingArtworks(false);
      }
    };
    
    if (user) {
      fetchProfile();
      fetchUserArtworks();
    }
  }, [user]);
  
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
    router.push('/auth/signin?redirect=/profile');
    return null;
  }
  
  return (
    <div className="space-y-8">
      {/* プロフィール情報 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                {profile?.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold mb-1">{profile?.username}</h1>
            <p className="text-gray-500 mb-4">{profile?.email}</p>
            
            <Link href="/profile/edit" className="btn-secondary text-sm">
              プロフィールを編集
            </Link>
          </div>
        </div>
      </div>
      
      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'posts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            投稿した作品
          </button>
          
          <button
            onClick={() => setActiveTab('likes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'likes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            いいねした作品
          </button>
        </nav>
      </div>
      
      {/* 作品一覧 */}
      {activeTab === 'posts' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">あなたの作品</h2>
            <Link href="/artworks/upload" className="btn-primary">
              新しい作品を投稿
            </Link>
          </div>
          
          {isLoadingArtworks ? (
            <div className="py-12 text-center">
              <p>読み込み中...</p>
            </div>
          ) : userArtworks.length > 0 ? (
            <ArtworkGrid artworks={userArtworks} />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">まだ投稿した作品がありません</p>
              <Link href="/artworks/upload" className="btn-primary">
                最初の作品を投稿する
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* いいねした作品（実装予定） */}
      {activeTab === 'likes' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">
            いいねした作品のリストは近日実装予定です
          </p>
        </div>
      )}
    </div>
  );
}
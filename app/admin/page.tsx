'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const { user, isLoading } = useSupabase();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtworks: 0,
    totalComments: 0,
    totalLikes: 0,
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        
        // ユーザー数
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        // 作品数
        const { count: artworksCount } = await supabase
          .from('artworks')
          .select('*', { count: 'exact', head: true });
        
        // コメント数
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true });
        
        // いいね数
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true });
        
        setStats({
          totalUsers: usersCount || 0,
          totalArtworks: artworksCount || 0,
          totalComments: commentsCount || 0,
          totalLikes: likesCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    if (user) {
      checkAdminStatus();
      fetchStats();
    }
  }, [user]);
  
  // ロード中表示
  if (isLoading || isLoadingStats) {
    return (
      <div className="py-12 text-center">
        <p>読み込み中...</p>
      </div>
    );
  }
  
  // 管理者権限がない場合
  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <h1 className="text-red-700 text-xl font-bold mb-2">アクセス権限がありません</h1>
        <p className="text-red-600 mb-4">
          このページは管理者のみがアクセスできます。
        </p>
        <Link href="/" className="btn-primary">
          ホームに戻る
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <h1>管理者ダッシュボード</h1>
      
      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-500">総ユーザー数</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-500">総作品数</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalArtworks}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-500">総コメント数</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalComments}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-500">総いいね数</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalLikes}</p>
        </div>
      </div>
      
      {/* 管理メニュー */}
      <h2 className="text-xl font-bold mt-8 mb-4">管理メニュー</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/themes"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start">
            <div className="bg-primary-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium mb-1">月間お題の管理</h3>
              <p className="text-sm text-gray-500">
                お題の作成、編集、削除を行います
              </p>
            </div>
          </div>
        </Link>
        
        <Link
          href="/admin/categories"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start">
            <div className="bg-primary-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium mb-1">カテゴリー管理</h3>
              <p className="text-sm text-gray-500">
                カテゴリーの作成、編集、削除を行います
              </p>
            </div>
          </div>
        </Link>
        
        <Link
          href="/admin/users"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start">
            <div className="bg-primary-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium mb-1">ユーザー管理</h3>
              <p className="text-sm text-gray-500">
                ユーザーの管理、権限設定を行います
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
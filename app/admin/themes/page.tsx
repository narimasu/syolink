'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';
import { Theme } from '@/lib/supabase/schema';

export default function AdminThemesPage() {
  const { user, isLoading } = useSupabase();
  
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);
  
  // 新規お題用のフォーム状態
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  
  // 削除確認用の状態
  const [themeToDelete, setThemeToDelete] = useState<string | null>(null);
  
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
    
    const fetchThemes = async () => {
      try {
        setIsLoadingThemes(true);
        
        const { data, error } = await supabase
          .from('themes')
          .select('*')
          .order('year', { ascending: false })
          .order('month', { ascending: false });
        
        if (error) throw error;
        
        setThemes(data);
      } catch (error) {
        console.error('Error fetching themes:', error);
      } finally {
        setIsLoadingThemes(false);
      }
    };
    
    if (user) {
      checkAdminStatus();
      fetchThemes();
    }
  }, [user]);
  
  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('themes')
        .insert({
          title: formData.title,
          description: formData.description,
          year: formData.year,
          month: formData.month,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // 新しいお題をリストに追加
      setThemes([data, ...themes]);
      
      // フォームをリセット
      setFormData({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      });
      
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating theme:', error);
      alert('お題の作成に失敗しました。もう一度お試しください。');
    }
  };
  
  const handleDeleteTheme = async (id: string) => {
    try {
      const { error } = await supabase
        .from('themes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // 削除したお題をリストから除外
      setThemes(themes.filter(theme => theme.id !== id));
      setThemeToDelete(null);
    } catch (error) {
      console.error('Error deleting theme:', error);
      alert('お題の削除に失敗しました。もう一度お試しください。');
    }
  };
  
  // ロード中表示
  if (isLoading || isLoadingThemes) {
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
      <div className="flex justify-between items-center">
        <h1>月間お題の管理</h1>
        <div className="flex space-x-4">
          <Link href="/admin" className="btn-secondary">
            ダッシュボードに戻る
          </Link>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="btn-primary"
          >
            {isCreating ? 'キャンセル' : '新しいお題を作成'}
          </button>
        </div>
      </div>
      
      {/* 新規お題作成フォーム */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">新しいお題を作成</h2>
          
          <form onSubmit={handleCreateTheme} className="space-y-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                年
              </label>
              <input
                id="year"
                type="number"
                min="2020"
                max="2100"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                月
              </label>
              <select
                id="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                className="input"
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}月
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                お題のタイトル
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                お題の説明
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn-secondary"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                作成する
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* お題一覧 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                お題
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                年月
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                作品数
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {themes.length > 0 ? (
              themes.map((theme) => (
                <tr key={theme.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">「{theme.title}」</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{theme.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {format(new Date(theme.year, theme.month - 1), 'yyyy年M月', { locale: ja })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {/* 実際には作品数を取得して表示 */}
                      -
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/themes/${theme.id}`}
                      className="text-primary-500 hover:text-primary-700"
                    >
                      表示
                    </Link>
                    <Link
                      href={`/admin/themes/${theme.id}/edit`}
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => setThemeToDelete(theme.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  お題がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 削除確認モーダル */}
      {themeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">お題を削除しますか？</h3>
            <p className="text-gray-500 mb-4">
              この操作は元に戻せません。このお題に関連するすべての投稿も関連付けが解除されます。
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setThemeToDelete(null)}
                className="btn-secondary"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDeleteTheme(themeToDelete)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
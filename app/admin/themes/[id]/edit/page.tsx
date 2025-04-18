'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';
import { Theme } from '@/lib/supabase/schema';

interface ThemeEditPageProps {
  params: {
    id: string;
  };
}

export default function ThemeEditPage({ params }: ThemeEditPageProps) {
  const { id } = params;
  const router = useRouter();
  const { user, isLoading } = useSupabase();
  
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);
  
  // フォーム状態
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  
  // エラーと送信状態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    
    const fetchTheme = async () => {
      try {
        setIsLoadingTheme(true);
        
        const { data, error } = await supabase
          .from('themes')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setTheme(data);
        setFormData({
          title: data.title,
          description: data.description,
          year: data.year,
          month: data.month,
        });
      } catch (error) {
        console.error('Error fetching theme:', error);
        router.push('/admin/themes');
      } finally {
        setIsLoadingTheme(false);
      }
    };
    
    if (user) {
      checkAdminStatus();
      fetchTheme();
    }
  }, [user, id, router]);
  
  const handleUpdateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const { error: updateError } = await supabase
        .from('themes')
        .update({
          title: formData.title,
          description: formData.description,
          year: formData.year,
          month: formData.month,
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // 更新成功後、一覧ページに戻る
      router.push('/admin/themes');
    } catch (error: any) {
      console.error('Error updating theme:', error);
      setError('お題の更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ロード中表示
  if (isLoading || isLoadingTheme) {
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
  
  // テーマが見つからない場合
  if (!theme) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <h1 className="text-yellow-700 text-xl font-bold mb-2">お題が見つかりません</h1>
        <p className="text-yellow-600 mb-4">
          指定されたお題が見つかりませんでした。
        </p>
        <Link href="/admin/themes" className="btn-primary">
          お題一覧に戻る
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1>お題の編集</h1>
        <Link href="/admin/themes" className="btn-secondary">
          お題一覧に戻る
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleUpdateTheme} className="space-y-4">
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
          
          <div className="flex justify-end space-x-4 pt-4">
            <Link
              href="/admin/themes"
              className="btn-secondary"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '更新中...' : '更新する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
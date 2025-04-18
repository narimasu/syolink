'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';
import { Category } from '@/lib/supabase/schema';

export default function AdminCategoriesPage() {
  const { user, isLoading } = useSupabase();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // 新規カテゴリー用のフォーム状態
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  
  // 編集モード用の状態
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
  });
  
  // 削除確認用の状態
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // エラーメッセージの状態
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
    
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    if (user) {
      checkAdminStatus();
      fetchCategories();
    }
  }, [user]);
  
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: formData.name,
          description: formData.description,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // 新しいカテゴリーをリストに追加
      setCategories([...categories, data]);
      
      // フォームをリセット
      setFormData({
        name: '',
        description: '',
      });
      
      setIsCreating(false);
    } catch (error: any) {
      console.error('Error creating category:', error);
      setError('カテゴリーの作成に失敗しました。もう一度お試しください。');
    }
  };
  
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategoryId) return;
    
    try {
      setError(null);
      
      const { error } = await supabase
        .from('categories')
        .update({
          name: editFormData.name,
          description: editFormData.description,
        })
        .eq('id', editingCategoryId);
      
      if (error) throw error;
      
      // カテゴリーリストを更新
      setCategories(
        categories.map(category => 
          category.id === editingCategoryId
            ? { ...category, name: editFormData.name, description: editFormData.description }
            : category
        )
      );
      
      // 編集モードを終了
      setEditingCategoryId(null);
    } catch (error: any) {
      console.error('Error updating category:', error);
      setError('カテゴリーの更新に失敗しました。もう一度お試しください。');
    }
  };
  
  const handleDeleteCategory = async (id: string) => {
    try {
      setError(null);
      
      // このカテゴリーに関連する作品があるか確認
      const { count, error: countError } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        setError(`このカテゴリーには${count}件の作品が関連付けられています。削除する前に作品のカテゴリーを変更してください。`);
        setCategoryToDelete(null);
        return;
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // 削除したカテゴリーをリストから除外
      setCategories(categories.filter(category => category.id !== id));
      setCategoryToDelete(null);
    } catch (error: any) {
      console.error('Error deleting category:', error);
      setError('カテゴリーの削除に失敗しました。もう一度お試しください。');
    }
  };
  
  const startEditing = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditFormData({
      name: category.name,
      description: category.description || '',
    });
  };
  
  // ロード中表示
  if (isLoading || isLoadingCategories) {
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
        <h1>カテゴリー管理</h1>
        <div className="flex space-x-4">
          <Link href="/admin" className="btn-secondary">
            ダッシュボードに戻る
          </Link>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="btn-primary"
          >
            {isCreating ? 'キャンセル' : '新しいカテゴリーを作成'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* 新規カテゴリー作成フォーム */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">新しいカテゴリーを作成</h2>
          
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリー名
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
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
      
      {/* カテゴリー一覧 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カテゴリー名
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                説明
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  {editingCategoryId === category.id ? (
                    // 編集モード
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="input"
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          rows={2}
                          value={editFormData.description}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          className="input"
                        />
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button
                          onClick={handleEditCategory}
                          className="text-indigo-500 hover:text-indigo-700"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          キャンセル
                        </button>
                      </td>
                    </>
                  ) : (
                    // 通常表示
                    <>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{category.description || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => startEditing(category)}
                          className="text-indigo-500 hover:text-indigo-700"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(category.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          削除
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  カテゴリーがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 削除確認モーダル */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">カテゴリーを削除しますか？</h3>
            <p className="text-gray-500 mb-4">
              このカテゴリーを削除してもよろしいですか？このカテゴリーに関連する作品がある場合は削除できません。
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="btn-secondary"
              >
                キャンセル
              </button>
              <button
                onClick={() => categoryToDelete && handleDeleteCategory(categoryToDelete)}
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
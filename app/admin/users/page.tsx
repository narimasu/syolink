'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/supabase/schema';

// ユーザー情報に追加の型定義
interface ExtendedUser extends Omit<User, 'role'> {
  role?: string | null;
}

export default function AdminUsersPage() {
  const { user, isLoading } = useSupabase();
  
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  
  // ページネーション用の状態
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;
  
  // 検索用の状態
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // ユーザー編集用の状態
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    role: '',
  });
  
  // エラーメッセージの状態
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
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
    
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        
        // 検索クエリがある場合は検索、なければ通常の取得
        let query = supabase
          .from('users')
          .select('*', { count: 'exact' });
        
        if (searchQuery) {
          query = query.or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
        }
        
        // ページネーション設定
        const from = (currentPage - 1) * usersPerPage;
        const to = from + usersPerPage - 1;
        
        const { data, count, error } = await query
          .order('created_at', { ascending: false })
          .range(from, to);
        
        if (error) throw error;
        
        setUsers(data);
        
        if (count) {
          setTotalUsers(count);
          setTotalPages(Math.ceil(count / usersPerPage));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false);
        setIsSearching(false);
      }
    };
    
    if (user) {
      checkAdminStatus();
      fetchUsers();
    }
  }, [user, currentPage, searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1); // 検索時は1ページ目に戻す
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  const startEditing = (userToEdit: ExtendedUser) => {
    setEditingUserId(userToEdit.id);
    setEditFormData({
      username: userToEdit.username,
      role: userToEdit.role || 'user',
    });
  };
  
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUserId) return;
    
    try {
      setError(null);
      setSuccess(null);
      
      const { error } = await supabase
        .from('users')
        .update({
          username: editFormData.username,
          role: editFormData.role,
        })
        .eq('id', editingUserId);
      
      if (error) throw error;
      
      // ユーザーリストを更新
      setUsers(
        users.map(u => 
          u.id === editingUserId
            ? { ...u, username: editFormData.username, role: editFormData.role }
            : u
        )
      );
      
      setSuccess('ユーザー情報を更新しました');
      
      // 編集モードを終了
      setEditingUserId(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      setError('ユーザー情報の更新に失敗しました。もう一度お試しください。');
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
        <h1>ユーザー管理</h1>
        <Link href="/admin" className="btn-secondary">
          ダッシュボードに戻る
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      {/* 検索フォーム */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="ユーザー名またはメールアドレスで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSearching}
          >
            {isSearching ? '検索中...' : '検索'}
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="btn-secondary"
            >
              クリア
            </button>
          )}
        </form>
      </div>
      
      {/* ユーザー一覧 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">ユーザー一覧</h2>
            <div className="text-sm text-gray-500">
              全 {totalUsers} 人のユーザー
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ユーザー
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メール
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  権限
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  登録日
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <p>読み込み中...</p>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((userItem) => (
                  <tr key={userItem.id}>
                    {editingUserId === userItem.id ? (
                      // 編集モード
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editFormData.username}
                            onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                            className="input"
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{userItem.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editFormData.role}
                            onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                            className="input"
                          >
                            <option value="user">ユーザー</option>
                            <option value="admin">管理者</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {format(new Date(userItem.created_at), 'yyyy/MM/dd', { locale: ja })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                          <button
                            onClick={handleUpdateUser}
                            className="text-indigo-500 hover:text-indigo-700"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
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
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                              {userItem.avatar_url ? (
                                <img 
                                  src={userItem.avatar_url} 
                                  alt={userItem.username} 
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                userItem.username.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {userItem.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{userItem.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            userItem.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {userItem.role === 'admin' ? '管理者' : 'ユーザー'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {format(new Date(userItem.created_at), 'yyyy/MM/dd', { locale: ja })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => startEditing(userItem)}
                            className="text-indigo-500 hover:text-indigo-700"
                          >
                            編集
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchQuery ? '検索結果がありません' : 'ユーザーがありません'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {`${(currentPage - 1) * usersPerPage + 1}～${Math.min(currentPage * usersPerPage, totalUsers)} / 全${totalUsers}件`}
              </p>
            </div>
            <div>
              <nav className="flex items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  前へ
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
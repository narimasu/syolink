'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { supabase } from '@/lib/supabase/client';
import { useSupabase } from '@/app/providers/supabase-provider';

// データベースから返ってくるコメントの型を定義
interface CommentFromDB {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  artwork_id: string;
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

// コンポーネント内で使用するコメントの型を定義
interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface CommentSectionProps {
  artworkId: string;
}

export default function CommentSection({ artworkId }: CommentSectionProps) {
  const { user } = useSupabase();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // コメントを取得
  useEffect(() => {
    const fetchComments = async () => {
      if (!artworkId) {
        console.log('No artwork ID provided for comments');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);
        console.log('Fetching comments for artwork:', artworkId);
        
        // 単純なクエリに変更して徐々に複雑にする
        const { data, error } = await supabase
          .from('comments')
          .select('*, user:users(id, username, avatar_url)')
          .eq('artwork_id', artworkId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching comments:', error);
          setFetchError(`コメントの取得に失敗しました: ${error.message}`);
          // エラーをスローしない - 代わりにエラー状態を保存
          return;
        }

        console.log('Comments data received:', data);
        
        // データがない場合は空配列を設定
        if (!data || data.length === 0) {
          console.log('No comments found');
          setComments([]);
          setIsLoading(false);
          return;
        }

        // データの形状をログに出力して確認
        console.log('First comment data structure:', JSON.stringify(data[0], null, 2));
        
        // 安全な変換を行う
        const formattedComments: Comment[] = [];
        
        for (const rawComment of data) {
          try {
            // userがオブジェクトかどうか確認
            if (rawComment.user && typeof rawComment.user === 'object') {
              formattedComments.push({
                id: rawComment.id,
                content: rawComment.content,
                created_at: rawComment.created_at,
                user: {
                  id: rawComment.user.id || 'unknown',
                  username: rawComment.user.username || 'Unknown User',
                  avatar_url: rawComment.user.avatar_url
                }
              });
            } else {
              console.warn('Comment has invalid user data:', rawComment);
            }
          } catch (err) {
            console.error('Error formatting comment:', err, rawComment);
          }
        }
        
        console.log('Formatted comments:', formattedComments.length);
        setComments(formattedComments);
      } catch (error) {
        console.error('Unexpected error fetching comments:', error);
        setFetchError('コメントの取得中に予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();

    // リアルタイム更新のサブスクリプションを簡略化
    try {
      const channel = supabase
        .channel(`comments-channel-${artworkId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `artwork_id=eq.${artworkId}`,
        }, () => {
          console.log('Comment change detected, refreshing...');
          fetchComments();
        })
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.error('Error setting up realtime subscription:', err);
    }
  }, [artworkId]);

  // コメント投稿処理
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('コメントするにはログインが必要です');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      console.log('Submitting new comment for artwork:', artworkId);

      // まずコメントのみを追加
      const { data, error } = await supabase.from('comments').insert({
        artwork_id: artworkId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) {
        console.error('Error posting comment:', error);
        alert(`コメントの投稿に失敗しました: ${error.message}`);
        return;
      }

      console.log('Comment posted successfully');
      setNewComment('');
      
      // コメント投稿後、最新のコメントを再取得
      try {
        const { data: refreshedComments, error: refreshError } = await supabase
          .from('comments')
          .select('*, user:users(id, username, avatar_url)')
          .eq('artwork_id', artworkId)
          .order('created_at', { ascending: false });
          
        if (refreshError) {
          console.error('Error refreshing comments:', refreshError);
          return;
        }

        // データがない場合は空配列を設定
        if (!refreshedComments || refreshedComments.length === 0) {
          setComments([]);
          return;
        }

        // 安全な変換
        const formattedComments: Comment[] = [];
        
        for (const rawComment of refreshedComments) {
          if (rawComment.user && typeof rawComment.user === 'object') {
            formattedComments.push({
              id: rawComment.id,
              content: rawComment.content,
              created_at: rawComment.created_at,
              user: {
                id: rawComment.user.id || 'unknown',
                username: rawComment.user.username || 'Unknown User',
                avatar_url: rawComment.user.avatar_url
              }
            });
          }
        }
        
        setComments(formattedComments);
      } catch (refreshErr) {
        console.error('Error in comment refresh:', refreshErr);
      }
    } catch (error) {
      console.error('Unexpected error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">コメント</h2>

      {/* エラーメッセージ表示 */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {fetchError}
        </div>
      )}

      {/* コメント入力フォーム */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? 'コメントを入力...' : 'コメントするにはログインしてください'}
          disabled={!user || isSubmitting}
          className="input resize-none"
          rows={3}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!user || !newComment.trim() || isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? '送信中...' : 'コメントする'}
          </button>
        </div>
      </form>

      {/* コメント一覧 */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-500 py-4">読み込み中...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">コメントはまだありません</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  {comment.user.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      alt={comment.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-sm">{comment.user.username}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.created_at), 'yyyy/MM/dd HH:mm', {
                        locale: ja,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
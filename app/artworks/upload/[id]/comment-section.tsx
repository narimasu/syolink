'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { supabase } from '@/lib/supabase/client';
import { useSupabase } from '@/app/providers/supabase-provider';

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

  // コメントを取得
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*, user:users(id, username, avatar_url)')
          .eq('artwork_id', artworkId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setComments(data as Comment[]);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();

    // リアルタイム更新を購読
    const subscription = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `artwork_id=eq.${artworkId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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

      const { error } = await supabase.from('comments').insert({
        artwork_id: artworkId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">コメント</h2>

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
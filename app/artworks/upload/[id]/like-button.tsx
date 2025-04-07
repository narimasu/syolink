'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useSupabase } from '@/app/providers/supabase-provider';

interface LikeButtonProps {
  artworkId: string;
  initialLikesCount: number;
  initialUserHasLiked: boolean;
}

export default function LikeButton({
  artworkId,
  initialLikesCount,
  initialUserHasLiked,
}: LikeButtonProps) {
  const { user } = useSupabase();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [userHasLiked, setUserHasLiked] = useState(initialUserHasLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!user) {
      // ログインしていない場合はログインを促す
      alert('いいねするにはログインが必要です');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);

      if (userHasLiked) {
        // いいねを削除
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('artwork_id', artworkId)
          .eq('user_id', user.id);

        if (error) throw error;

        setLikesCount((prev) => prev - 1);
        setUserHasLiked(false);
      } else {
        // いいねを追加
        const { error } = await supabase
          .from('likes')
          .insert({
            artwork_id: artworkId,
            user_id: user.id,
          });

        if (error) throw error;

        setLikesCount((prev) => prev + 1);
        setUserHasLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center space-x-2 ${
          userHasLiked
            ? 'text-red-500 hover:text-red-600'
            : 'text-gray-500 hover:text-red-500'
        } transition-colors duration-200 disabled:opacity-50`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={userHasLiked ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className="font-medium">
          {userHasLiked ? 'いいね済み' : 'いいね'} • {likesCount}
        </span>
      </button>
    </div>
  );
}
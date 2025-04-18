import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import LikeButton from '@/app/components/features/like-button';
import CommentSection from '@/app/components/features/comment-section';

interface ArtworkDetailPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 60; // 1分ごとに再検証

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  // paramsを待機せずに直接アクセスするとエラーになるため、async/awaitを使用
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  if (!id) {
    console.error('No artwork ID provided');
    return notFound();
  }
  
  const supabase = createServerSupabaseClient();
  
  try {
    // 作品詳細を取得
    const { data: artwork, error } = await supabase
      .from('artworks')
      .select(`
        *,
        user:users(*),
        category:categories(*),
        theme:themes(*)
      `)
      .eq('id', id)
      .single();
    
    // エラー処理
    if (error) {
      console.error('Error fetching artwork:', error);
      return notFound();
    }
    
    if (!artwork) {
      console.error('Artwork not found');
      return notFound();
    }
    
    // いいね数を取得
    const { count: likesCount, error: likesError } = await supabase
      .from('likes')
      .select('*', { count: 'exact' })
      .eq('artwork_id', id);
    
    if (likesError) {
      console.error('Error fetching likes count:', likesError);
    }
    
    // 現在のユーザーがいいねしているか確認
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    let userHasLiked = false;
    
    if (session?.user) {
      const { data: userLike, error: userLikeError } = await supabase
        .from('likes')
        .select('*')
        .eq('artwork_id', id)
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (userLikeError) {
        console.error('Error checking user like status:', userLikeError);
      } else {
        userHasLiked = !!userLike;
      }
    }
    
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/artworks" className="text-primary-500 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            作品一覧に戻る
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 作品画像 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="relative aspect-square">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          
          {/* 作品情報 */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <h1 className="mb-2">「{artwork.title}」</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge-blue">{artwork.category.name}</span>
                  {artwork.theme && (
                    <span className="badge-green">
                      {artwork.theme.year}年{artwork.theme.month}月のお題
                    </span>
                  )}
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                    {artwork.user.avatar_url ? (
                      <Image
                        src={artwork.user.avatar_url}
                        alt={artwork.user.username}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {artwork.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{artwork.user.username}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(artwork.created_at), 'yyyy年M月d日', { locale: ja })}
                    </p>
                  </div>
                </div>
                
                {artwork.description && (
                  <div>
                    <h2 className="text-lg font-medium mb-2">作品説明</h2>
                    <p className="text-gray-700 whitespace-pre-line">{artwork.description}</p>
                  </div>
                )}
              </div>
              
              {/* いいねボタンとカウント */}
              <div>
                <LikeButton
                  artworkId={id}
                  initialLikesCount={likesCount || 0}
                  initialUserHasLiked={userHasLiked}
                />
              </div>
            </div>
            
            {/* コメントセクション */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <CommentSection artworkId={id} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Unexpected error in artwork detail page:', err);
    return notFound();
  }
}
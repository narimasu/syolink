import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import ArtworkGrid from '@/app/components/features/artwork-grid';
import { ArtworkWithDetails } from '@/lib/supabase/schema';

interface ThemeDetailPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 60; // 1分ごとに再検証

export default async function ThemeDetailPage({ params }: ThemeDetailPageProps) {
  const { id } = params;
  const supabase = createServerSupabaseClient();
  
  // お題情報を取得
  const { data: theme, error } = await supabase
    .from('themes')
    .select('*')
    .eq('id', id)
    .single();
  
  // エラー処理
  if (error || !theme) {
    return notFound();
  }
  
  // このお題に関連する作品を取得
  const { data: artworks } = await supabase
    .from('artworks')
    .select(`
      *,
      user:users(*),
      category:categories(*),
      theme:themes(*),
      likes_count:likes(count),
      comments_count:comments(count)
    `)
    .eq('theme_id', id)
    .order('created_at', { ascending: false });
  
  const themeDate = new Date(theme.year, theme.month - 1);
  
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <Link href="/themes" className="text-primary-500 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          月間お題一覧に戻る
        </Link>
      </div>
      
      {/* お題情報 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <div className="text-sm text-primary-600 font-medium mb-1">
              {format(themeDate, 'yyyy年M月', { locale: ja })}のお題
            </div>
            <h1 className="text-2xl font-bold">「{theme.title}」</h1>
          </div>
          
          <Link href={`/artworks/upload?theme=${theme.id}`} className="mt-4 md:mt-0 btn-primary">
            このお題で投稿する
          </Link>
        </div>
        
        <p className="text-gray-600 mb-4">{theme.description}</p>
        
        <div className="text-sm text-gray-500">
          投稿期間: {format(themeDate, 'yyyy年M月d日', { locale: ja })} 〜 {
            format(new Date(theme.year, theme.month, 0), 'yyyy年M月d日', { locale: ja })
          }
        </div>
      </div>
      
      {/* 作品一覧 */}
      <div>
        <h2 className="text-xl font-bold mb-4">このお題の作品</h2>
        
        {artworks && artworks.length > 0 ? (
          <ArtworkGrid artworks={artworks as ArtworkWithDetails[]} />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">まだ投稿された作品がありません</p>
            <Link href={`/artworks/upload?theme=${theme.id}`} className="btn-primary">
              最初の投稿者になりましょう！
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
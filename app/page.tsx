import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import ArtworkGrid from '@/app/components/features/artwork-grid';
import CategoryTabs from '@/app/components/features/category-tabs';
import ThemeBanner from '@/app/components/features/theme-banner';
import { ArtworkWithDetails, Theme } from '@/lib/supabase/schema';

export const revalidate = 3600; // 1時間ごとに再検証（キャッシュの更新）

export default async function Home() {
  const supabase = createServerSupabaseClient();

  // 最新の月間お題を取得
  const { data: latestTheme } = await supabase
    .from('themes')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(1)
    .single();

  // 最新の作品を取得（最大6件）
  const { data: latestArtworks } = await supabase
    .from('artworks')
    .select(`
      *,
      user:users(*),
      category:categories(*),
      theme:themes(*),
      likes_count:likes(count),
      comments_count:comments(count)
    `)
    .order('created_at', { ascending: false })
    .limit(6);

  // カテゴリ一覧を取得
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div className="space-y-8">
      {/* ヒーローセクション */}
      <section className="text-center py-10 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          あなたの書を世界へ
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          syolinkは書道愛好家のための作品共有プラットフォームです。
          あなたの作品を投稿して、仲間とつながりましょう。
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/artworks" className="btn-primary">
            作品を見る
          </Link>
          <Link href="/auth/signup" className="btn-secondary">
            会員登録する
          </Link>
        </div>
      </section>

      {/* 月間お題セクション */}
      {latestTheme && (
        <ThemeBanner theme={latestTheme as Theme} />
      )}

      {/* 作品一覧セクション */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2>最新の投稿</h2>
          <Link href="/artworks" className="text-primary-500 hover:underline">
            すべて見る
          </Link>
        </div>

        {/* カテゴリータブ */}
        <CategoryTabs categories={categories || []} />

        {/* 作品グリッド */}
        <ArtworkGrid artworks={latestArtworks as ArtworkWithDetails[] || []} />
      </section>

      {/* サービスの特徴セクション */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-center mb-8">syolinkの特徴</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="mb-2">月間お題</h3>
            <p className="text-gray-600">
              毎月のお題に沿って投稿し、技術を高め合いましょう。
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="mb-2">交流</h3>
            <p className="text-gray-600">
              作品へのコメントやいいねを通じて書道愛好家と交流できます。
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-2">作品記録</h3>
            <p className="text-gray-600">
              あなたの書道作品を保存し、成長の記録として残せます。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
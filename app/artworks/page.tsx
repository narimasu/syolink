import { Suspense } from 'react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import ArtworkGrid from '../components/features/artwork-grid';
import CategoryTabs from '../components/features/category-tabs';
import { ArtworkWithDetails } from '@/lib/supabase/schema';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface ArtworksPageProps {
  searchParams: {
    category?: string;
    page?: string;
  };
}

export default async function ArtworksPage({ searchParams }: ArtworksPageProps) {
  // searchParamsを非同期で解決
  const resolvedParams = await Promise.resolve(searchParams);
  
  const supabase = createServerSupabaseClient();
  
  // 解決されたパラメータを使用
  const categoryParam = resolvedParams?.category;
  const pageParam = resolvedParams?.page || '1';
  
  const categoryId = categoryParam;
  const page = parseInt(pageParam);
  
  // カテゴリ一覧を取得
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  // 作品を取得（ページネーション付き）
  const ITEMS_PER_PAGE = 12;
  
  let query = supabase
    .from('artworks')
    .select(`
      *,
      user:users(*),
      category:categories(*),
      theme:themes(*),
      likes_count:likes(count),
      comments_count:comments(count)
    `)
    .order('created_at', { ascending: false });
  
  // カテゴリーフィルター
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  // ページネーション
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  
  const { data: artworks, count: totalCount } = await query
    .range(from, to)
    .returns<ArtworkWithDetails[]>();
  
  const totalPages = totalCount ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 0;
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1>作品一覧</h1>
        <Link href="/artworks/upload" className="btn-primary">
          作品を投稿する
        </Link>
      </div>
      
      {/* カテゴリータブ */}
      <Suspense fallback={<div className="h-10 bg-gray-100 animate-pulse rounded-md" />}>
        <CategoryTabs 
          categories={categories || []} 
          selectedCategoryId={categoryId}
        />
      </Suspense>
      
      {/* 作品グリッド */}
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-md" />}>
        <ArtworkGrid artworks={artworks || []} />
      </Suspense>
      
      {/* ページネーション */}
      {totalPages > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            {page > 1 && (
              <Link
                href={{
                  pathname: '/artworks',
                  query: {
                    ...(categoryId ? { category: categoryId } : {}),
                    page: page - 1,
                  },
                }}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                前へ
              </Link>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={{
                  pathname: '/artworks',
                  query: {
                    ...(categoryId ? { category: categoryId } : {}),
                    page: pageNum,
                  },
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pageNum === page
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </Link>
            ))}
            
            {page < totalPages && (
              <Link
                href={{
                  pathname: '/artworks',
                  query: {
                    ...(categoryId ? { category: categoryId } : {}),
                    page: page + 1,
                  },
                }}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                次へ
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
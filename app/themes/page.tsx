import { Suspense } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { Theme } from '@/lib/supabase/schema';

export const revalidate = 3600; // 1時間ごとに再検証

export default async function ThemesPage() {
  const supabase = createServerSupabaseClient();
  
  // 過去のお題を取得（新しい順）
  const { data: themes } = await supabase
    .from('themes')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false });
  
  // 最新のお題
  const currentTheme = themes && themes.length > 0 ? themes[0] : null;
  // 過去のお題
  const pastThemes = themes && themes.length > 1 ? themes.slice(1) : [];
  
  return (
    <div className="space-y-8">
      <h1>月間お題</h1>
      
      {/* 最新のお題 */}
      {currentTheme ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <div className="text-sm text-primary-600 font-medium mb-1">
                現在のお題
              </div>
              <h2 className="text-2xl font-bold">「{currentTheme.title}」</h2>
            </div>
            <div className="mt-2 md:mt-0 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
              {format(new Date(currentTheme.year, currentTheme.month - 1), 'yyyy年M月', { locale: ja })}
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">{currentTheme.description}</p>
          
          <div className="flex justify-end">
            <Link
              href={`/themes/${currentTheme.id}`}
              className="text-primary-500 hover:text-primary-600"
            >
              このお題の作品を見る
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            現在のお題はまだ設定されていません。
          </p>
        </div>
      )}
      
      {/* 過去のお題一覧 */}
      <div>
        <h2 className="text-xl font-bold mb-4">過去のお題</h2>
        
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-md" />}>
          {pastThemes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pastThemes.map((theme: Theme) => (
                <div
                  key={theme.id}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">「{theme.title}」</h3>
                    <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {format(new Date(theme.year, theme.month - 1), 'yyyy年M月', { locale: ja })}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{theme.description}</p>
                  
                  <Link
                    href={`/themes/${theme.id}`}
                    className="text-sm text-primary-500 hover:underline"
                  >
                    このお題の作品を見る
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-500">過去のお題はありません。</p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
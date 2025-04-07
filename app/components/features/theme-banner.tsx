'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Theme } from '@/lib/supabase/schema';
import { useSupabase } from '@/app/providers/supabase-provider';

interface ThemeBannerProps {
  theme: Theme;
}

export default function ThemeBanner({ theme }: ThemeBannerProps) {
  const { user } = useSupabase();
  
  // 月の最終日を計算
  const lastDayOfMonth = new Date(theme.year, theme.month, 0).getDate();
  const themeDate = new Date(theme.year, theme.month - 1);
  
  return (
    <section className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <div className="text-sm text-primary-600 font-medium mb-1">
            {format(themeDate, 'yyyy年M月', { locale: ja })}のお題
          </div>
          <h2 className="text-2xl font-bold mb-2">「{theme.title}」</h2>
          <p className="text-gray-600 max-w-xl">{theme.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            締切：{theme.year}年{theme.month}月{lastDayOfMonth}日
          </p>
        </div>
        
        <div>
          {user ? (
            <Link href={`/artworks/upload?theme=${theme.id}`} className="btn-primary">
              投稿する
            </Link>
          ) : (
            <Link href="/auth/signin" className="btn-primary">
              ログインして投稿
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
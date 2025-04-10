'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSupabase } from '@/app/providers/supabase-provider';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, signOut, isLoading } = useSupabase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      // リロードして認証状態を更新
      window.location.reload();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  useEffect(() => {
    // デバッグ用: 認証状態のログ
    console.log('Header auth state:', { user, isLoading });
  }, [user, isLoading]);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            syolink
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-primary-500">
              ホーム
            </Link>
            <Link href="/artworks" className="text-gray-600 hover:text-primary-500">
              作品一覧
            </Link>
            <Link href="/themes" className="text-gray-600 hover:text-primary-500">
              月間お題
            </Link>
            {!isLoading && user ? (
              <>
                <Link href="/artworks/upload" className="btn-primary">
                  投稿する
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-600">
                    <span className="mr-1">{user.user_metadata.username || 'ユーザー'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      プロフィール
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ログアウト
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-600 hover:text-primary-500">
                  ログイン
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  会員登録
                </Link>
              </>
            )}
          </nav>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden flex items-center"
            onClick={toggleMenu}
            aria-label="メニューを開く"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* モバイルナビゲーション */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-primary-500"
                onClick={() => setIsMenuOpen(false)}
              >
                ホーム
              </Link>
              <Link
                href="/artworks"
                className="text-gray-600 hover:text-primary-500"
                onClick={() => setIsMenuOpen(false)}
              >
                作品一覧
              </Link>
              <Link
                href="/themes"
                className="text-gray-600 hover:text-primary-500"
                onClick={() => setIsMenuOpen(false)}
              >
                月間お題
              </Link>
              {!isLoading && user ? (
                <>
                  <Link
                    href="/artworks/upload"
                    className="text-primary-500 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    投稿する
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    プロフィール
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-primary-500 text-left"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-gray-600 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-primary-500 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    会員登録
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
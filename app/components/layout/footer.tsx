import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              syolink
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              書道の作品や練習のための掲示板サービス
            </p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/about" className="text-sm text-gray-600 hover:text-primary-500">
              サービスについて
            </Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-primary-500">
              利用規約
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary-500">
              プライバシーポリシー
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-primary-500">
              お問い合わせ
            </Link>
          </nav>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} syolink All rights reserved.
        </div>
      </div>
    </footer>
  );
}
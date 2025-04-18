'use client';

import { useState } from 'react';
import Link from 'next/link';

// FAQアイテムの型定義
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  // アクティブなカテゴリの状態
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // 検索クエリの状態
  const [searchQuery, setSearchQuery] = useState('');
  
  // FAQ項目
  const faqItems: FAQItem[] = [
    {
      question: 'syolinkとは何ですか？',
      answer: 'syolinkは書道愛好家のための作品共有プラットフォームです。作品を投稿したり、他のユーザーの作品を閲覧したり、月間お題に参加したりすることができます。',
      category: 'general'
    },
    {
      question: 'syolinkを利用するのに費用はかかりますか？',
      answer: '基本的な機能はすべて無料でご利用いただけます。将来的にプレミアム機能を導入する可能性がありますが、現在は無料でサービスを提供しています。',
      category: 'general'
    },
    {
      question: 'どのような書道作品を投稿できますか？',
      answer: '楷書、行書、草書、隷書、篆書などの伝統的な書体から、現代的な書道作品、ボールペン字や筆ペン字まで、幅広いスタイルの作品を投稿できます。',
      category: 'artwork'
    },
    {
      question: '1日に投稿できる作品数に制限はありますか？',
      answer: '1日に投稿できる作品数は3枚までとなっています。これは高品質な作品の共有を促し、サーバー負荷を適切に保つための制限です。',
      category: 'artwork'
    },
    {
      question: 'アップロードできる画像のサイズや形式に制限はありますか？',
      answer: '画像のサイズは5MBまで、対応フォーマットはJPG、PNG、GIFとなっています。作品が鮮明に見えるよう、できるだけ高解像度の画像をアップロードすることをお勧めします。',
      category: 'artwork'
    },
    {
      question: '月間お題とは何ですか？',
      answer: '毎月設定されるテーマに沿った作品を投稿するイベントです。月間お題に参加することで、創作意欲を高め、他のユーザーと共通のテーマで交流することができます。',
      category: 'theme'
    },
    {
      question: '月間お題の投稿期間はいつですか？',
      answer: '各月の1日から月末までが投稿期間となります。期間中は何度でも（1日3枚の制限内で）お題に沿った作品を投稿できます。',
      category: 'theme'
    },
    {
      question: 'アカウントを削除するにはどうすればよいですか？',
      answer: 'プロフィールページから「アカウント設定」を選択し、「アカウントを削除する」ボタンをクリックしてください。確認プロセスを経た後、アカウントとすべての投稿データが削除されます。',
      category: 'account'
    },
    {
      question: 'パスワードを忘れた場合はどうすればよいですか？',
      answer: 'ログインページの「パスワードをお忘れですか？」リンクをクリックし、登録しているメールアドレスを入力してください。パスワードリセット用のリンクが記載されたメールが送信されます。',
      category: 'account'
    },
    {
      question: '他のユーザーの作品にコメントするにはどうすればよいですか？',
      answer: '作品の詳細ページ下部にあるコメント欄から投稿できます。コメントは建設的かつ礼儀正しい内容を心がけてください。不適切なコメントは削除される場合があります。',
      category: 'interaction'
    },
    {
      question: '作品への「いいね」は取り消せますか？',
      answer: 'はい、いいねを付けた作品の詳細ページで再度いいねボタンをクリックすると取り消せます。いいねの数はリアルタイムで更新されます。',
      category: 'interaction'
    },
    {
      question: '投稿した作品を削除することはできますか？',
      answer: 'はい、自分の投稿した作品は削除できます。作品の詳細ページから「削除」ボタンをクリックし、確認後に削除されます。ただし、他のユーザーが保存した可能性がある点にご注意ください。',
      category: 'artwork'
    },
    {
      question: '不適切な内容の投稿やコメントを見つけた場合はどうすればよいですか？',
      answer: '各投稿やコメントには「報告」ボタンがあります。これをクリックして理由を選択すると、管理者に通報されます。迅速に対応しますのでご協力ください。',
      category: 'interaction'
    },
    {
      question: 'プロフィール画像を変更するにはどうすればよいですか？',
      answer: 'プロフィールページから「プロフィールを編集」を選択し、画像のアップロードセクションから新しい画像をアップロードできます。JPG、PNG形式で2MB以下の画像を使用してください。',
      category: 'account'
    },
    {
      question: 'syolinkは他のSNSと連携できますか？',
      answer: '現在、Twitter（X）、Facebook、Instagramへの共有機能をサポートしています。作品の詳細ページにある共有ボタンから各SNSに投稿できます。',
      category: 'general'
    }
  ];
  
  // カテゴリーの一覧
  const categories = [
    { id: 'general', name: '一般的な質問' },
    { id: 'account', name: 'アカウント' },
    { id: 'artwork', name: '作品投稿' },
    { id: 'theme', name: '月間お題' },
    { id: 'interaction', name: '交流機能' }
  ];
  
  // 検索機能
  const filterFAQs = () => {
    return faqItems.filter(item => {
      // カテゴリフィルター
      const matchesCategory = activeCategory ? item.category === activeCategory : true;
      
      // 検索クエリフィルター
      const matchesQuery = searchQuery
        ? item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      return matchesCategory && matchesQuery;
    });
  };
  
  const filteredFAQs = filterFAQs();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="mb-6">よくある質問</h1>
      
      {/* 検索バー */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="質問を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* カテゴリタブ */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeCategory === null
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveCategory(null)}
          >
            すべて
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* FAQ一覧 */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <details
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <summary className="px-6 py-4 cursor-pointer font-medium flex items-center justify-between hover:bg-gray-50">
                <span>{faq.question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </details>
          ))
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">検索結果がありません</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(null);
              }}
              className="btn-primary"
            >
              すべての質問を表示
            </button>
          </div>
        )}
      </div>
      
      {/* 問い合わせCTA */}
      <div className="mt-12 bg-primary-50 border border-primary-100 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-2">お探しの質問が見つかりませんでしたか？</h2>
        <p className="text-gray-600 mb-4">
          お気軽にお問い合わせください。サポートチームがお答えします。
        </p>
        <Link href="/contact" className="btn-primary">
          お問い合わせる
        </Link>
      </div>
    </div>
  );
}
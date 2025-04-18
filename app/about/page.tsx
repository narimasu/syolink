import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="mb-6">サービスについて</h1>
      
      {/* ヒーローセクション */}
      <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-8 mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold mb-4">
              syolinkとは
            </h2>
            <p className="text-gray-600 mb-4">
              syolinkは、書道愛好家のための作品共有プラットフォームです。
              書道の伝統と現代のテクノロジーを融合させ、新しい形の書道コミュニティを創造します。
            </p>
            <p className="text-gray-600">
              初心者から専門家まで、すべての書道愛好家が集まり、作品を共有し、
              お互いからインスピレーションを得ることができる場所を目指しています。
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src="/images/about/calligraphy-hero.jpg"
                alt="書道作品"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* ミッションセクション */}
      <section className="bg-primary-50 rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          ミッション
        </h2>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-gray-600 mb-4">
            私たちのミッションは、書道の美と価値を広め、
            デジタル時代においても筆の文化を守り、発展させることです。
          </p>
          <p className="text-gray-600">
            技術や年齢、地域を超えて、すべての書道愛好家が
            つながり、学び合い、高め合える場所を提供します。
          </p>
        </div>
      </section>
      
      {/* 特徴セクション */}
      <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          サービスの特徴
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">月間お題</h3>
            <p className="text-gray-600">
              毎月新しいテーマで書道に挑戦し、
              技術を高め、新しい表現を探求できます。
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">コミュニティ</h3>
            <p className="text-gray-600">
              同じ趣味を持つ仲間と交流し、
              互いの作品にコメントやいいねで刺激し合えます。
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">ポートフォリオ</h3>
            <p className="text-gray-600">
              自分の作品を整理し、成長の記録として
              いつでも振り返ることができます。
            </p>
          </div>
        </div>
      </section>
      
      {/* チームセクション */}
      <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          チーム紹介
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">山田 太郎</h3>
            <p className="text-gray-500 mb-2">創設者 & 開発者</p>
            <p className="text-gray-600 text-sm">
              書道歴15年。テクノロジーと伝統文化の融合に情熱を持つエンジニア。
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">鈴木 花子</h3>
            <p className="text-gray-500 mb-2">UIデザイナー</p>
            <p className="text-gray-600 text-sm">
              伝統とモダンを融合させた使いやすいデザインを追求しています。
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">佐藤 健</h3>
            <p className="text-gray-500 mb-2">コンテンツマネージャー</p>
            <p className="text-gray-600 text-sm">
              書道家として20年以上の経験を持ち、月間お題の選定を担当しています。
            </p>
          </div>
        </div>
      </section>
      
      {/* ヒストリーセクション */}
      <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          サービスの歩み
        </h2>
        
        <div className="space-y-6">
          <div className="flex">
            <div className="flex-shrink-0 w-24 text-center">
              <div className="font-bold">2021年</div>
              <div className="text-gray-500 text-sm">4月</div>
            </div>
            <div className="flex-grow pl-6 border-l border-gray-200">
              <h3 className="text-lg font-bold mb-1">アイデア誕生</h3>
              <p className="text-gray-600">
                コロナ禍で自宅での書道練習が増え、作品を共有できる場所の必要性を感じてプロジェクト構想が始まる。
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-24 text-center">
              <div className="font-bold">2021年</div>
              <div className="text-gray-500 text-sm">9月</div>
            </div>
            <div className="flex-grow pl-6 border-l border-gray-200">
              <h3 className="text-lg font-bold mb-1">プロトタイプ開発</h3>
              <p className="text-gray-600">
                小規模なベータ版の開発を開始し、基本機能の実装に着手。
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-24 text-center">
              <div className="font-bold">2022年</div>
              <div className="text-gray-500 text-sm">3月</div>
            </div>
            <div className="flex-grow pl-6 border-l border-gray-200">
              <h3 className="text-lg font-bold mb-1">クローズドベータ開始</h3>
              <p className="text-gray-600">
                限定ユーザーによるテスト運用を開始し、フィードバックを収集。
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-24 text-center">
              <div className="font-bold">2022年</div>
              <div className="text-gray-500 text-sm">9月</div>
            </div>
            <div className="flex-grow pl-6 border-l border-gray-200">
              <h3 className="text-lg font-bold mb-1">オープンベータリリース</h3>
              <p className="text-gray-600">
                一般ユーザーにもサービスを公開し、本格的な運用を開始。
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-24 text-center">
              <div className="font-bold">2023年</div>
              <div className="text-gray-500 text-sm">1月</div>
            </div>
            <div className="flex-grow pl-6 border-l border-gray-200">
              <h3 className="text-lg font-bold mb-1">正式リリース</h3>
              <p className="text-gray-600">
                ユーザーからのフィードバックを反映し、大幅なアップデートと共に正式版をリリース。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="bg-primary-50 rounded-lg shadow-sm p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          あなたの書道作品を世界へ
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          syolinkで作品を共有し、他の書道愛好家と交流しませんか？
          今すぐ会員登録して、あなたの書の旅を始めましょう。
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/auth/signup" className="btn-primary">
            会員登録する
          </Link>
          <Link href="/artworks" className="btn-secondary">
            作品を見る
          </Link>
        </div>
      </section>
    </div>
  );
}
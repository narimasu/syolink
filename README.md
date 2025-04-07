# syolink - 書道掲示板サービス

syolinkは書道愛好家のための作品共有プラットフォームです。書道作品を投稿し、月間お題に参加し、他のユーザーと交流することができます。

## 機能

- ユーザー認証（サインアップ、ログイン、プロフィール管理）
- 作品投稿（画像アップロード、カテゴリ選択、説明追加）
- 月間お題（毎月のテーマに沿った作品投稿）
- カテゴリ別閲覧（楷書、行書、草書、ボールペンなど）
- インタラクション（いいね、コメント）
- 管理者機能（お題設定、コンテンツ管理）

## 技術スタック

- **フロントエンド**: Next.js 15, Tailwind CSS
- **バックエンド**: Vercel Serverless Functions, Supabase
- **認証**: Supabase Auth
- **データベース**: PostgreSQL (Supabase)
- **ストレージ**: Supabase Storage

## セットアップ方法

### 前提条件

- Node.js 18.17以上
- npm または yarn
- Supabaseアカウント
- Vercelアカウント（デプロイ用）

### ローカル開発環境のセットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/syolink.git
cd syolink
```

2. 依存関係をインストール
```bash
npm install
# または
yarn install
```

3. 環境変数の設定
`.env.local.example` ファイルをコピーして `.env.local` を作成し、必要な環境変数を設定します。
```bash
cp .env.local.example .env.local
```

4. Supabaseのセットアップ
   - Supabaseでプロジェクトを作成
   - `supabase/setup.sql` ファイルの内容をSQL Editorで実行
   - Storage > Buckets で `artworks` バケットを作成し、適切なポリシーを設定

5. 開発サーバーを起動
```bash
npm run dev
# または
yarn dev
```

6. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

### Vercelへのデプロイ

1. GitHubにリポジトリをプッシュ
2. Vercelダッシュボードでリポジトリを接続してデプロイ
3. 環境変数を設定（Supabase URLとキー）

## 利用上の制限

- 1日あたりの投稿数は3枚まで
- 画像アップロードのサイズ制限は5MBまで
- サポートしているファイル形式: JPG, PNG, GIF

## ライセンス

MIT License



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

-- Supabaseセットアップスクリプト
-- このSQLをSupabaseのSQL Editorで実行することでデータベースの初期設定を行います

-- ユーザーテーブル拡張
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- カテゴリーテーブル
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- 月間お題テーブル
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(month, year)
);

-- 作品テーブル
CREATE TABLE IF NOT EXISTS public.artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  theme_id UUID REFERENCES public.themes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- いいねテーブル
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  artwork_id UUID REFERENCES public.artworks(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, artwork_id)
);

-- コメントテーブル
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  artwork_id UUID REFERENCES public.artworks(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS (Row Level Security) ポリシーの設定
-- すべてのテーブルにセキュリティポリシーを適用

-- ユーザーテーブルのRLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ユーザー自身のデータを読み書きできるポリシー
CREATE POLICY "ユーザーは自分自身のデータを更新できる" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- すべてのユーザーが他のユーザーのプロフィールを閲覧できるポリシー
CREATE POLICY "ユーザープロフィールは誰でも閲覧可能" ON public.users
  FOR SELECT USING (true);

-- カテゴリーテーブルのRLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- カテゴリーは誰でも閲覧可能
CREATE POLICY "カテゴリーは誰でも閲覧可能" ON public.categories
  FOR SELECT USING (true);

-- カテゴリーは管理者のみが管理可能
CREATE POLICY "カテゴリーは管理者のみが作成可能" ON public.categories
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "カテゴリーは管理者のみが更新可能" ON public.categories
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "カテゴリーは管理者のみが削除可能" ON public.categories
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- 月間お題テーブルのRLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- お題は誰でも閲覧可能
CREATE POLICY "お題は誰でも閲覧可能" ON public.themes
  FOR SELECT USING (true);

-- お題は管理者のみが管理可能
CREATE POLICY "お題は管理者のみが作成可能" ON public.themes
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "お題は管理者のみが更新可能" ON public.themes
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "お題は管理者のみが削除可能" ON public.themes
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- 作品テーブルのRLS
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- 作品は誰でも閲覧可能
CREATE POLICY "作品は誰でも閲覧可能" ON public.artworks
  FOR SELECT USING (true);

-- 作品は認証済みユーザーのみが投稿可能
CREATE POLICY "作品は認証済みユーザーのみが投稿可能" ON public.artworks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 作品は作成者のみが更新・削除可能
CREATE POLICY "作品は作成者のみが更新可能" ON public.artworks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "作品は作成者のみが削除可能" ON public.artworks
  FOR DELETE USING (auth.uid() = user_id);

-- いいねテーブルのRLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- いいねは誰でも閲覧可能
CREATE POLICY "いいねは誰でも閲覧可能" ON public.likes
  FOR SELECT USING (true);

-- いいねは認証済みユーザーのみが追加可能
CREATE POLICY "いいねは認証済みユーザーのみが追加可能" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- いいねは作成者のみが削除可能
CREATE POLICY "いいねは作成者のみが削除可能" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- コメントテーブルのRLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- コメントは誰でも閲覧可能
CREATE POLICY "コメントは誰でも閲覧可能" ON public.comments
  FOR SELECT USING (true);

-- コメントは認証済みユーザーのみが投稿可能
CREATE POLICY "コメントは認証済みユーザーのみが投稿可能" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- コメントは作成者のみが更新・削除可能
CREATE POLICY "コメントは作成者のみが更新可能" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "コメントは作成者のみが削除可能" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- トリガー: ユーザーが新規登録されたら自動的にpublic.usersに登録
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, avatar_url)
  VALUES (new.id, new.email, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 初期データ: カテゴリー
INSERT INTO public.categories (name, description)
VALUES
  ('楷書', '整った形の書体で、初心者にも書きやすい'),
  ('行書', '楷書と草書の中間的な書体で、日常的によく使われる'),
  ('草書', '流れるような書体で、熟練者向け'),
  ('隷書', '漢字の古い書体の一つで、横画が長く強調される'),
  ('篆書', '印鑑などに使われる最も古い漢字の書体'),
  ('ボールペン', 'ボールペンを使った書'),
  ('筆ペン', '筆ペンを使った書'),
  ('硬筆', '鉛筆や万年筆などを使った書'),
  ('その他', 'その他の書体や道具を使った書')
ON CONFLICT (id) DO NOTHING;

-- 初期データ: 現在の月のお題（存在しない場合のみ）
DO $$
DECLARE
  current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
  current_month INTEGER := EXTRACT(MONTH FROM CURRENT_DATE);
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.themes WHERE year = current_year AND month = current_month) THEN
    INSERT INTO public.themes (title, description, year, month)
    VALUES ('春風', '春の風を感じる書を表現してみましょう。', current_year, current_month);
  END IF;
END $$;

-- ストレージバケットのポリシー設定は管理コンソールから行う必要があります
-- 1. Storage > Buckets > New Bucket で "artworks" という名前の新しいバケットを作成
-- 2. RLS ポリシーとして以下を設定：
--    - 認証されたユーザーのみがファイルをアップロードできる
--    - すべてのユーザーがファイルを閲覧できる
--    - ファイルの所有者のみがファイルを削除できる
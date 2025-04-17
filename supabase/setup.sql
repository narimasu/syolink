-- Supabaseセットアップスクリプト
-- まずテーブル構造を設定

-- ユーザープロフィールテーブル
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- カテゴリーテーブル
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- 月間お題テーブル
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(month, year)
);

-- 作品テーブル
CREATE TABLE IF NOT EXISTS public.artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category_id UUID NOT NULL,
  theme_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (theme_id) REFERENCES public.themes(id) ON DELETE SET NULL
);

-- いいねテーブル
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  artwork_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES public.artworks(id) ON DELETE CASCADE,
  UNIQUE(user_id, artwork_id)
);

-- コメントテーブル
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  artwork_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES public.artworks(id) ON DELETE CASCADE
);

-- テーブル権限の設定
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS (Row Level Security) ポリシー

-- ユーザーテーブルのポリシー
CREATE POLICY "ユーザーは自身のプロフィールを更新可能" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "ユーザープロフィールは誰でも閲覧可能" 
ON public.users FOR SELECT 
USING (true);

-- カテゴリーテーブルのポリシー
CREATE POLICY "カテゴリーは誰でも閲覧可能" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "カテゴリーは管理者のみ作成可能" 
ON public.categories FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "カテゴリーは管理者のみ更新可能" 
ON public.categories FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "カテゴリーは管理者のみ削除可能" 
ON public.categories FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 月間お題テーブルのポリシー
CREATE POLICY "お題は誰でも閲覧可能" 
ON public.themes FOR SELECT 
USING (true);

CREATE POLICY "お題は管理者のみ作成可能" 
ON public.themes FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "お題は管理者のみ更新可能" 
ON public.themes FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "お題は管理者のみ削除可能" 
ON public.themes FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 作品テーブルのポリシー
CREATE POLICY "作品は誰でも閲覧可能" 
ON public.artworks FOR SELECT 
USING (true);

CREATE POLICY "作品は認証済みユーザーのみ投稿可能" 
ON public.artworks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "作品は作成者のみ更新可能" 
ON public.artworks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "作品は作成者のみ削除可能" 
ON public.artworks FOR DELETE 
USING (auth.uid() = user_id);

-- いいねテーブルのポリシー
CREATE POLICY "いいねは誰でも閲覧可能" 
ON public.likes FOR SELECT 
USING (true);

CREATE POLICY "いいねは認証済みユーザーのみ追加可能" 
ON public.likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "いいねは作成者のみ削除可能" 
ON public.likes FOR DELETE 
USING (auth.uid() = user_id);

-- コメントテーブルのポリシー
CREATE POLICY "コメントは誰でも閲覧可能" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "コメントは認証済みユーザーのみ投稿可能" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "コメントは作成者のみ更新可能" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "コメントは作成者のみ削除可能" 
ON public.comments FOR DELETE 
USING (auth.uid() = user_id);

-- ユーザー登録時の自動処理用関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, avatar_url)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 既存のトリガーを削除してから作成（冪等性を保つため）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 初期データの挿入
-- カテゴリー
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
ON CONFLICT (name) DO NOTHING;

-- 現在の月のお題を追加（存在しない場合のみ）
DO $$
DECLARE
  current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
  current_month INTEGER := EXTRACT(MONTH FROM CURRENT_DATE);
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.themes 
    WHERE year = current_year AND month = current_month
  ) THEN
    INSERT INTO public.themes (title, description, year, month)
    VALUES (
      CASE
        WHEN current_month = 1 THEN '初春'
        WHEN current_month = 2 THEN '梅花'
        WHEN current_month = 3 THEN '春風'
        WHEN current_month = 4 THEN '桜花'
        WHEN current_month = 5 THEN '新緑'
        WHEN current_month = 6 THEN '涼風'
        WHEN current_month = 7 THEN '夏空'
        WHEN current_month = 8 THEN '夕立'
        WHEN current_month = 9 THEN '秋月'
        WHEN current_month = 10 THEN '紅葉'
        WHEN current_month = 11 THEN '晩秋'
        WHEN current_month = 12 THEN '初雪'
      END,
      CASE
        WHEN current_month = 1 THEN '新しい年の始まりを表現する書'
        WHEN current_month = 2 THEN '梅の花のような繊細さを表現する書'
        WHEN current_month = 3 THEN '春の風を感じさせる書'
        WHEN current_month = 4 THEN '桜の美しさを表現する書'
        WHEN current_month = 5 THEN '若葉の生命力を表現する書'
        WHEN current_month = 6 THEN '涼やかな風を感じさせる書'
        WHEN current_month = 7 THEN '夏の青空を表現する書'
        WHEN current_month = 8 THEN '夏の雷雨の力強さを表現する書'
        WHEN current_month = 9 THEN '秋の月の静けさを表現する書'
        WHEN current_month = 10 THEN '秋の紅葉の美しさを表現する書'
        WHEN current_month = 11 THEN '秋の終わりを感じさせる書'
        WHEN current_month = 12 THEN '初雪の静けさを表現する書'
      END,
      current_year,
      current_month
    );
  END IF;
END $$;

-- 管理者ユーザーの設定（開発用）
-- 注意: 実際の運用では手動で設定するか、別の方法で管理者を設定することを推奨
DO $$
DECLARE
  admin_email TEXT := 'admin@example.com';
  admin_exists BOOLEAN;
BEGIN
  -- 管理者ユーザーが存在するか確認
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE email = admin_email AND role = 'admin'
  ) INTO admin_exists;
  
  -- 存在しない場合は更新（auth.usersに既に存在することが前提）
  IF NOT admin_exists THEN
    UPDATE public.users
    SET role = 'admin'
    WHERE email = admin_email;
  END IF;
END $$;
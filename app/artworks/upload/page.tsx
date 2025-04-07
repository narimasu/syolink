'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase/client';
import { useSupabase } from '@/app/providers/supabase-provider';
import { Category, Theme } from '@/lib/supabase/schema';

type UploadFormData = {
  title: string;
  description: string;
  categoryId: string;
  themeId: string | null;
};

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeId = searchParams.get('theme');
  const { user, isLoading } = useSupabase();
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [dailyUploads, setDailyUploads] = useState(0);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UploadFormData>({
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      themeId: themeId || null,
    },
  });
  
  // ファイルドロップゾーン
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      
      // プレビュー用URL生成
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    },
  });

  // カテゴリーと現在のお題を取得
  useEffect(() => {
    const fetchData = async () => {
      // カテゴリー一覧を取得
      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoryData) {
        setCategories(categoryData);
        // 最初のカテゴリーをデフォルト選択
        if (categoryData.length > 0) {
          setValue('categoryId', categoryData[0].id);
        }
      }
      
      // 現在の月間お題を取得
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const { data: themeData } = await supabase
        .from('themes')
        .select('*')
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();
      
      if (themeData) {
        setCurrentTheme(themeData);
        
        // URLパラメータにthemeIdがある場合はフォームにセット
        if (themeId) {
          setValue('themeId', themeId);
        }
      }
      
      // 今日の投稿数を取得
      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count } = await supabase
          .from('artworks')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString());
        
        if (count !== null) {
          setDailyUploads(count);
        }
      }
    };
    
    fetchData();
  }, [user, setValue, themeId]);
  
  // 認証チェック
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin?redirect=/artworks/upload');
    }
  }, [user, isLoading, router]);
  
  const onSubmit = async (data: UploadFormData) => {
    if (!user || !uploadedFile) return;
    
    try {
      setIsSubmitting(true);
      
      // Storage にファイルをアップロード
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `uploads/${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, uploadedFile, {
          upsert: false, // 既存ファイルを上書きしない
          contentType: uploadedFile.type // ファイルの正しいコンテンツタイプを設定
        });
        
      // アップロード後、進捗状況を100%に設定
      setUploadProgress(100);
      
      if (uploadError) throw uploadError;
      
      // 画像の公開URLを取得
      const { data: publicUrl } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);
      
      // データベースに作品情報を保存
      const { error: insertError } = await supabase
        .from('artworks')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          image_url: publicUrl.publicUrl,
          category_id: data.categoryId,
          theme_id: data.themeId,
        });
      
      if (insertError) throw insertError;
      
      // 成功したらホームに戻る
      router.push('/');
      
    } catch (error) {
      console.error('Error uploading artwork:', error);
      alert('アップロード中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ロード中表示
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p>読み込み中...</p>
      </div>
    );
  }
  
  // 投稿制限チェック
  const isUploadLimitReached = dailyUploads >= 3;
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="mb-2">新しい作品を投稿</h1>
      <p className="text-gray-500 mb-6">本日の投稿：{dailyUploads}/3枚</p>
      
      {isUploadLimitReached ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            1日の投稿制限（3枚）に達しました。明日また投稿してください。
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 画像アップロードエリア */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作品画像 <span className="text-red-500">*</span>
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 h-64 flex flex-col items-center justify-center cursor-pointer transition ${
                  previewUrl ? 'border-primary-300 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                }`}
              >
                <input {...getInputProps()} />
                
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="プレビュー"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl(null);
                        setUploadedFile(null);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-center">
                      クリックまたはドラッグ＆ドロップで画像をアップロード
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, GIF形式（最大5MB）
                    </p>
                  </>
                )}
              </div>
              {!uploadedFile && (
                <p className="text-red-500 text-sm mt-1">
                  画像は必須です
                </p>
              )}
            </div>
            
            {/* 作品情報フォーム */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className="input"
                  {...register('title', { required: '作品タイトルは必須です' })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリー <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  className="input"
                  {...register('categoryId', { required: 'カテゴリーは必須です' })}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {currentTheme && (
                <div className="flex items-start mt-4">
                  <input
                    id="theme"
                    type="checkbox"
                    className="mt-1"
                    checked={!!themeId}
                    onChange={(e) => {
                      setValue('themeId', e.target.checked ? currentTheme.id : null);
                    }}
                  />
                  <label htmlFor="theme" className="ml-2 block text-sm text-gray-700">
                    今月のお題「{currentTheme.title}」に投稿する
                  </label>
                </div>
              )}
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  説明
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="input"
                  placeholder="作品についての説明や思いを書いてください"
                  {...register('description')}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !uploadedFile}
            >
              {isSubmitting ? '投稿中...' : '投稿する'}
            </button>
          </div>
          
          {/* アップロードプログレス */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 text-right mt-1">
                {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
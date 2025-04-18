'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        // URLからトークンハッシュと確認タイプを取得
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!tokenHash || !type) {
          setStatus('error');
          setErrorMessage('無効な確認リンクです。');
          return;
        }

        console.log('Confirming with token hash:', tokenHash, 'type:', type);

        // Supabaseの確認処理
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });

        if (error) {
          console.error('確認エラー:', error);
          setStatus('error');
          setErrorMessage(error.message || '確認に失敗しました。');
          return;
        }

        // 確認成功
        setStatus('success');

        // 5秒後にログインページにリダイレクト
        setTimeout(() => {
          router.push('/auth/signin');
        }, 5000);
      } catch (error: any) {
        console.error('処理エラー:', error);
        setStatus('error');
        setErrorMessage('確認処理中にエラーが発生しました: ' + (error.message || '不明なエラー'));
      }
    };

    handleConfirmation();
  }, [searchParams, router]);

  return (
    <div className="max-w-md mx-auto mt-10">
      {status === 'loading' && (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <h1 className="text-xl font-bold mb-4">アカウント確認中...</h1>
          <p className="text-gray-600">
            メールアドレスの確認を処理しています。しばらくお待ちください。
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg text-center">
          <h1 className="text-xl font-bold mb-4">アカウント確認完了</h1>
          <p className="mb-4">
            メールアドレスの確認が完了しました。アカウントが有効化されました。
          </p>
          <p className="text-sm mb-4">
            5秒後にログインページに移動します...
          </p>
          <Link href="/auth/signin" className="btn-primary inline-block">
            今すぐログインする
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-lg text-center">
          <h1 className="text-xl font-bold mb-4">確認エラー</h1>
          <p className="mb-4">
            {errorMessage || 'アカウント確認中にエラーが発生しました。'}
          </p>
          <p className="text-sm mb-4">
            確認リンクが有効期限切れか無効です。再度登録するか、お問い合わせください。
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup" className="btn-primary">
              新規登録する
            </Link>
            <Link href="/contact" className="btn-secondary">
              問い合わせる
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';

export default function ContactPage() {
  const { user } = useSupabase();
  
  const [name, setName] = useState(user?.user_metadata?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [inquiryType, setInquiryType] = useState('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!name || !email || !message) {
      setError('すべての必須項目を入力してください');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Supabaseのお問い合わせテーブルに保存
      // 注意: このテーブルは事前に作成しておく必要があります
      const { error: submitError } = await supabase
        .from('contacts')
        .insert({
          name,
          email,
          inquiry_type: inquiryType,
          message,
          user_id: user?.id || null,
        });
      
      if (submitError) throw submitError;
      
      // 成功
      setSuccess(true);
      
      // フォームをリセット
      if (!user) {
        setName('');
        setEmail('');
      }
      setInquiryType('general');
      setMessage('');
      
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setError('お問い合わせの送信に失敗しました。しばらくしてからもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
          <h2 className="text-lg font-medium mb-2">お問い合わせを送信しました</h2>
          <p className="mb-4">
            お問い合わせいただきありがとうございます。内容を確認の上、必要に応じてご連絡いたします。
          </p>
          <p className="text-sm mb-4">
            ご質問内容によっては、回答までにお時間をいただく場合がございます。
            何卒ご了承くださいますようお願い申し上げます。
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn-primary"
          >
            新しいお問い合わせを作成
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="mb-6">お問い合わせ</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <p className="text-gray-600 mb-6">
          ご質問、ご意見、機能のリクエストなど、お気軽にお問い合わせください。
          できる限り迅速に対応いたします。
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
                disabled={!!user}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
                disabled={!!user}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-1">
              お問い合わせ種別
            </label>
            <select
              id="inquiryType"
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="input"
            >
              <option value="general">一般的なご質問</option>
              <option value="bug">不具合の報告</option>
              <option value="feature">機能のリクエスト</option>
              <option value="account">アカウントに関するお問い合わせ</option>
              <option value="other">その他</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input"
              required
            ></textarea>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? '送信中...' : 'お問い合わせを送信'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">その他のお問い合わせ方法</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-primary-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Eメール</h3>
              <p className="text-gray-600 text-sm">
                support@syolink.example.com
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">よくある質問</h3>
              <p className="text-gray-600 text-sm">
                よくある質問については、<a href="/faq" className="text-primary-500 hover:underline">FAQページ</a>をご覧ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
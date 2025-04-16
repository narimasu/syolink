'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type SupabaseContextType = {
  user: User | null;
  isLoading: boolean;
  supabase: SupabaseClient;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>; // アカウント削除機能を追加
};

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  isLoading: true,
  supabase: {} as SupabaseClient,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  deleteAccount: async () => {}, // アカウント削除機能を追加
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // クライアントサイドのSupabaseインスタンスを作成
  const supabase = createClientSupabaseClient();
  
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        setIsLoading(true);
        console.log('Getting current user...');
        
        // 最初にセッションを確認
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Session exists:', !!sessionData.session);
        
        if (sessionData.session) {
          // セッションがある場合はユーザー情報を取得
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            console.error('Error getting current user:', error);
            setUser(null);
          } else {
            console.log('Current user found:', data.user?.email);
            setUser(data.user);
          }
        } else {
          console.log('No active session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Exception getting current user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();

    // 認証状態の変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
        router.refresh();
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with email:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message);
        throw error;
      }
      
      console.log('Sign in successful');
      router.refresh();
    } catch (error) {
      console.error('Sign in exception:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      console.log('Signing up with email:', email);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error.message);
        throw error;
      }

      console.log('Sign up successful, user created:', data.user?.id);

      // ユーザープロファイルをデータベースに追加
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            username,
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          throw profileError;
        }
        
        console.log('User profile created successfully');
      }
      
      router.refresh();
    } catch (error) {
      console.error('Sign up exception:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error.message);
        throw error;
      }
      
      console.log('Sign out successful');
      router.push('/');
    } catch (error) {
      console.error('Sign out exception:', error);
      throw error;
    }
  };

  // アカウント削除機能を追加
  const deleteAccount = async () => {
    try {
      console.log('Deleting account...');
      if (!user) {
        throw new Error('ユーザーがログインしていません');
      }

      // 1. ユーザーが投稿した作品を削除
      const { error: artworksError } = await supabase
        .from('artworks')
        .delete()
        .eq('user_id', user.id);
        
      if (artworksError) {
        console.error('Error deleting user artworks:', artworksError);
        throw artworksError;
      }
      
      // 2. ユーザーが付けたいいねを削除
      const { error: likesError } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id);
        
      if (likesError) {
        console.error('Error deleting user likes:', likesError);
        throw likesError;
      }
      
      // 3. ユーザーが投稿したコメントを削除
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('user_id', user.id);
        
      if (commentsError) {
        console.error('Error deleting user comments:', commentsError);
        throw commentsError;
      }
      
      // 4. ユーザープロフィールを削除
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);
        
      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        throw profileError;
      }
      
      // 5. Supabase Authからユーザーを削除
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id
      );
      
      if (authError) {
        console.error('Error deleting auth user:', authError);
        throw authError;
      }
      
      // 6. ログアウト処理
      await signOut();
      
      console.log('Account deleted successfully');
      router.push('/');
    } catch (error) {
      console.error('Delete account exception:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    supabase,
    signIn,
    signUp,
    signOut,
    deleteAccount, // アカウント削除機能を追加
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
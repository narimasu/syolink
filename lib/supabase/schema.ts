export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url: string | null;
          role: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          avatar_url?: string | null;
          role?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          avatar_url?: string | null;
          role?: string | null;
          created_at?: string;
        };
      };
      artworks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          image_url: string;
          category_id: string;
          theme_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          image_url: string;
          category_id: string;
          theme_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          category_id?: string;
          theme_id?: string | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
        };
      };
      themes: {
        Row: {
          id: string;
          title: string;
          description: string;
          month: number;
          year: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          month: number;
          year: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          month?: number;
          year?: number;
          created_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          artwork_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artwork_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artwork_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          artwork_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artwork_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artwork_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          inquiry_type: string;
          message: string;
          user_id: string | null;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          inquiry_type: string;
          message: string;
          user_id?: string | null;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          inquiry_type?: string;
          message?: string;
          user_id?: string | null;
          created_at?: string;
          status?: string;
        };
      };
    };
  };
};

export type User = Database['public']['Tables']['users']['Row'];
export type Artwork = Database['public']['Tables']['artworks']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Theme = Database['public']['Tables']['themes']['Row'];
export type Like = Database['public']['Tables']['likes']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Contact = Database['public']['Tables']['contacts']['Row'];

export type ArtworkWithDetails = Artwork & {
  user: User;
  category: Category;
  theme?: Theme;
  likes_count: number;
  comments_count: number;
  user_has_liked?: boolean;
};
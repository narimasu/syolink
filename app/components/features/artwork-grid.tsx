// app/components/features/artwork-grid.tsx
import ArtworkCard from './artwork-card';
import { ArtworkWithDetails } from '@/lib/supabase/schema';

interface ArtworkGridProps {
  artworks: ArtworkWithDetails[];
}

export default function ArtworkGrid({ artworks }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 mb-4">表示する作品がありません</p>
        <p className="text-sm text-gray-400">最初の投稿者になりましょう！</p>
      </div>
    );
  }

  // artworksの各要素を確認してcountプロパティを適切に処理
  const safeArtworks = artworks.map(artwork => {
    // 安全なオブジェクトを作成
    const safeArtwork = {
      ...artwork,
      likes_count: typeof artwork.likes_count === 'object' && artwork.likes_count !== null 
        ? (artwork.likes_count as any).count ?? 0
        : artwork.likes_count ?? 0,
      comments_count: typeof artwork.comments_count === 'object' && artwork.comments_count !== null 
        ? (artwork.comments_count as any).count ?? 0
        : artwork.comments_count ?? 0
    };
    
    return safeArtwork;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {safeArtworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
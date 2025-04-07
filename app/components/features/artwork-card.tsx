'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArtworkWithDetails } from '@/lib/supabase/schema';

interface ArtworkCardProps {
  artwork: ArtworkWithDetails;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link href={`/artworks/${artwork.id}`} className="card block">
      <div className="relative aspect-square mb-3 overflow-hidden bg-gray-100 rounded-md">
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      
      <h3 className="font-medium text-lg mb-1 truncate">「{artwork.title}」</h3>
      
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <span className="truncate">{artwork.user.username}</span>
        <span className="mx-1">•</span>
        <span>{format(new Date(artwork.created_at), 'MM/dd', { locale: ja })}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="badge-blue">{artwork.category.name}</span>
        {artwork.theme && (
          <span className="badge-green">今月のお題</span>
        )}
      </div>
      
      <div className="flex items-center mt-3 text-sm text-gray-500">
        <div className="flex items-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{artwork.likes_count}</span>
        </div>
        
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{artwork.comments_count}</span>
        </div>
      </div>
    </Link>
  );
}
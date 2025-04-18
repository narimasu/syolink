'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category } from '@/lib/supabase/schema';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId?: string;
}

export default function CategoryTabs({ categories, selectedCategoryId }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategoryId || null);
  const router = useRouter();

  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    
    // カテゴリー変更時のURLパラメータ更新
    if (categoryId) {
      router.push(`/artworks?category=${categoryId}`);
    } else {
      router.push('/artworks');
    }
  };

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-2 min-w-max bg-white rounded-lg p-1 shadow-sm">
        <button
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            activeCategory === null
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 hover:text-primary-500'
          }`}
          onClick={() => handleCategoryChange(null)}
        >
          すべて
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:text-primary-500'
            }`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { Grid, FlaskConical, Sparkles, Heart, Droplet } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const iconMap: { [key: string]: React.ReactElement } = {
  Grid: <Grid className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Droplet: <Droplet className="w-5 h-5" />,
};

// Cute gradient colors for each category
const categoryColors: { [key: string]: string } = {
  all: 'from-pink-400 to-pink-600',
  'weight-management': 'from-pink-500 to-pink-700',
  'fat-dissolving': 'from-amber-400 to-amber-600',
  'skin-care': 'from-pink-400 to-amber-500',
};

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex space-x-3 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-12 w-36 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="hidden md:block bg-white shadow-sm sticky top-[72px] md:top-[80px] lg:top-[88px] z-40 border-b border-gray-100">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto py-2 md:py-3 lg:py-4 scrollbar-hide">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            const gradientColor = categoryColors[category.id] || 'from-gray-400 to-gray-600';
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className={`
                  flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl font-medium whitespace-nowrap
                  transition-all duration-200 flex-shrink-0 transform hover:scale-105 text-xs sm:text-sm md:text-base
                  ${
                    isSelected
                      ? `bg-gradient-to-r ${gradientColor} text-white shadow-lg`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <span className={isSelected ? 'text-white' : 'text-gray-600'}>
                  {iconMap[category.icon] || <Grid className="w-4 h-4 md:w-5 md:h-5" />}
                </span>
                <span>{category.name}</span>
                {isSelected && (
                  <span className="ml-0.5 text-[10px] md:text-xs">✨</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Hide scrollbar for better aesthetics */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default SubNav;

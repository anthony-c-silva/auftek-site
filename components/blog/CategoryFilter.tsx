import React from 'react';
import { CategoryType } from '../../types/blog';
import { CATEGORY_DESCRIPTIONS } from '../../data/mock-blog';
import { Microscope, Zap, Cpu, Layers, Search, X } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory,
  searchQuery,
  onSearchChange
}) => {
  
  const getIcon = (cat: CategoryType) => {
    switch (cat) {
      case CategoryType.MICROBIOLOGY: return <Microscope size={20} />;
      case CategoryType.ENERGY: return <Zap size={20} />;
      case CategoryType.IOT_AI: return <Cpu size={20} />;
      default: return <Layers size={20} />;
    }
  };

  const categories = [
    CategoryType.ALL,
    CategoryType.MICROBIOLOGY,
    CategoryType.ENERGY,
    CategoryType.IOT_AI
  ];

  return (
    <div className="pt-12 pb-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          
          {/* Barra de Busca */}
          <div className="w-full max-w-xl mb-10 relative">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por tags (ex: normas, sensores, IoT)..."
                className="w-full pl-12 pr-10 py-3.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-auftek-500 focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-auftek-500 transition-colors">
                <Search size={20} />
              </div>
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Explorar por Categoria</span>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border
                  ${selectedCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-auftek-300 hover:bg-slate-50'
                  }
                `}
              >
                {getIcon(cat)}
                {cat}
              </button>
            ))}
          </div>

          {selectedCategory !== CategoryType.ALL && (
             <div className="max-w-2xl text-center animate-fadeIn">
               <p className="text-slate-600 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 inline-block">
                 {CATEGORY_DESCRIPTIONS[selectedCategory as keyof typeof CATEGORY_DESCRIPTIONS]}
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
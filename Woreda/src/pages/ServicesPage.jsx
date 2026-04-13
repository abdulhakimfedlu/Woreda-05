import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CategoryCard = ({ category }) => {
  const { language, t } = useLanguage();
  const name = language === 'am' && category.nameAm ? category.nameAm : category.name;
  const desc = language === 'am' && category.descriptionAm ? category.descriptionAm : category.description;

  return (
    <Link 
      to={`/categories/${encodeURIComponent(category.name)}`}
      className="group flex flex-col bg-white border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,180,216,0.15)] rounded-[2rem] p-8 transition-all duration-500 hover:shadow-brand/20 hover:-translate-y-2 cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-300">
          <span className="font-black text-xl">{category.categoryNumber || '#'}</span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter group-hover:text-brand transition-colors duration-300 line-clamp-1">{name}</h2>
        </div>
      </div>

      <div className="w-full h-[2px] bg-slate-50 mb-6 group-hover:bg-brand/10 transition-colors" />

      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 line-clamp-3">
          {desc || (language === 'am' ? 'በዚህ አስተዳደራዊ ምድብ ስር የሚሰጡ የተለያዩ አገልግሎቶችን ያስሱ።' : 'Explore the various services provided under this administrative category.')}
        </p>
      </div>
      
      <div className="mt-auto pt-6 border-t border-slate-50 group-hover:border-brand/10 transition-colors">
        <div className="w-full py-3 bg-slate-50 group-hover:bg-brand group-hover:text-white text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex justify-center items-center gap-2">
          {t('btn_read_more')}
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategoriesData(data);
        } else {
          console.error("Received malformed categories data:", data);
          setCategoriesData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch categories:", err);
        setLoading(false);
        setCategoriesData([]);
      });
  }, []);

  // Filter categories by search
  const filteredCategories = categoriesData.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(searchLower) ||
      (c.nameAm || '').toLowerCase().includes(searchLower) ||
      (c.description || '').toLowerCase().includes(searchLower) ||
      (c.descriptionAm || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white min-h-screen pt-4 pb-40 lg:pt-12">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-block px-6 py-2 rounded-full bg-brand/10 text-brand font-black text-[13px] uppercase tracking-[0.4em] mb-6">
            {t('services_header')}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-black leading-tight mb-10 tracking-tighter">
            {t('services_title').split(' ').slice(0, -2).join(' ')} <br />
            <span className="relative inline-block">
              {t('services_title').split(' ').slice(-2).join(' ')}
              <span
                className="absolute left-0 -bottom-2 w-full rounded-full"
                style={{
                  height: '6px',
                  background: 'linear-gradient(90deg, #00B4D8 0%, #90E0EF 50%, #00B4D8 100%)',
                  boxShadow: '0 0 16px rgba(0,180,216,0.6)',
                  borderRadius: '999px',
                  display: 'block',
                }}
              />
            </span>
          </h1>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-black/30 group-focus-within:text-brand transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t('hero_search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/5 border-2 border-transparent py-6 pl-16 pr-8 rounded-3xl text-lg font-bold text-black placeholder:text-black/20 focus:bg-white focus:border-brand focus:shadow-[0_0_40px_rgba(0,180,216,0.15)] transition-all outline-none"
            />
            <div className="absolute inset-0 rounded-3xl border-2 border-brand/0 group-hover:border-brand/20 transition-all pointer-events-none" />
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-2xl font-black text-black/20 uppercase tracking-widest animate-pulse">
              {language === 'am' ? 'በመጫን ላይ...' : 'Loading Directory...'}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-2xl font-black text-black/20 uppercase tracking-widest">
                  {language === 'am' ? 'ከፍለጋዎ ጋር የሚዛመድ ምንም ምድብ አልተገኘም' : 'No categories found matching your search'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;

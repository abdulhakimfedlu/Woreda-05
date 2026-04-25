import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FileText, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CategoryServicesPage = () => {
  const { categoryName } = useParams();
  const decodedCategoryName = decodeURIComponent(categoryName);
  const [servicesData, setServicesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/categories').then(r => r.json()),
      fetch('http://localhost:5000/api/services').then(r => r.json()),
    ]).then(([catData, servData]) => {
      setCategories(catData);
      if (Array.isArray(servData)) {
        setServicesData(servData.filter(s => s.category === decodedCategoryName));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [decodedCategoryName]);

  const currentCategory = categories.find(c => c.name === decodedCategoryName);
  const localizedCategoryName = language === 'am' && currentCategory?.nameAm ? currentCategory.nameAm : decodedCategoryName;

  const filteredServices = servicesData.filter(s => {
    const q = searchTerm.toLowerCase();
    return (
      (s.title || '').toLowerCase().includes(q) ||
      (s.titleAm || '').toLowerCase().includes(q) ||
      (s.department || '').toLowerCase().includes(q) ||
      (s.departmentAm || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white dark:bg-[#080d14] min-h-screen pt-4 pb-40 lg:pt-12 transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* Back & Heading */}
        <div className="mb-10 pt-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-black text-black/30 dark:text-white/30 hover:text-brand uppercase tracking-widest transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> {t('sd_back')}
          </Link>
          <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white leading-tight mb-4 tracking-tighter">
            {localizedCategoryName}
          </h1>
          <p className="text-xl text-black/40 dark:text-white/35 font-bold max-w-2xl">
            {language === 'am' ? 'ዝርዝር መስፈርቶችን እና አሰራሮችን ለማየት የተወሰነ አገልግሎት ይምረጡ።' : 'Browse and select a specific service to view detailed requirements and procedures.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative group mb-12">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-black/20 dark:text-white/20 group-focus-within:text-brand transition-colors" />
          </div>
          <input
            type="text"
            placeholder={t('hero_search')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent py-4 pl-14 pr-8 rounded-2xl text-base font-bold text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:bg-white dark:focus:bg-[#0d1420] focus:border-brand focus:shadow-[0_0_30px_rgba(0,180,216,0.1)] transition-all outline-none"
          />
        </div>

        {/* Services */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xl font-black text-black/20 dark:text-white/20 uppercase tracking-widest">
              {language === 'am' ? 'በመጫን ላይ...' : 'Loading Services...'}
            </p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid gap-4">
            {filteredServices.map(service => {
              const title = language === 'am' && service.titleAm ? service.titleAm : service.title;
              const dept  = language === 'am' && service.departmentAm ? service.departmentAm : service.department;
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white dark:bg-[#0d1420] border border-black/5 dark:border-white/8 rounded-2xl hover:border-brand/30 dark:hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 text-black/30 dark:text-white/30 flex items-center justify-center group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-black dark:text-white tracking-tight group-hover:text-brand transition-colors">{title}</h3>
                      <p className="text-xs font-bold text-black/30 dark:text-white/30 uppercase tracking-widest mt-1">{dept}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center gap-2 text-xs font-black text-black/25 dark:text-white/25 uppercase tracking-widest group-hover:text-brand transition-colors">
                    {t('btn_read_more')}
                    <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-black/3 dark:bg-[#0d1420] rounded-3xl border border-dashed border-black/10 dark:border-white/10">
            <FileText className="w-12 h-12 text-black/15 dark:text-white/15 mx-auto mb-4" />
            <p className="text-xl font-black text-black/20 dark:text-white/20 uppercase tracking-widest">
              {language === 'am' ? 'ምንም አገልግሎት አልተገኘም' : 'No matching services found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryServicesPage;

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
    // Fetch categories and services
    Promise.all([
      fetch('http://localhost:5000/api/categories').then(res => res.json()),
      fetch('http://localhost:5000/api/services').then(res => res.json())
    ]).then(([catData, servData]) => {
      setCategories(catData);
      if (Array.isArray(servData)) {
        const filtered = servData.filter(s => s.category === decodedCategoryName);
        setServicesData(filtered);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch data:", err);
      setLoading(false);
    });
  }, [decodedCategoryName]);

  const currentCategory = categories.find(c => c.name === decodedCategoryName);
  const localizedCategoryName = language === 'am' && currentCategory?.nameAm ? currentCategory.nameAm : decodedCategoryName;

  const filteredServices = servicesData.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (s.title || '').toLowerCase().includes(searchLower) ||
      (s.titleAm || '').toLowerCase().includes(searchLower) ||
      (s.department || '').toLowerCase().includes(searchLower) ||
      (s.departmentAm || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white min-h-screen pt-4 pb-40 lg:pt-12 animate-in fade-in duration-500">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Back Link */}
        <div className="mb-10 pt-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-brand uppercase tracking-widest transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> {t('sd_back')}
          </Link>
          
          <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-4 tracking-tighter">
            {localizedCategoryName}
          </h1>
          <p className="text-xl text-slate-400 font-bold max-w-2xl">
            {language === 'am' ? 'ዝርዝር መስፈርቶችን እና አሰራሮችን ለማየት የተወሰነ አገልግሎት ይምረጡ።' : 'Browse and select a specific service to view detailed requirements and procedures.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative group mb-12">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-300 group-focus-within:text-brand transition-colors" />
          </div>
          <input
            type="text"
            placeholder={t('hero_search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-2 border-transparent py-4 pl-14 pr-8 rounded-2xl text-base font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-brand focus:shadow-[0_0_30px_rgba(0,180,216,0.1)] transition-all outline-none"
          />
        </div>

        {/* Services List */}
        {loading ? (
          <div className="py-20 text-center">
             <p className="text-xl font-black text-slate-300 uppercase tracking-widest animate-pulse">
               {language === 'am' ? 'በመጫን ላይ...' : 'Loading Services...'}
             </p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid gap-4">
            {filteredServices.map(service => {
              const title = language === 'am' && service.titleAm ? service.titleAm : service.title;
              const dept = language === 'am' && service.departmentAm ? service.departmentAm : service.department;
              return (
              <Link 
                key={service.id}
                to={`/services/${service.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-brand transition-colors">{title}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{dept}</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-widest group-hover:text-brand transition-colors">
                  {t('btn_read_more')}
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </Link>
            )})}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
             <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="text-xl font-black text-slate-400 uppercase tracking-widest">
                {language === 'am' ? 'ምንም አገልግሎት አልተገኘም' : 'No matching services found'}
             </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryServicesPage;

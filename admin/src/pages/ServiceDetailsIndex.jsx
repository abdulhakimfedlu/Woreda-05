import React, { useState, useEffect } from 'react';
import { Search, FileText, ArrowRight, Shield, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function ServiceDetailsIndex() {
  const { language, t } = useLanguage();
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/services').then(res => res.json()),
      fetch('http://localhost:5000/api/categories').then(res => res.json())
    ])
      .then(([servicesData, categoriesData]) => {
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
        setLoading(false);
      });
  }, []);

  const handleClearDetails = async (id) => {
    if (!window.confirm(t('sd_delete_confirm'))) return;
    try {
      const response = await fetch(`http://localhost:5000/api/service-details/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success(t('sd_delete_success'));
      } else {
        toast.error(t('status_error'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('status_error'));
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.titleAm && service.titleAm.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter ? service.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
            {t('nav_service_details')}
          </h2>
          <p className="mt-1 text-sm text-slate-400 font-bold uppercase tracking-widest">
            {t('sd_index_subtitle')}
          </p>
        </div>
      </div>

      {/* Search & Info Banner */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:flex-1 flex flex-col sm:flex-row gap-4 bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text" 
              placeholder={t('services_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all"
            />
          </div>
          <div className="sm:w-64">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8] transition-all appearance-none cursor-pointer text-slate-700"
            >
              <option value="">{t('sd_category_filter')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {language === 'am' && cat.nameAm ? cat.nameAm : cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full lg:w-[400px] bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4 items-start shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-amber-700">
               {t('sd_what_is_this')}
            </h4>
            <p className="text-xs font-bold text-amber-600/70 mt-1 leading-relaxed">
               {t('sd_info_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-widest animate-pulse">
            {t('status_loading')}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-widest">
            {t('services_no_search_results')}
          </div>
        ) : (
          filteredServices.map(service => (
            <div key={service.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-[#00B4D8]/10 hover:border-[#00B4D8]/30 transition-all group relative overflow-hidden flex flex-col h-full">
              
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 group-hover:bg-[#00B4D8]/10 group-hover:text-[#00B4D8] group-hover:border-[#00B4D8]/20 transition-all shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-black px-2 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-widest">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-800 text-base tracking-tight group-hover:text-[#00B4D8] transition-colors leading-tight line-clamp-2">
                    {language === 'am' && service.titleAm ? service.titleAm : service.title}
                  </h3>
                </div>
              </div>

              <div className="mt-auto pt-5 border-t border-slate-50 flex gap-2">
                <Link 
                  to={`/service-details/${service.id}`}
                  className="flex-1 flex justify-center items-center p-3 rounded-xl bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-all group/btn"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                     <Edit2 className="w-3.5 h-3.5" />
                     {t('btn_edit')}
                  </span>
                </Link>
                <button 
                  onClick={() => handleClearDetails(service.id)}
                  className="w-11 h-11 flex justify-center items-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  title={t('sd_clear')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Camera, Calendar, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const GalleryCard = ({ item, onClick }) => {
  const { language } = useLanguage();
  const title = language === 'am' && item.titleAm ? item.titleAm : item.title;

  return (
    <div
      onClick={() => onClick(item)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl aspect-[4/3] bg-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Image */}
      <img 
        src={item.url} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Zoom Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[2px]">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
          <ZoomIn className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">

        <h3 className="text-base font-black text-white leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-[10px] text-white/60 font-bold mt-1 uppercase tracking-tighter">
          {item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A')}
        </p>
      </div>
    </div>
  );
};

const Lightbox = ({ item, onClose }) => {
  const { language, t } = useLanguage();
  if (!item) return null;
  
  const title = language === 'am' && item.titleAm ? item.titleAm : item.title;
  const description = language === 'am' && item.descriptionAm ? item.descriptionAm : (item.description || "This image was captured and uploaded by the Woreda 05 administration to document the progress and spirit of our community projects.");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors shadow-lg"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Area */}
          <div className="md:w-2/3 h-[300px] md:h-[500px] bg-slate-900 border-r border-slate-100">
             <img 
              src={item.url} 
              alt={title} 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Content */}
          <div className="md:w-1/3 p-8 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-brand/10 rounded-full text-[9px] font-black text-brand uppercase tracking-widest">
                <Tag className="w-2.5 h-2.5" /> {language === 'am' ? 'ሚዲያ' : 'Media'}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-black/5 rounded-full text-[9px] font-black text-black/40 uppercase tracking-widest">
                <Calendar className="w-2.5 h-2.5" /> {item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A')}
              </span>
            </div>
            <h2 className="text-2xl font-black text-black mb-3 tracking-tighter leading-snug">{title}</h2>
            <p className="text-sm text-black/50 font-medium leading-relaxed flex-1">
               {description}
            </p>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
               <a 
                 href={item.url} 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline"
               >
                 {language === 'am' ? 'ዋናውን ምስል ይመልከቱ' : 'View Original'}
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch('http://localhost:5000/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGalleryItems(data);
        } else {
          console.error("Malformed gallery data:", data);
          setGalleryItems([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching gallery:", err);
        setGalleryItems([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white min-h-screen pt-4 pb-40 lg:pt-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14 pt-4">
          <div className="inline-block px-6 py-2 rounded-full bg-brand/10 text-brand font-black text-[10px] uppercase tracking-[0.4em] mb-6">
            {t('hero_welcome')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-black leading-tight mb-4 tracking-tighter">
            {t('gallery_header').split(' ')[0]}
            <br />
            <span className="relative inline-block">
              {t('gallery_header').split(' ').slice(1).join(' ')}
              <span
                className="absolute left-0 -bottom-2 w-full rounded-full"
                style={{
                  height: '6px',
                  background: 'linear-gradient(90deg, #00B4D8 0%, #90E0EF 50%, #00B4D8 100%)',
                  boxShadow: '0 0 16px rgba(0,180,216,0.6)',
                  borderRadius: '999px',
                  display: 'block'
                }}
              />
            </span>
          </h1>
          <p className="text-base text-black/40 font-bold max-w-xl mx-auto mt-6">
            {language === 'am' ? 'ወረዳ 05ን የሚቀርጹ ዝግጅቶች፣ ተግባራት እና ትልልቅ ስኬቶች የእይታ ጉዞ።' : 'A visual journey through the events, initiatives, and milestones shaping Woreda 05.'}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-brand" />
            <span className="text-sm font-black text-black/40 uppercase tracking-widest">
              {galleryItems.length} {language === 'am' ? 'ፎቶዎች' : (galleryItems.length === 1 ? 'Photo' : 'Photos')}
            </span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
           <div className="py-24 text-center">
            <p className="text-xl font-black text-black/20 uppercase tracking-widest animate-pulse">
               {language === 'am' ? 'ፎቶዎችን በመጫን ላይ...' : 'Loading gallery images...'}
            </p>
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.filter(item => item != null).map(item => (
              <GalleryCard key={item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <Camera className="w-12 h-12 text-black/10 mx-auto mb-4" />
            <p className="text-xl font-black text-black/20 uppercase tracking-widest">
               {language === 'am' ? 'በጋለሪ ውስጥ ምንም ፎቶ አልተገኘም' : 'No photos found in the gallery'}
            </p>
          </div>
        )}

      </div>

      {/* Lightbox */}
      <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default GalleryPage;

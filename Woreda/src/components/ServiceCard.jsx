import React from 'react';

const ServiceCard = ({ title, description, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-[#0d1420] p-10 rounded-2xl border border-black/5 dark:border-white/8 shadow-sm flex flex-col gap-6 transition-all duration-500 hover:shadow-2xl hover:shadow-brand/10 hover:-translate-y-2 group cursor-pointer ${className}`}>
      <div className="w-12 h-1 bg-brand/20 group-hover:w-full group-hover:bg-brand transition-all duration-500 rounded-full" />
      <div>
        <h3 className="text-2xl font-bold mb-4 text-black dark:text-white group-hover:text-brand transition-colors duration-300">
          {title}
        </h3>
        <p className="text-black/60 dark:text-white/40 leading-relaxed font-medium line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;

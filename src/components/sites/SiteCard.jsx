import React from 'react';
import { useNavigate } from 'react-router-dom';

const SiteCard = ({ imageSrc, imageAlt, typeTag, title, description, url, distance }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden group">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {typeTag && (
          <div className="absolute top-4 left-4 bg-[#210000] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-sm">
            {typeTag}
          </div>
        )}
        {distance !== undefined && (
          <div className="absolute top-4 right-4 bg-white/95 text-[#210000] text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-md backdrop-blur-sm shadow-[#210000]/10">
            {distance} km
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-8">
        <h3 className="font-serif font-bold text-xl text-[#210000] mb-4">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1 font-sans">
          {description}
        </p>
        <button
          onClick={() => url ? navigate(url) : null}
          className="w-full bg-[#2a0e0e] text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#1a0808] transition-colors flex items-center justify-center gap-2"
        >
          Explore Now
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
};

export default SiteCard;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export default function ComicCard({ comic, variant = 'default' }: { key?: React.Key, comic: any, variant?: 'default' | 'featured' }) {
  const location = useLocation();
  const imageUrl = comic.image ? comic.image : 'https://picsum.photos/400/600';
  
  let slug = 'comic';
  try {
    const urlObj = new URL(comic.url);
    const titleNo = urlObj.searchParams.get('title_no');
    const isCanvas = comic.url.includes('/canvas/') || comic.url.includes('/challenge/');
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const slugBase = pathParts[pathParts.length - 2] || 'comic';
    slug = `${isCanvas ? 'c-' : ''}${slugBase}-${titleNo}`;
  } catch (e) {
    // fallback
  }
  
  const detailUrl = `/comic/${slug}`;

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 220, damping: 30, mass: 0.7 }}
        className="shrink-0 w-64 snap-start"
      >
        <Link to={detailUrl} state={{ from: location.pathname + location.search }} className="block group relative rounded-xl overflow-hidden aspect-[4/5] bg-neutral-900 border border-neutral-800/50 shadow-lg">
           <img src={imageUrl} alt={comic.title} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-xs font-semibold text-yellow-400 mb-1">{comic.genre}</span>
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{comic.title}</h3>
              <p className="text-neutral-300 text-xs mt-1 line-clamp-1">{comic.author}</p>
           </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.7 }}
      className="block"
    >
      <Link to={detailUrl} state={{ from: location.pathname + location.search }} className="block group">
        <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-neutral-900 mb-2 border border-neutral-800/30 shadow-md">
           <img src={imageUrl} alt={comic.title} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
           <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-medium text-white border border-neutral-800/30">
             {comic.genre}
           </div>
        </div>
        <h3 className="text-sm font-semibold text-neutral-200 leading-tight line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300">{comic.title}</h3>
        <p className="text-neutral-400 text-xs mt-0.5 line-clamp-1">{comic.author}</p>
      </Link>
    </motion.div>
  )
        }

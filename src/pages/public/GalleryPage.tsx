import {useEffect, useState} from 'react';
import {ChevronLeft, ChevronRight, X, Image as ImageIcon} from 'lucide-react';
import {useSpecteQ} from '../../lib/store';
import {ResilientImage} from '../../components/ResilientImage';
import type {GalleryItem} from '../../types/specteq';

const GALLERY_CATEGORIES = ['All', 'Arena Finals', 'Hardware & Prototyping', 'Training Workshops'] as const;

export function GalleryPage() {
  const {gallery} = useSpecteQ();
  const [filter, setFilter] = useState<(typeof GALLERY_CATEGORIES)[number]>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered: GalleryItem[] =
    filter === 'All' ? gallery : gallery.filter((item) => item.category === filter);

  const activeItem = activeIndex !== null ? filtered[activeIndex] ?? null : null;

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === null ? null : (prev + 1) % filtered.length));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev === null ? null : (prev - 1 + filtered.length) % filtered.length));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, filtered.length]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-indigo-400 uppercase">SpecteQ Archive</p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
            Competition Gallery
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-300">
            Photographs from past robotics arena heats, prototyping benches, and engineering training workshops.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#0b0d17] p-1.5">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setFilter(cat);
                setActiveIndex(null);
              }}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap min-h-[38px] ${
                filter === cat
                  ? 'bg-white text-zinc-950'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-[#0b0d17] p-14 text-center space-y-3">
          <ImageIcon className="h-10 w-10 text-zinc-500 mx-auto" />
          <h2 className="font-display text-xl font-bold text-white">No photos in this category</h2>
          <p className="text-sm text-zinc-400">Try selecting another category filter to view competition photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className="group text-left rounded-xl overflow-hidden border border-zinc-800 bg-[#0b0d17] hover:border-indigo-400/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#070810]">
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <p className="font-mono text-xs text-indigo-300">
                  {item.category} · {item.year}
                </p>
                <h2 className="font-display text-lg font-bold text-white">{item.title}</h2>
                <p className="text-sm text-zinc-400 line-clamp-2">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close lightbox"
            className="absolute right-4 top-4 rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 text-zinc-200 hover:text-white min-h-[44px] min-w-[44px]"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex - 1 + filtered.length) % filtered.length)}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 rounded-lg border border-zinc-700 bg-zinc-900/90 p-3 text-white hover:border-indigo-400 min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="max-w-4xl w-full space-y-4 px-10 sm:px-14">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#070810]">
              <ResilientImage
                src={activeItem.imageUrl}
                alt={activeItem.title}
                loading="eager"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <div>
                <p className="font-mono text-xs text-indigo-300">
                  {activeItem.category} · {activeItem.year}
                </p>
                <h3 className="font-display text-xl font-bold text-white">{activeItem.title}</h3>
                <p className="text-zinc-300">{activeItem.caption}</p>
              </div>
              <span className="font-mono text-xs text-zinc-400 tabular-nums shrink-0">
                {activeIndex + 1} / {filtered.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex + 1) % filtered.length)}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 rounded-lg border border-zinc-700 bg-zinc-900/90 p-3 text-white hover:border-indigo-400 min-h-[44px] min-w-[44px]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

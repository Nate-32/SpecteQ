import {useEffect, useRef, useState} from 'react';
import {Cpu} from 'lucide-react';
import {assetUrl} from '../lib/assets';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  fallbackTitle,
}: ResilientImageProps) {
  const resolvedSrc = assetUrl(src);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [resolvedSrc]);

  const handleLoad = () => {
    const img = imgRef.current;
    if (img && typeof img.decode === 'function') {
      img
        .decode()
        .catch(() => {})
        .finally(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  };

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-[#0d1020] to-[#06070d] border border-indigo-400/20 text-zinc-400 p-4 ${className}`}
      >
        <Cpu className="h-8 w-8 text-indigo-400/70 mb-2" />
        <span className="text-xs font-medium text-center text-zinc-300">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={resolvedSrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      referrerPolicy="no-referrer"
      onLoad={handleLoad}
      onError={() => setFailed(true)}
      className={`transition-opacity duration-300 ${className} ${loaded ? '' : '!opacity-0'}`}
    />
  );
}

import {useState} from 'react';
import {Cpu} from 'lucide-react';
import {assetUrl} from '../lib/assets';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallbackTitle,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-[#0d1428] to-slate-950 border border-cyan-500/20 text-slate-400 p-4 ${className}`}
      >
        <Cpu className="h-8 w-8 text-cyan-400/70 mb-2" />
        <span className="text-xs font-medium text-center text-slate-300">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={assetUrl(src)}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

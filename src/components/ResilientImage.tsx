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
      src={assetUrl(src)}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

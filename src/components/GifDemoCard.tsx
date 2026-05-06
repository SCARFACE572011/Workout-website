'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, ImageOff } from 'lucide-react';

interface GifDemoCardProps {
  gifUrl: string;
  demoAltText: string;
  exerciseName: string;
  compact?: boolean;
}

export default function GifDemoCard({
  gifUrl,
  demoAltText,
  exerciseName,
  compact = false,
}: GifDemoCardProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!exerciseName) return;

    const cacheKey = `gif_${exerciseName}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setResolvedUrl(cached);
      return;
    }

    // Try static asset first (fast path for local GIFs)
    if (gifUrl) {
      fetch(gifUrl, { method: 'HEAD' })
        .then((r) => {
          if (r.ok) {
            localStorage.setItem(cacheKey, gifUrl);
            setResolvedUrl(gifUrl);
          } else {
            fetchFromApi();
          }
        })
        .catch(fetchFromApi);
    } else {
      fetchFromApi();
    }

    function fetchFromApi() {
      fetch(`/api/gif?name=${encodeURIComponent(exerciseName)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.gifUrl) {
            localStorage.setItem(cacheKey, data.gifUrl);
            setResolvedUrl(data.gifUrl);
          }
          // else leave resolvedUrl null → placeholder renders
        })
        .catch(() => {
          // silent — placeholder renders
        });
    }
  }, [exerciseName, gifUrl]);

  const height = compact ? 'h-36' : 'h-52';

  if (hasError || !resolvedUrl) {
    return (
      <div
        className={`${height} rounded-xl bg-[#0f0f0f] border border-white/[0.06] flex flex-col items-center justify-center gap-2 relative overflow-hidden`}
      >
        {/* Animated diagonal stripes */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #3b82f6 0, #3b82f6 1px, transparent 0, transparent 50%)',
            backgroundSize: '12px 12px',
          }}
        />
        <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
          <ImageOff className="w-5 h-5 text-[#3b82f6]/60" />
        </div>
        <div className="text-center px-4 relative">
          <p className="text-[#52525b] text-xs font-medium">Demo GIF Coming Soon</p>
          {!compact && (
            <p className="text-[#3b3b3b] text-xs mt-1">
              Drop your .gif into{' '}
              <code className="text-[#52525b]">public/assets/exercises/</code>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${height} rounded-xl bg-[#0f0f0f] border border-white/[0.06] relative overflow-hidden group`}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#141414] animate-pulse flex items-center justify-center">
          <Play className="w-8 h-8 text-[#2a2a2a]" />
        </div>
      )}

      <Image
        src={resolvedUrl}
        alt={demoAltText || exerciseName}
        fill
        className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        unoptimized
        sizes="(max-width: 768px) 100vw, 400px"
      />

      {/* Overlay gradient at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0f0f0f]/80 to-transparent pointer-events-none" />
    </div>
  );
}

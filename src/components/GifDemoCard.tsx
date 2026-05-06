'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Dumbbell } from 'lucide-react';
import { EXERCISE_IMAGES } from '@/data/exerciseImages';

interface GifDemoCardProps {
  gifUrl: string;
  demoAltText: string;
  exerciseName: string;
  compact?: boolean;
}

export default function GifDemoCard({
  demoAltText,
  exerciseName,
  compact = false,
}: GifDemoCardProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageUrl = EXERCISE_IMAGES[exerciseName] ?? null;
  const height = compact ? 'h-36' : 'h-52';

  if (hasError || !imageUrl) {
    return (
      <div
        className={`${height} rounded-xl bg-[#0f0f0f] border border-white/[0.06] flex flex-col items-center justify-center gap-2 relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #3b82f6 0, #3b82f6 1px, transparent 0, transparent 50%)',
            backgroundSize: '12px 12px',
          }}
        />
        <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-[#3b82f6]/60" />
        </div>
        <p className="text-[#52525b] text-xs font-medium relative">
          {exerciseName}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${height} rounded-xl bg-[#0f0f0f] border border-white/[0.06] relative overflow-hidden group`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#141414] animate-pulse flex items-center justify-center">
          <Play className="w-8 h-8 text-[#2a2a2a]" />
        </div>
      )}

      <Image
        src={imageUrl}
        alt={demoAltText || exerciseName}
        fill
        className={`object-cover object-top transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        sizes="(max-width: 768px) 100vw, 400px"
      />

      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0f0f0f]/80 to-transparent pointer-events-none" />
    </div>
  );
}

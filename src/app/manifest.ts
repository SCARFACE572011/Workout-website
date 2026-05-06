import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '3-Day Strength + Fat Loss',
    short_name: '3-Day Program',
    description: 'Lose fat, build muscle — 3-day gym program with timers, calorie tracking, and nutrition guide.',
    start_url: '/workout',
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#080808',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

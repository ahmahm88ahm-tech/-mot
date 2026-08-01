import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'مُتنقِّل — نقل وتركيب الأثاث',
    short_name: 'مُتنقِّل',
    description: 'نقل الأثاث بفنيين مدرّبين، تتبع لحظي، ودفع بعد الإكمال.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0c0a',
    theme_color: '#c9a24c',
    lang: 'ar',
    dir: 'rtl',
    orientation: 'portrait-primary',
    icons: [
      { url: '/icon?192', sizes: '192x192', type: 'image/png' },
      { url: '/icon?512', sizes: '512x512', type: 'image/png' },
      { url: '/icon?maskable', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

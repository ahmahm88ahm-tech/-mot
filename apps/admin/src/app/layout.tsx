import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'مُتنقِّل · لوحة الإدارة', robots: { index: false, follow: false } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@500;700&family=Tajawal:wght@400;500;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: '#0d0c0a', color: '#ece5d8', fontFamily: 'Tajawal, sans-serif', lineHeight: 1.6 }}>
        {children}
      </body>
    </html>
  );
}

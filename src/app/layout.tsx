import './globals.css';
import type { Metadata } from 'next';
import { Topbar } from '@/components/brand/topbar';
import { SwRegister } from '@/components/pwa/sw-register'; // الدفعة الخامسة (هـ١٢) — مضاف additive

export const metadata: Metadata = {
  title: 'مُتنقِّل | لنقل الأثاث فك وتركيب باحترافية وأمان',
  description: 'مُتنقِّل — نقل الأثاث بفنيين مدرّبين، تتبع لحظي، ودفع بعد الإكمال. تأسست 2018.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="bg-layer" aria-hidden="true">
          <div className="bg-grid" />
          <div className="bg-glow" />
          <div className="bg-glow b" />
          <div className="bg-grain" />
        </div>
        <SwRegister />
        <Topbar />
        {children}
      </body>
    </html>
  );
}
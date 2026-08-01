import Link from 'next/link';

export const metadata = { title: 'بلا اتصال · مُتنقِّل', robots: { index: false, follow: false } };

export default function OfflinePage() {
  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 440, textAlign: 'center', border: '1px dashed #3a3022', borderRadius: 20, padding: '40px 28px', background: 'linear-gradient(180deg,#1a1713,#141210)' }}>
        <div style={{ width: 72, height: 72, margin: '0 auto', borderRadius: 20, background: 'linear-gradient(180deg,#f6e09a,#8f6f2c)', display: 'grid', placeItems: 'center', color: '#1a1408', fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 34 }}>م</div>
        <h1 style={{ fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 28, marginTop: 18 }}>أنت بلا اتصال</h1>
        <p style={{ color: '#8c8273', marginTop: 10, lineHeight: 1.8 }}>
          يبدو أن الشبكة انقطعت. الصفحات التي زرتها محفوظة وتعمل، ويمكنك تصفّح الخدمات. اطلب نقلك فور عودة الاتصال — <b style={{ color: '#ecd28a' }}>ولا تدفع شيئاً إلا بعد الإكمال</b>.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <Link href="/" style={{ background: 'linear-gradient(180deg,#f6e09a,#8f6f2c)', color: '#1a1408', fontWeight: 800, padding: '11px 20px', borderRadius: 11 }}>الرئيسية</Link>
          <Link href="/services" style={{ border: '1px solid #3a3022', color: '#8c8273', fontWeight: 700, padding: '11px 20px', borderRadius: 11 }}>الخدمات المحفوظة</Link>
        </div>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#5a4f3c', marginTop: 22, direction: 'ltr' }}>offline · cache-first shell</p>
      </div>
    </main>
  );
}

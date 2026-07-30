'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function Seal() {
  // ختم ذهبي يُختَم + علامة تُرسم — حيّ، ليس confetti مبتذلاً
  const [stamped, setStamped] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStamped(true), 350); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: 'relative', width: 116, height: 116, margin: '0 auto' }}>
      <svg viewBox="0 0 116 116" style={{ width: '100%', height: '100%', transform: stamped ? 'scale(1) rotate(-8deg)' : 'scale(1.7) rotate(8deg)', opacity: stamped ? 1 : 0, transition: 'transform .5s cubic-bezier(.2,1.5,.4,1), opacity .4s' }}>
        <defs><linearGradient id="sealG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6e09a"/><stop offset=".5" stopColor="#d6af57"/><stop offset="1" stopColor="#8f6f2c"/></linearGradient></defs>
        <circle cx="58" cy="58" r="52" fill="none" stroke="url(#sealG)" strokeWidth="3" strokeDasharray="4 6" />
        <circle cx="58" cy="58" r="44" fill="none" stroke="url(#sealG)" strokeWidth="2" />
      </svg>
      <svg viewBox="0 0 116 116" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path d="M38 60 L52 74 L80 42" fill="none" stroke="#3fae7e" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 80, strokeDashoffset: stamped ? 0 : 80, transition: 'stroke-dashoffset .6s .5s ease' }} />
      </svg>
    </div>
  );
}

function SuccessBody() {
  const params = useSearchParams();
  const order = params.get('order') || '';
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);

  return (
    <main className="wrap" style={{ maxWidth: 720, paddingTop: 60, paddingBottom: 90, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={ref} style={{ opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(18px)', transition: 'opacity .7s, transform .7s', width: '100%' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'clamp(28px,4vw,44px)' }}>
          <Seal />
          <span className="badge gold" style={{ marginTop: 18 }}>تم استلام طلبك</span>
          <h1 className="h-display" style={{ fontSize: 'clamp(26px,4vw,40px)', marginTop: 14 }}>
            طلبك <em>في أيدٍ أمينة</em>
          </h1>
          {order && (
            <div style={{ margin: '18px auto 0', display: 'inline-block', background: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 12, padding: '10px 20px' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em' }}>رقم الطلب</span>
              <div className="gold-metal" style={{ fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 22, direction: 'ltr' }}>{order}</div>
            </div>
          )}
          <p className="lede" style={{ margin: '20px auto 0', textAlign: 'center' }}>
            سيتواصل معك فريقنا لتأكيد الموعد. وتذكّر وعدنا:{' '}
            <b style={{ color: 'var(--gold-s)' }}>لا تدفع ريالاً الآن</b> — الدفع بعد أن ترى أثاثك مركّباً، نقداً أو تحويلاً.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            {order && <Link href={`/invoice/${order}`} className="btn ghost">🧾 عرض الفاتورة</Link>}
            {order && <Link href={`/track/${order}`} className="btn">تتبّع طلبك ←</Link>}
            <Link href="/dashboard" className="btn ghost">لوحتي</Link>
            <Link href="/" className="btn ghost">الرئيسية</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className="wrap" style={{ paddingTop: 80, textAlign: 'center', color: 'var(--muted)' }}>جارٍ التحميل…</main>}>
      <SuccessBody />
    </Suspense>
  );
}

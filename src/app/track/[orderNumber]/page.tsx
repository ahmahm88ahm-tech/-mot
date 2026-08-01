'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const ALL = ['CREATED','CONFIRMED','ASSIGNED','DRIVER_STARTED','ARRIVED','LOADING','MOVING','UNLOADING','INSTALLATION','COMPLETED'];

export default function TrackPage() {
  const { orderNumber } = useParams();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    const load = () => fetch(`${API}/api/v1/tracking/${orderNumber}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((j) => alive && setData(j))
      .catch(() => alive && setErr('تعذّر تحميل التتبع — تحقّق من رقم الطلب.'));
    load();
    const t = setInterval(load, 8000); // تحديث كل 8 ثوانٍ (بدون websocket، صادق)
    return () => { alive = false; clearInterval(t); };
  }, [orderNumber]);

  if (err) return <main className="w" style={{ paddingTop: 90, textAlign: 'center' }}><p style={{ color: 'var(--bad)' }}>{err}</p></main>;
  if (!data) return <main className="w" style={{ paddingTop: 90, textAlign: 'center', color: 'var(--muted)' }}>جارٍ تحميل التتبع…</main>;

  const idx = ALL.indexOf(data.status);
  const done = data.status === 'COMPLETED';

  return (
    <main className="w" style={{ maxWidth: 920, paddingTop: 44, paddingBottom: 80 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }} className="trk-grid">
        {/* خريطة */}
        <div style={{ position: 'relative', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', background: 'radial-gradient(120% 120% at 30% 10%,#15110b,#0a0806)', minHeight: 360 }}>
          <svg viewBox="0 0 600 380" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid slice">
            <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c47b3a"/><stop offset="1" stopColor="#e7b53c"/></linearGradient></defs>
            <g stroke="#241d13" strokeWidth="9" fill="none" opacity=".7"><path d="M0 170 H600"/><path d="M280 0 V380"/></g>
            <line x1={sx(data.from.lng)} y1={sy(data.from.lat)} x2={sx(data.to.lng)} y2={sy(data.to.lat)} stroke="url(#rg)" strokeWidth="4" strokeDasharray="3 11" strokeLinecap="round" />
            <Marker x={sx(data.from.lng)} y={sy(data.from.lat)} c="#c47b3a" label="A" />
            <Marker x={sx(data.to.lng)} y={sy(data.to.lat)} c="#3fae7e" label="B" />
            {data.lastLocation && <circle cx={sx(data.lastLocation.longitude)} cy={sy(data.lastLocation.latitude)} r="7" fill="#e7b53c"><animate attributeName="r" values="7;13;7" dur="1.6s" repeatCount="indefinite"/></circle>}
          </svg>
          <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(13,12,10,.8)', border: '1px solid rgba(201,162,76,.35)', borderRadius: 12, padding: '8px 13px' }}>
            <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--muted)', fontWeight: 800 }}>{done ? 'الحالة' : 'الحالة الحالية'}</div>
            <div style={{ fontFamily: 'Reem Kufi', fontWeight: 700, color: 'var(--gold-s)', fontSize: 15 }}>{data.statusLabel}</div>
          </div>
        </div>

        {/* timeline */}
        <div style={{ border: '1px solid var(--line)', borderRadius: 18, padding: 18, background: 'linear-gradient(180deg,var(--panel),var(--ink2))' }}>
          <div style={{ fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>طلب <span className="gold-metal" style={{ fontFamily: 'JetBrains Mono', direction: 'ltr' }}>{data.orderNumber}</span></div>
          {data.service && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>{data.service}{data.driver ? ` · السائق ${data.driver.name}` : ''}</div>}
          <div style={{ position: 'relative', paddingRight: 18 }}>
            <div style={{ position: 'absolute', top: 4, bottom: 4, right: 5, width: 2, background: 'var(--line)' }} />
            {data.history.map((h: any, i: number) => (
              <div key={i} style={{ position: 'relative', padding: '6px 0', fontSize: 12, color: i === data.history.length - 1 ? 'var(--paper)' : 'var(--muted)', fontWeight: i === data.history.length - 1 ? 700 : 400 }}>
                <span style={{ position: 'absolute', right: -16, top: 9, width: 11, height: 11, borderRadius: '50%', background: i === data.history.length - 1 ? 'var(--gold)' : 'var(--ok)', border: '2px solid var(--ink)' }} />
                {h.label}<span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--muted)', display: 'block', direction: 'ltr' }}>{new Date(h.at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <Link href={`/invoice/${data.orderNumber}`} style={{ flex: 1, textAlign: 'center', border: '1px solid var(--line)', borderRadius: 10, padding: 9, fontSize: 12, fontWeight: 700 }}>🧾 الفاتورة</Link>
            <Link href="/orders" style={{ flex: 1, textAlign: 'center', border: '1px solid var(--line)', borderRadius: 10, padding: 9, fontSize: 12, fontWeight: 700 }}>طلباتي</Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:760px){.trk-grid{grid-template-columns:1fr!important}}`}</style>
    </main>
  );
}

// إسقاط بسيط لإحداثيات الرياض إلى viewBox (تقريبي للعرض)
function sx(lng: number) { return Math.max(40, Math.min(560, (lng - 46.55) * 4000 + 100)); }
function sy(lat: number) { return Math.max(40, Math.min(340, (24.85 - lat) * 4000 + 80)); }
function Marker({ x, y, c, label }: { x: number; y: number; c: string; label: string }) {
  return <g><circle cx={x} cy={y} r="7" fill={c} /><text x={x} y={y - 12} fill={c} fontSize="12" fontFamily="Reem Kufi" fontWeight="700" textAnchor="middle">{label}</text></g>;
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const STATUS_AR: Record<string, string> = { CREATED: 'جديد', CONFIRMED: 'مؤكد', ASSIGNED: 'معين', DRIVER_STARTED: 'في الطريق', ARRIVED: 'وصل', LOADING: 'تحميل', MOVING: 'متحرك', UNLOADING: 'تفريغ', INSTALLATION: 'تركيب', COMPLETED: 'مكتمل', CANCELLED: 'ملغي' };
const fmt = (n: number) => new Intl.NumberFormat('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const FILTERS = [['', 'الكل'], ['COMPLETED', 'مكتملة'], ['CANCELLED', 'ملغية'], ['active', 'نشطة']];

export default function OrdersPage() {
  const [all, setAll] = useState<any[]>([]);
  const [f, setF] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    apiFetch('/orders?limit=100').then((r) => setAll(r?.data || r || [])).catch((e) => setErr(e.message));
  }, []);

  const list = all.filter((o) => f === '' ? true : f === 'active' ? !['COMPLETED', 'CANCELLED'].includes(o.status) : o.status === f);

  return (
    <main className="w" style={{ maxWidth: 920, paddingTop: 44, paddingBottom: 80 }}>
      <h1 className="h-display" style={{ fontSize: 'clamp(26px,4vw,42px)' }}>طلباتي</h1>
      {err && <p style={{ color: 'var(--bad)', marginTop: 12 }}>{err} — <Link href="/login" style={{ color: 'var(--gold)' }}>سجّل الدخول</Link></p>}

      <div style={{ display: 'flex', gap: 8, margin: '18px 0', flexWrap: 'wrap' }}>
        {FILTERS.map(([v, l]) => (
          <button key={v} onClick={() => setF(v)} style={{ border: `1px solid ${f === v ? 'var(--gold)' : 'var(--line)'}`, background: f === v ? 'rgba(201,162,76,.1)' : 'transparent', color: f === v ? 'var(--gold-s)' : 'var(--muted)', borderRadius: 999, padding: '7px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{l}</button>
        ))}
      </div>

      {list.length === 0 ? <p style={{ color: 'var(--muted)' }}>لا طلبات في هذا التصنيف.</p> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {list.map((o) => (
            <div key={o.id} style={{ border: '1px solid var(--line)', borderRadius: 16, padding: 16, background: 'linear-gradient(180deg,var(--panel),var(--ink2))', display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className="gold-metal" style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, direction: 'ltr' }}>{o.orderNumber}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(201,162,76,.12)', color: 'var(--gold-s)', padding: '3px 10px', borderRadius: 999 }}>{STATUS_AR[o.status] || o.status}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{o.service?.nameAr} · {o.fromCity?.nameAr || ''} ← {o.toCity?.nameAr || ''}</div>
                <div style={{ fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 18, marginTop: 6 }}>{fmt(Number(o.totalAmount))} <span style={{ fontSize: 11, color: 'var(--muted)' }}>ريال</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <Link href={`/track/${o.orderNumber}`} style={{ border: '1px solid var(--line)', borderRadius: 9, padding: '7px 12px', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>تتبع</Link>
                <Link href={`/invoice/${o.orderNumber}`} style={{ border: '1px solid var(--line)', borderRadius: 9, padding: '7px 12px', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>فاتورة</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

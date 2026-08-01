'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useInView, useCountUp } from '@/lib/useInView';

const STATUS_AR: Record<string, string> = {
  CREATED: 'جديد',
  CONFIRMED: 'مؤكد',
  ASSIGNED: 'معين',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
};

interface Order {
  id: string;
  orderNumber: string;
  fromAddress: string;
  toAddress: string;
  totalAmount: number;
  status: string;
  service?: { nameAr: string };
}

interface Me {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Dashboard() {
  const v = useInView(0.1);
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState('');
  const count = useCountUp(orders.length, v.inView, 900);

  useEffect(() => {
    (async () => {
      try {
        setMe(await apiFetch<Me>('/auth/me'));
        setOrders(await apiFetch<Order[]>('/orders'));
      } catch (e: any) { setErr(e.message); }
    })();
  }, []);

  if (err) return (
    <main className="wrap" style={{ paddingTop: 120, textAlign: 'center' }}>
      <p style={{ color: 'var(--bad)' }}>{err}</p>
      <Link href="/login" className="btn" style={{ marginTop: 20 }}>سجّل دخولك ←</Link>
    </main>
  );

  return (
    <main className="wrap" style={{ paddingTop: 70, paddingBottom: 80 }}>
      <div ref={v.ref} className={`reveal ${v.inView ? 'in' : ''}`}>
        <span className="kicker">لوحتك</span>
        <h1 className="h-display" style={{ fontSize: 'clamp(30px,5vw,52px)', marginTop: 10 }}>
          مرحباً {me?.firstName} 👋
        </h1>
      </div>

      <div className="bento" style={{ marginTop: 34 }}>
        <div className={`card s2 reveal ${v.inView ? 'in' : ''}`}>
          <span className="kicker">طلباتي</span>
          <div className="bignum" style={{ marginTop: 10 }}>{count}<span className="u">طلب</span></div>
        </div>
        <div className={`card s4 reveal ${v.inView ? 'in' : ''}`} style={{ transitionDelay: '.08s' }}>
          <span className="kicker">إجراء سريع</span>
          <p style={{ marginTop: 10, color: 'var(--muted)' }}>بيت جديد؟ ابدأ طلب نقل الآن وتابعه لحظياً.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <Link href="/order/new" className="btn">طلب نقل ←</Link>
            <Link href="/track" className="btn ghost">تتبع طلب</Link>
          </div>
        </div>
      </div>

      <div className={`reveal ${v.inView ? 'in' : ''}`} style={{ marginTop: 40, transitionDelay: '.15s' }}>
        <h2 className="h-display" style={{ fontSize: 24 }}>آخر الطلبات</h2>
        {orders.length === 0 ? (
          <div className="card" style={{ marginTop: 18, textAlign: 'center', color: 'var(--muted)' }}>
            لا طلبات بعد — أول طلب لك على بُعد نقرة.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
            {orders.map((o) => (
              <div key={o.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <b style={{ fontFamily: 'var(--display)' }}>{o.orderNumber}</b>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                    {o.service?.nameAr} · {o.fromAddress} ← {o.toAddress}
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--gold)', fontSize: 20 }}>
                    {o.totalAmount} <span style={{ fontSize: 12, color: 'var(--muted)' }}>ريال</span>
                  </div>
                  <span className="badge gold" style={{ marginTop: 6 }}>
                    {STATUS_AR[o.status] ?? o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function AdminHome() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const o = await apiFetch('/orders?limit=50');
        const list = o?.data || o || [];
        setOrders(list);
        const paid = list.filter((x: any) => x.paymentStatus === 'PAID').length;
        const pendPay = list.filter((x: any) => x.status === 'COMPLETED' && x.paymentStatus !== 'PAID').length;
        setStats({ total: list.length, paid, pendPay });
      } catch (e: any) { setErr(e.message); }
    })();
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: '100vh' }} className="adm-grid">
      <aside style={{ background: 'linear-gradient(180deg,#100e0b,#0a0907)', borderLeft: '1px solid #3a3022', padding: '18px 14px' }} className="adm-side">
        <div style={{ fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 20, background: 'linear-gradient(180deg,#f6e09a,#8f6f2c)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', padding: '6px 8px 16px', borderBottom: '1px solid #3a3022' }}>مُتنقِّل · الإدارة</div>
        {([['/payments', 'تأكيد التحويلات', true], ['/', 'نظرة عامة', false], ['/orders', 'الطلبات', false]] as const).map(([href, t, badge]) => (
          <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 11px', borderRadius: 11, color: href === '/payments' ? '#ecd28a' : '#8c8273', background: href === '/payments' ? 'rgba(201,162,76,.1)' : 'transparent', fontWeight: 700, fontSize: 13, marginTop: 6 }}>
            {t}{badge && <span style={{ marginInlineStart: 'auto', background: '#d9534a', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: 999, padding: '1px 7px' }}>!</span>}
          </Link>
        ))}
      </aside>

      <main style={{ padding: '24px 28px' }}>
        <h1 style={{ fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 26 }}>نظرة عامة</h1>
        {err && <p style={{ color: '#d9534a', marginTop: 12 }}>{err} — تأكّد من تسجيل دخولك بحساب ADMIN وأن الـ Backend صاحٍ.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginTop: 22 }}>
          {([['إجمالي الطلبات', stats?.total ?? '—', '#ecd28a'], ['مدفوعة', stats?.paid ?? '—', '#3fae7e'], ['بانتظار تأكيد الدفع', stats?.pendPay ?? '—', '#c47b3a']] as const).map(([k, v, c]) => (
            <div key={k} style={{ border: '1px solid #3a3022', borderRadius: 14, padding: 16, background: 'linear-gradient(180deg,#1a1713,#141210)' }}>
              <div style={{ fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 32, color: c, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
              <div style={{ fontSize: 11, color: '#8c8273', marginTop: 4, letterSpacing: '.04em' }}>{k}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22, border: '1px solid #3a3022', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: '#1a1713', borderBottom: '1px solid #3a3022', fontWeight: 800, fontSize: 13 }}>آخر الطلبات</div>
          {orders.slice(0, 8).map((o: any) => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 16px', borderBottom: '1px solid #3a3022', fontSize: 13 }}>
              <span style={{ fontFamily: 'JetBrains Mono', color: '#ecd28a', direction: 'ltr' }}>{o.orderNumber}</span>
              <span style={{ color: '#8c8273' }}>{o.status}</span>
              <span style={{ color: o.paymentStatus === 'PAID' ? '#3fae7e' : '#c47b3a', fontWeight: 700 }}>{o.paymentStatus === 'PAID' ? 'مدفوع' : 'بانتظار الدفع'}</span>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:760px){.adm-grid{grid-template-columns:1fr!important}.adm-side{display:none}}`}</style>
      </main>
    </div>
  );
}

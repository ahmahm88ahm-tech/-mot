'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const fmt = (n: number) => new Intl.NumberFormat('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function PaymentsPage() {
  const [pending, setPending] = useState<any[]>([]);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const o = await apiFetch('/orders?limit=100');
      const list = (o?.data || o || []).filter((x: any) => x.status === 'COMPLETED' && x.paymentStatus !== 'PAID');
      setPending(list);
    } catch (e: any) { setMsg(e.message); }
  };
  useEffect(() => { load(); }, []);

  const cur = pending[sel];

  const confirm = async (method: 'CASH' | 'BANK_TRANSFER') => {
    if (!cur) return;
    setBusy(true); setMsg('');
    const reference = method === 'BANK_TRANSFER' ? prompt('مرجع عملية التحويل:') : undefined;
    if (method === 'BANK_TRANSFER' && !reference) { setBusy(false); return; }
    try {
      await apiFetch(`/orders/${cur.id}/payment`, { method: 'PATCH', body: JSON.stringify({ method, reference }) });
      setMsg('✓ تم تأكيد الدفع للطلب ' + cur.orderNumber);
      await load(); setSel(0);
    } catch (e: any) { setMsg('✕ ' + (e.message || 'فشل التأكيد')); }
    finally { setBusy(false); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: '100vh' }} className="adm-grid">
      <aside style={{ background: 'linear-gradient(180deg,#100e0b,#0a0907)', borderLeft: '1px solid #3a3022', padding: '18px 14px' }} className="adm-side">
        <div style={{ fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 20, background: 'linear-gradient(180deg,#f6e09a,#8f6f2c)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', padding: '6px 8px 16px', borderBottom: '1px solid #3a3022' }}>مُتنقِّل · الإدارة</div>
        <Link href="/payments" style={{ display: 'block', padding: '10px 11px', borderRadius: 11, color: '#ecd28a', background: 'rgba(201,162,76,.1)', fontWeight: 700, fontSize: 13, marginTop: 6 }}>تأكيد التحويلات</Link>
        <Link href="/" style={{ display: 'block', padding: '10px 11px', borderRadius: 11, color: '#8c8273', fontWeight: 700, fontSize: 13, marginTop: 6 }}>نظرة عامة</Link>
      </aside>

      <main style={{ padding: '24px 28px' }}>
        <h1 style={{ fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 24 }}>تأكيد التحويلات البنكية · {pending.length} معلّقة</h1>
        {msg && <p style={{ marginTop: 12, color: msg.startsWith('✓') ? '#3fae7e' : '#d9534a', fontWeight: 700 }}>{msg}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, marginTop: 20, alignItems: 'start' }} className="pay-grid">
          <div>
            {pending.length === 0 && <p style={{ color: '#8c8273' }}>لا تحويلات معلّقة 🎉</p>}
            {pending.map((q, i) => (
              <div key={q.id} onClick={() => setSel(i)} style={{ border: `1px solid ${i === sel ? '#c9a24c' : '#3a3022'}`, borderRadius: 13, padding: '12px 13px', marginBottom: 9, background: i === sel ? 'rgba(201,162,76,.08)' : '#1a1713', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#ecd28a', direction: 'ltr' }}>{q.orderNumber}</span>
                  <span style={{ fontFamily: 'Reem Kufi', fontWeight: 700 }}>{fmt(Number(q.totalAmount))}</span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 5 }}>{q.customer?.firstName} {q.customer?.lastName}</div>
              </div>
            ))}
          </div>

          {cur && (
            <div style={{ border: '1px solid #3a3022', borderRadius: 16, padding: 18, background: 'linear-gradient(180deg,#1a1713,#141210)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: 'Reem Kufi', fontWeight: 700 }}>طلب <span style={{ color: '#ecd28a', fontFamily: 'JetBrains Mono', direction: 'ltr' }}>{cur.orderNumber}</span></span>
                <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(196,123,58,.16)', color: '#c47b3a', padding: '4px 11px', borderRadius: 999 }}>بانتظار التأكيد</span>
              </div>
              {[['العميل', `${cur.customer?.firstName} ${cur.customer?.lastName}`], ['الإجمالي المستحق', fmt(Number(cur.totalAmount)) + ' ر.س']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #3a3022', fontSize: 13 }}>
                  <span style={{ color: '#8c8273' }}>{k}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
              <p style={{ fontSize: 12, color: '#8c8273', marginTop: 12, lineHeight: 1.7 }}>راجع الإيصال الوارد من العميل (واتساب)، طابق المبلغ والمرجع، ثم أكّد. <b style={{ color: '#3fae7e' }}>لا تؤكّد دون تطابق.</b></p>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={() => confirm('BANK_TRANSFER')} disabled={busy} style={{ flex: 1, background: 'linear-gradient(180deg,#f6e09a,#8f6f2c)', color: '#1a1408', fontWeight: 800, border: 0, borderRadius: 11, padding: 12, cursor: 'pointer' }}>✓ تأكيد تحويل بنكي</button>
                <button onClick={() => confirm('CASH')} disabled={busy} style={{ background: 'transparent', color: '#8c8273', border: '1px solid #3a3022', borderRadius: 11, padding: 12, cursor: 'pointer' }}>نقداً</button>
              </div>
            </div>
          )}
        </div>
        <style>{`@media(max-width:760px){.adm-grid,.pay-grid{grid-template-columns:1fr!important}.adm-side{display:none}}`}</style>
      </main>
    </div>
  );
}

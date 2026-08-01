'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { formatSAR, qrMatrix } from '@/lib/invoice';
import type { InvoiceData } from './types';

function QrView({ payload }: { payload: string }) {
  const m = qrMatrix(payload, 25);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(25, 5px)', border: '3px solid #221c12', padding: 4, background: '#fff', width: 'fit-content' }}>
      {m.flatMap((row, r) => row.map((on, c) => (
        <i key={`${r}-${c}`} style={{ width: 5, height: 5, background: on ? '#221c12' : 'transparent' }} />
      )))}
    </div>
  );
}

export default function InvoicePage() {
  const { orderNumber } = useParams();
  const router = useRouter();
  const [inv, setInv] = useState<InvoiceData | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    apiFetch<InvoiceData>(`/invoices/${orderNumber}`).then(setInv).catch((e: Error) => setErr(e.message || 'تعذّر تحميل الفاتورة'));
  }, [orderNumber]);

  if (err) return (
    <main className="w" style={{ paddingTop: 90, textAlign: 'center' }}>
      <p style={{ color: 'var(--bad)' }}>{err}</p>
      <button className="btn" style={{ marginTop: 16 }} onClick={() => router.push('/login')}>سجّل الدخول</button>
    </main>
  );
  if (!inv) return <main className="w" style={{ paddingTop: 90, textAlign: 'center', color: 'var(--muted)' }}>جارٍ تحميل الفاتورة…</main>;

  return (
    <main className="w" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, justifyContent: 'flex-end' }} className="no-print">
        <button className="btn ghost" onClick={() => window.print()}>🖨 طباعة / PDF</button>
      </div>

      <div className="invoice-print" style={{ background: 'linear-gradient(180deg,#f4eddd,#e9dfc8)', color: '#221c12', borderRadius: 8, padding: '30px 28px', fontFamily: 'var(--body)', position: 'relative', boxShadow: '0 30px 70px -34px rgba(0,0,0,.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #221c12', paddingBottom: 14 }}>
          <div>
            <div style={{ fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 22 }}>مُتنقِّل</div>
            <div style={{ fontSize: 10, color: '#7a6c52', marginTop: 3 }}>الرقم الضريبي {inv.seller.vatNumber}</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--disp)', fontWeight: 700, color: '#8f6f2c' }}>فاتورة ضريبية مبسّطة</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#7a6c52', direction: 'ltr', marginTop: 3 }}>{inv.invoiceNumber}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12 }}>
          <div><span style={{ color: '#7a6c52' }}>التاريخ: </span><b style={{ fontFamily: 'var(--mono)', direction: 'ltr' }}>{inv.date} {inv.time}</b></div>
          <div><span style={{ color: '#7a6c52' }}>العميل: </span><b>{inv.buyer.name}</b></div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, fontSize: 12 }}>
          <thead><tr style={{ background: '#221c12', color: '#f4eddd' }}>
            <th style={{ padding: '8px 10px', textAlign: 'right' }}>البند</th>
            <th style={{ padding: '8px 10px', textAlign: 'left' }}>الكمية</th>
            <th style={{ padding: '8px 10px', textAlign: 'left' }}>المبلغ</th>
          </tr></thead>
          <tbody>{inv.lines.map((l, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #cdbf9f' }}>
              <td style={{ padding: '9px 10px' }}>{l.name}</td>
              <td style={{ padding: '9px 10px', textAlign: 'left', fontFamily: 'var(--mono)', direction: 'ltr' }}>{l.quantity}</td>
              <td style={{ padding: '9px 10px', textAlign: 'left', fontFamily: 'var(--mono)', direction: 'ltr' }}>{formatSAR(l.total)}</td>
            </tr>
          ))}</tbody>
        </table>

        <div style={{ width: '62%', marginInlineStart: 'auto', marginTop: 12, fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>المجموع قبل الضريبة</span><span style={{ fontFamily: 'var(--mono)', direction: 'ltr' }}>{formatSAR(inv.subtotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>ضريبة القيمة المضافة 15%</span><span style={{ fontFamily: 'var(--mono)', direction: 'ltr' }}>{formatSAR(inv.vatAmount)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #221c12', marginTop: 4, paddingTop: 8, fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 17 }}><span>الإجمالي</span><span style={{ fontFamily: 'var(--mono)', direction: 'ltr' }}>{formatSAR(inv.total)} {inv.currency}</span></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20, paddingTop: 14, borderTop: '1px dashed #cdbf9f' }}>
          <QrView payload={inv.qrBase64} />
          <div style={{ maxWidth: 200, fontSize: 10, color: '#7a6c52', lineHeight: 1.6 }}>رمز زكوي متوافق مع الفوترة الإلكترونية. <b style={{ color: '#8f6f2c' }}>{inv.paymentNote}</b></div>
        </div>

        <div style={{ position: 'absolute', left: 22, bottom: 70, width: 100, height: 100, border: '3px double #c47b3a', borderRadius: '50%', display: 'grid', placeItems: 'center', textAlign: 'center', color: '#c47b3a', fontFamily: 'var(--disp)', fontWeight: 700, transform: 'rotate(-14deg)', mixBlendMode: 'multiply' }}>
          <div><div style={{ fontSize: 8, letterSpacing: '.1em' }}>مُتنقِّل</div><div style={{ fontSize: 11, lineHeight: 1.15, margin: '3px 0' }}>الدفع<br />عند الإكمال</div><div style={{ fontSize: 7 }}>PAID ON COMPLETION</div></div>
        </div>
      </div>

      <style>{`@media print{.no-print{display:none!important}body{background:#fff}.invoice-print{box-shadow:none}}`}</style>
    </main>
  );
}

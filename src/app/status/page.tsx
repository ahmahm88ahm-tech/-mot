'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function StatusPage() {
  const [health, setHealth] = useState<{ ok?: boolean } | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [statusErr, setStatusErr] = useState('');

  useEffect(() => {
    // /health عام دائماً
    fetch(`${API}/api/v1/health`).then((r) => r.json()).then(setHealth).catch(() => setHealth({ ok: false }));
    // /status محمي — إن وُجد token admin
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      apiFetch('/status').then(setStatus).catch((e) => setStatusErr(e.message || 'تحتاج صلاحيات مشرف'));
    } else {
      setStatusErr('سجّل دخولك بحساب مشرف لرؤية التفاصيل الداخلية.');
    }
  }, []);

  const Dot = ({ ok }: { ok?: boolean }) => (
    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: ok ? 'var(--ok)' : ok === false ? 'var(--bad)' : 'var(--muted)', boxShadow: ok ? '0 0 0 4px rgba(63,174,126,.18)' : 'none' }} />
  );

  return (
    <main className="w" style={{ maxWidth: 880, paddingTop: 50, paddingBottom: 90 }}>
      <span className="kicker">مراقبة داخلية</span>
      <h1 className="h-display" style={{ fontSize: 'clamp(28px,4.5vw,48px)', marginTop: 12 }}>حالة <em>النظام</em></h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 28 }} className="st-grid">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Dot ok={health?.ok} /><b style={{ fontFamily: 'var(--disp)' }}>الفحص الخارجي · /health</b></div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 10 }}>{health ? (health.ok ? 'يعمل — الخادم يردّ.' : 'لا استجابة.') : 'جارٍ الفحص…'}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Dot ok={status ? status.ok : statusErr ? false : undefined} /><b style={{ fontFamily: 'var(--disp)' }}>الفحص الداخلي · /status</b></div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 10 }}>{statusErr || (status ? `قاعدة البيانات ${status.checks?.db?.ok ? 'سليمة' : 'متعثّرة'} · زمن التشغيل ${status.uptimeSec}ث.` : 'جارٍ…')}</p>
        </div>
      </div>

      {status && (
        <div className="card" style={{ marginTop: 14 }}>
          <b style={{ fontFamily: 'var(--disp)' }}>العدّادات</b>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12, marginTop: 12 }}>
            {[['الطلبات', status.counts?.orders], ['المستخدمون', status.counts?.users], ['الذاكرة (MB)', status.memoryMB?.heap]].map(([k, v]) => (
              <div key={k as string} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 12 }}>
                <div className="gold-metal" style={{ fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 26 }}>{v ?? '—'}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@media(max-width:640px){.st-grid{grid-template-columns:1fr!important}}`}</style>
    </main>
  );
}

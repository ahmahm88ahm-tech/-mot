'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminLogin() {
  const router = useRouter();
  const [id, setId] = useState('admin@motanaqil.com');
  const [pw, setPw] = useState('Motanaqil@2026');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: id, password: pw }) });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message || 'فشل الدخول');
      const token = body?.accessToken || body?.data?.accessToken;
      const user = body?.user || body?.data?.user;
      if (!['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(user?.role)) {
        throw new Error('هذا الباب للمشرفين فقط.');
      }
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      router.push('/');
    } catch (e: any) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 380, border: '1px solid #3a3022', borderRadius: 18, padding: 28, background: 'linear-gradient(180deg,#1a1713,#141210)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(180deg,#f6e09a,#8f6f2c)', display: 'grid', placeItems: 'center', color: '#1a1408', fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 20 }}>م</div>
          <div style={{ fontFamily: 'Reem Kufi', fontWeight: 700, fontSize: 18 }}>لوحة الإدارة</div>
        </div>
        <p style={{ color: '#8c8273', fontSize: 12, marginBottom: 18 }}>دخول مقيّد · المشرفون فقط</p>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8c8273', marginBottom: 6 }}>البريد</label>
        <input value={id} onChange={(e) => setId(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #3a3022', background: '#0d0c0a', color: '#ece5d8', font: 'inherit', marginBottom: 12 }} />
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8c8273', marginBottom: 6 }}>كلمة المرور</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #3a3022', background: '#0d0c0a', color: '#ece5d8', font: 'inherit' }} />
        {err && <p style={{ color: '#d9534a', marginTop: 12, fontSize: 13 }}>{err}</p>}
        <button disabled={busy} style={{ width: '100%', marginTop: 18, background: 'linear-gradient(180deg,#f6e09a,#8f6f2c)', color: '#1a1408', fontWeight: 800, border: 0, borderRadius: 11, padding: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{busy ? '…' : 'دخول ←'}</button>
        <p style={{ color: '#5a4f3c', fontSize: 10, marginTop: 14, textAlign: 'center' }}>تجريبي: admin@motanaqil.com / Motanaqil@2026</p>
      </form>
    </main>
  );
}

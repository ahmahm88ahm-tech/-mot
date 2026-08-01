'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useInView } from '@/lib/useInView';

export default function Login() {
  const router = useRouter();
  const v = useInView(0.1);
  const [identifier, setIdentifier] = useState('customer@motanaqil.com');
  const [password, setPassword] = useState('Motanaqil@2026');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const res = await apiFetch<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });
      localStorage.setItem('token', res.accessToken);
      router.push('/dashboard');
    } catch (e: any) { setErr(e.message || 'فشل الدخول'); }
    finally { setLoading(false); }
  }

  return (
    <main className="wrap" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', paddingTop: 60, paddingBottom: 60 }}>
      {/* الجانب البصري */}
      <div ref={v.ref} className={`reveal ${v.inView ? 'in' : ''}`}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 26, color: 'var(--gold)' }}>مُتنقِّل</div>
        <h1 className="h-display" style={{ fontSize: 'clamp(34px,5vw,58px)', marginTop: 16 }}>
          أهلاً بعودتك<br /><em>لننقل</em> ما يهمك
        </h1>
        <p className="lede" style={{ marginTop: 18 }}>سجّل دخولك لتتابع طلباتك، تطلب نقلاً جديداً، وتدير كل شيء من مكان واحد.</p>
        <div className="card" style={{ marginTop: 30, display: 'inline-block' }}>
          <span className="badge gold"><span className="dot" /> خادم حي</span>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 10 }}>متصل بـ Backend حقيقي — جرّب الدخول التجريبي.</p>
        </div>
      </div>

      {/* النموذج */}
      <div className={`reveal ${v.inView ? 'in' : ''}`} style={{ transitionDelay: '.12s' }}>
        <form onSubmit={submit} className="card" style={{ maxWidth: 440, marginInline: 'auto' }}>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 24 }}>تسجيل الدخول</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>تجريبي: customer@motanaqil.com / Motanaqil@2026</p>
          <label className="label" style={{ marginTop: 22 }}>البريد أو الجوال</label>
          <input className="field" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          <label className="label" style={{ marginTop: 16 }}>كلمة المرور</label>
          <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {err && <p style={{ color: 'var(--bad)', marginTop: 12, fontSize: 14 }}>{err}</p>}
          <button className="btn" style={{ width: '100%', marginTop: 24 }} disabled={loading}>
            {loading ? 'جارٍ الدخول…' : 'دخول ←'}
          </button>
        </form>
      </div>
    </main>
  );
}

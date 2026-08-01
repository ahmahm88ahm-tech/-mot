'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useInView } from '@/lib/useInView';

const STEPS = ['الخدمة', 'المواقع', 'الموعد والمراجعة'];

type Service = { id: string; nameAr: string; description?: string };
type LocationField = 'from' | 'to';
type FormState = {
  serviceId: string;
  fromAddress: string;
  toAddress: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  date: string;
  slot: string;
  notes: string;
};

export default function RequestPage() {
  const view = useInView(0.05);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState<FormState>({
    serviceId: '',
    fromAddress: '',
    toAddress: '',
    fromLat: 0,
    fromLng: 0,
    toLat: 0,
    toLng: 0,
    date: '',
    slot: 'morning',
    notes: '',
  });
  const [price, setPrice] = useState<{ total: number } | null>(null);

  useEffect(() => {
    apiFetch<Service[]>('/services')
      .then((result) => {
        setServices(result || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (form.serviceId && form.fromLat && form.toLat) {
      apiFetch<{ total: number }>('/orders/price', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: form.serviceId,
          fromLat: form.fromLat,
          fromLng: form.fromLng,
          toLat: form.toLat,
          toLng: form.toLng,
        }),
      }).then(setPrice).catch(() => setPrice(null));
    }
  }, [form.serviceId, form.fromLat, form.fromLng, form.toLat, form.toLng]);

  function useMyLocation(which: LocationField) {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocating(false);
      setError('متصفحك لا يدعم تحديد الموقع — اكتب العنوان يدوياً');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => which === 'from'
          ? { ...current, fromLat: position.coords.latitude, fromLng: position.coords.longitude, fromAddress: current.fromAddress || 'موقعي الحالي' }
          : { ...current, toLat: position.coords.latitude, toLng: position.coords.longitude, toAddress: current.toAddress || 'موقعي الحالي' });
        setLocating(false);
        setError('');
      },
      () => {
        setLocating(false);
        setError('تعذّر تحديد الموقع — امنح الإذن أو اكتب العنوان');
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  const canNext =
    step === 0 ? !!form.serviceId :
    step === 1 ? !!form.fromAddress && !!form.toAddress && !!form.fromLat && !!form.toLat :
    !!form.date;

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      const res = await apiFetch<{ orderNumber?: string; data?: { orderNumber?: string } }>(
        '/orders',
        { method: 'POST', body: JSON.stringify(form) },
      );
      const on = res?.orderNumber || res?.data?.orderNumber || '';
      router.push(`/request/success?order=${encodeURIComponent(on)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذّر إنشاء الطلب');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedService = services.find((service) => service.id === form.serviceId);

  return (
    <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 860 }}>
      <div ref={view.ref} className={`reveal ${view.inView ? 'in' : ''}`}>
        <span className="kicker">طلب نقل</span>
        <h1 className="h-display" style={{ fontSize: 'clamp(28px,4.5vw,46px)', marginTop: 10 }}>احصل على <em>عرض سعر</em> في دقيقة</h1>
      </div>

      <div className={`reveal ${view.inView ? 'in' : ''}`} style={{ display: 'flex', gap: 8, margin: '26px 0', flexWrap: 'wrap' }}>
        {STEPS.map((label, index) => (
          <div key={label} style={{
            flex: 1,
            minWidth: 110,
            padding: '10px 12px',
            borderRadius: 12,
            border: `1px solid ${index === step ? 'var(--gold)' : 'var(--line)'}`,
            background: index === step ? 'rgba(201,162,76,.08)' : index < step ? 'rgba(63,174,126,.06)' : 'transparent',
            transition: '.3s',
          }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>{index < step ? '✓' : index + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: index === step ? 'var(--gold-s)' : 'var(--paper)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className={`card reveal ${view.inView ? 'in' : ''}`}>
        {loading ? <p style={{ color: 'var(--muted)' }}>جاري تحميل الخدمات…</p> : null}

        {step === 0 && !loading && (
          <div style={{ display: 'grid', gap: 12 }}>
            <h3 className="h-display" style={{ fontSize: 20 }}>اختر الخدمة</h3>
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setForm((current) => ({ ...current, serviceId: service.id }))}
                style={{
                  textAlign: 'right',
                  padding: 16,
                  borderRadius: 14,
                  cursor: 'pointer',
                  border: `1px solid ${form.serviceId === service.id ? 'var(--gold)' : 'var(--line)'}`,
                  background: form.serviceId === service.id ? 'rgba(201,162,76,.08)' : 'var(--ink)',
                  transition: '.25s',
                }}
              >
                <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 16 }}>{service.nameAr}</div>
                {service.description && <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{service.description}</div>}
                <div style={{ color: 'var(--gold-s)', fontSize: 12, marginTop: 8, fontWeight: 700 }}>أقل تكلفة · اطلب عرض سعر</div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'grid', gap: 18 }}>
            <h3 className="h-display" style={{ fontSize: 20 }}>من أين وإلى أين؟</h3>
            {[
              { key: 'from' as const, label: 'عنوان الاستلام (من)', placeholder: 'مثال: حي النرجس، شارع الملك فهد' },
              { key: 'to' as const, label: 'عنوان التسليم (إلى)', placeholder: 'مثال: حي الملقا، طريق أنس بن مالك' },
            ].map((field) => (
              <div key={field.key}>
                <label className="label">{field.label}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="field"
                    placeholder={field.placeholder}
                    value={field.key === 'from' ? form.fromAddress : form.toAddress}
                    onChange={(event) => setForm((current) => field.key === 'from'
                      ? { ...current, fromAddress: event.target.value }
                      : { ...current, toAddress: event.target.value })}
                  />
                  <button type="button" className="btn ghost" style={{ padding: '0 14px', whiteSpace: 'nowrap', fontSize: 13 }} onClick={() => useMyLocation(field.key)} disabled={locating}>
                    {locating ? '…' : '📍 موقعي'}
                  </button>
                </div>
              </div>
            ))}
            <p style={{ color: 'var(--muted)', fontSize: 12 }}>💡 زر «موقعي» يملأ الإحداثيات الحقيقية عبر المتصفح — بلا مفتاح خارجي.</p>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'grid', gap: 18 }}>
            <h3 className="h-display" style={{ fontSize: 20 }}>متى ننقلك؟</h3>
            <div>
              <label className="label">التاريخ</label>
              <input className="field" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
            </div>
            <div>
              <label className="label">الفترة</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['morning', 'صباحاً'], ['afternoon', 'ظهراً'], ['evening', 'مساءً']].map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setForm((current) => ({ ...current, slot: value }))} style={{ padding: '10px 18px', borderRadius: 12, border: `1px solid ${form.slot === value ? 'var(--gold)' : 'var(--line)'}`, background: form.slot === value ? 'rgba(201,162,76,.08)' : 'var(--ink)', color: 'var(--paper)', fontWeight: 700, fontSize: 14 }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">ملاحظات (اختياري)</label>
              <textarea className="field" rows={3} placeholder="طابق، مصعد، قطع حساسة…" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
            </div>

            <div style={{ position: 'relative', borderRadius: 18, padding: 2, background: 'var(--metal)' }}>
              <div style={{ background: 'linear-gradient(180deg,#161310,#0c0b09)', borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid var(--gold-deep)', display: 'grid', placeItems: 'center', flexShrink: 0, background: 'radial-gradient(circle,rgba(201,162,76,.12),transparent)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-s)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 16 }}>وعد مُتنقِّل: <span className="gold-metal">لا تدفع ريالاً الآن</span></div>
                  <div style={{ color: 'var(--paper)', opacity: .8, fontSize: 13, marginTop: 4 }}>تدفع بعد أن ترى أثاثك مركّباً — نقداً للسائق، أو تحويلاً بعد التركيب.</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, marginBottom: 10 }}>ملخص الطلب</div>
              {[['الخدمة', selectedService?.nameAr || '—'], ['من', form.fromAddress || '—'], ['إلى', form.toAddress || '—'], ['الموعد', form.date ? `${form.date} · ${form.slot === 'morning' ? 'صباحاً' : form.slot === 'afternoon' ? 'ظهراً' : 'مساءً'}` : '—']].map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>{key}</span><span style={{ fontWeight: 700 }}>{value}</span>
                </div>
              ))}
              {price && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--gold-s)', fontWeight: 700 }}>السعر التقديري (شامل الضريبة)</span>
                  <span className="gold-metal" style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 22 }}>{price.total} ريال</span>
                </div>
              )}
              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>هذا تقديرٌ فقط — السعر النهائي يُؤكَّد عند المعاينة، ولا يُدفع إلا بعد الإكمال.</div>
            </div>
          </div>
        )}

        {error && <p style={{ color: 'var(--bad)', marginTop: 14, fontSize: 14 }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
          <button className="btn ghost" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>→ السابق</button>
          {step < 2 ? (
            <button className="btn" onClick={() => setStep((current) => current + 1)} disabled={!canNext}>التالي ←</button>
          ) : (
            <button className="btn" onClick={submit} disabled={submitting || !canNext}>{submitting ? 'جارٍ الإرسال…' : 'تأكيد الطلب ←'}</button>
          )}
        </div>
      </div>
    </main>
  );
}
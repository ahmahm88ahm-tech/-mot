import Link from 'next/link';

const SECTIONS: [string, string, string][] = [
  ['١', 'قبول الشروط', 'باستخدامك للمنصة أو طلبك خدمة، فإنك توافق على هذه الشروط. إن لم توافق، يرجى عدم استخدام الخدمة.'],
  ['٢', 'الخدمة', 'نقدّم نقل الأثاث وفكّه وتركيبه وتغليفه. نعرض الخدمة ونحسب السعر حسب الطلب، ولا نلزمك بسعر حتى المعاينة والتأكيد.'],
  ['٣', 'الدفع بعد الإكمال', 'لا نطلب دفعاً مسبقاً. يتم الدفع نقداً للسائق أو تحويلاً بنكياً بعد إتمام الخدمة، وفق ما تختاره.'],
  ['٤', 'المواعيد والإلغاء', 'نلتزم بالموعد المتفق عليه. يمكنك الإلغاء قبل التعيين دون رسوم؛ وبعد التعيين قد تنطبق رسوم وفق توقيت الإلغاء.'],
  ['٥', 'الضمان والتأمين', 'نلتزم بالعناية بأثاثك، وتغطّي بوليصة التأمين الأضرار وفق شروطها. يُرجى الإفصاح عن القطع عالية القيمة مسبقاً.'],
  ['٦', 'مسؤولياتك', 'توفير بيانات وعناوين صحيحة، وتأمين وصول الفريق للموقع في الموعد، والإفصاح عن أي ظروف خاصة (أدوار، ممرات ضيقة).'],
  ['٧', 'حدود المسؤولية', 'لا نتحمّل مسؤولية تأخير ناتج عن قوة قاهرة أو ظروف خارجة عن إرادتنا، مع التزامنا بإبلاغك فوراً.'],
  ['٨', 'التغييرات', 'قد نحدّث هذه الشروط، وننشر التاريخ أعلاه. استمرارك في الاستخدام بعد التحديث يعني قبولك.'],
];

export default function Terms() {
  return (
    <main className="wrap" style={{ maxWidth: 820, paddingTop: 56, paddingBottom: 90 }}>
      <span className="kicker">وثيقة نظامية</span>
      <h1 className="h-display" style={{ fontSize: 'clamp(30px,5vw,52px)', marginTop: 12 }}>الشروط <em>والأحكام</em></h1>
      <p style={{ color: 'var(--muted)', marginTop: 10, fontSize: 13 }}>آخر تحديث: يوليو 2026 · سارية على motanaqil.com</p>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 36, marginTop: 36 }} className="doc-grid">
        <nav style={{ position: 'sticky', top: 80, alignSelf: 'start' }} className="doc-nav">
          <div style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>الفهرس</div>
          {SECTIONS.map(([n, t]) => (
            <a key={n} href={`#t${n}`} style={{ display: 'flex', gap: 10, padding: '7px 0', fontSize: 13, color: 'var(--paper)', opacity: .8, borderBottom: '1px solid var(--line)' }}>
              <span className="gold-metal" style={{ fontFamily: 'var(--disp)', fontWeight: 700 }}>{n}</span>{t}
            </a>
          ))}
        </nav>
        <div>
          {SECTIONS.map(([n, t, b]) => (
            <section key={n} id={`t${n}`} style={{ marginBottom: 26, scrollMarginTop: 90 }}>
              <h2 style={{ fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 21, display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span className="gold-metal">{n}</span>{t}
              </h2>
              <p style={{ color: 'var(--paper)', opacity: .82, marginTop: 8, lineHeight: 1.85 }}>{b}</p>
            </section>
          ))}
          <div style={{ marginTop: 30, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
            <Link href="/privacy-policy" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14 }}>اقرأ سياسة الخصوصية ←</Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:720px){.doc-grid{grid-template-columns:1fr !important}.doc-nav{position:static !important}}`}</style>
    </main>
  );
}

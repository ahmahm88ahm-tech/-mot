import Link from 'next/link';

const SECTIONS: [string, string, string][] = [
  ['١', 'من نحن', 'مُتنقِّل منصة لنقل وتركيب الأثاث. تأسست 2018، وتلتزم بحماية بياناتك وفق نظام حماية البيانات الشخصية السعودي (PDPL).'],
  ['٢', 'ما نجمعه', 'الاسم، الجوال، البريد، وعناوين الاستلام والتسليم — وهي بيانات نحتاجها لتنفيذ خدمتك فقط. لا نجمع بيانات دفع إطلاقاً، لأن الدفع يتم بعد انتهاء العمل.'],
  ['٣', 'لماذا نستخدمها', 'لتنفيذ طلبك، التواصل معك حول الموعد والتتبع، وإصدار الفواتير النظامية. لا نبيع بياناتك ولا نشاركها مع معلنين.'],
  ['٤', 'الدفع بعد العمل', 'سياستنا الصريحة: لا دفع مسبق. تدفع نقداً للسائق أو تحويلاً بعد إتمام التركيب. لذا لا تمرّ بيانات بطاقة عبر منصّتنا أصلاً.'],
  ['٥', 'حقوقك', 'لك الحق في الوصول لبياناتك، تصحيحها، حذفها، أو الاعتراض على معالجتها. راسلنا على privacy@motanaqil.com وسننفّذ طلبك خلال المدة النظامية.'],
  ['٦', 'الاحتفاظ', 'نحتفظ ببيانات الطلبات للمدة التي تفرضها الأنظمة المحاسبية والضريبية، ونحذف ما عداها حين تنتفي الحاجة.'],
  ['٧', 'الأمان', 'نشفّر البيانات في النقل والتخزين، ونقيّد الوصول داخلياً على مبدأ الحاجة فقط.'],
  ['٨', 'التواصل', 'لأي استفسار عن الخصوصية: privacy@motanaqil.com · أو واتساب 05801444166.'],
];

export default function Privacy() {
  return (
    <main className="wrap" style={{ maxWidth: 820, paddingTop: 56, paddingBottom: 90 }}>
      <span className="kicker">وثيقة نظامية</span>
      <h1 className="h-display" style={{ fontSize: 'clamp(30px,5vw,52px)', marginTop: 12 }}>سياسة <em>الخصوصية</em></h1>
      <p style={{ color: 'var(--muted)', marginTop: 10, fontSize: 13 }}>آخر تحديث: يوليو 2026 · سارية على motanaqil.com</p>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 36, marginTop: 36 }} className="doc-grid">
        <nav style={{ position: 'sticky', top: 80, alignSelf: 'start' }} className="doc-nav">
          <div style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>الفهرس</div>
          {SECTIONS.map(([n, t]) => (
            <a key={n} href={`#s${n}`} style={{ display: 'flex', gap: 10, padding: '7px 0', fontSize: 13, color: 'var(--paper)', opacity: .8, borderBottom: '1px solid var(--line)' }}>
              <span className="gold-metal" style={{ fontFamily: 'var(--disp)', fontWeight: 700 }}>{n}</span>{t}
            </a>
          ))}
        </nav>
        <div>
          {SECTIONS.map(([n, t, b]) => (
            <section key={n} id={`s${n}`} style={{ marginBottom: 26, scrollMarginTop: 90 }}>
              <h2 style={{ fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 21, display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span className="gold-metal">{n}</span>{t}
              </h2>
              <p style={{ color: 'var(--paper)', opacity: .82, marginTop: 8, lineHeight: 1.85 }}>{b}</p>
            </section>
          ))}
          <div style={{ marginTop: 30, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
            <Link href="/terms" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14 }}>اقرأ الشروط والأحكام ←</Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:720px){.doc-grid{grid-template-columns:1fr !important}.doc-nav{position:static !important}}`}</style>
    </main>
  );
}

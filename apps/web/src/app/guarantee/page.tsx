import Link from 'next/link';

const CLAUSES: [string, string, string][] = [
  ['١', 'مبدأ الدفع بعد الإكمال', 'لا نطلب أي دفع مسبق. تدفع نقداً للسائق أو تحويلاً بنكياً بعد أن ترى أثاثك مركّباً في موقعه الجديد. هذا التزامٌ لا استثناء فيه.'],
  ['٢', 'نطاق التغطية', 'يغطي الضمان الأضرار المباشرة التي تقع على الأثاث أثناء النقل أو الفك أو التركيب بأيدي فريقنا، وفق ما تُثبته صور ما قبل النقل وبعده.'],
  ['٣', 'ما لا يغطّيه الضمان', 'الأضرار الناتجة عن عيبٍ سابقٍ في القطعة، أو عن تعليماتٍ خاصة لم يُفصَح عنها، أو عن قوة قاهرة.'],
  ['٤', 'القطع عالية القيمة', 'يُرجى الإفصاح عنها مسبقاً لتسجيلها في محضر النقل؛ وإلا تُعامل ضمن التغطية القياسية.'],
  ['٥', 'إجراء المطالبة', 'صوّر الضرر، وتواصل معنا خلال 48 ساعة من التسليم عبر واتساب 05801444166. نوثّق ونفتح مطالبة خلال ساعة، ونعوّض أو نُعيد التنفيذ.'],
  ['٦', 'التأمين', 'عند توفّر بوليصة تأمين سارية، تُعالَج المطالبات وفق شروطها، مع التزامنا بتسهيل الإجراءات كاملةً.'],
];

export default function Guarantee() {
  return (
    <main className="w" style={{ maxWidth: 820, paddingTop: 56, paddingBottom: 90 }}>
      <span className="kicker">التزامٌ موثّق</span>
      <h1 className="h-display" style={{ fontSize: 'clamp(30px,5vw,52px)', marginTop: 12 }}>سياسة <em>الضمان</em></h1>
      <p style={{ color: 'var(--muted)', marginTop: 10, fontSize: 13 }}>مُتنقِّل · سارية على كل طلب · آخر تحديث: يوليو 2026</p>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 36, marginTop: 36 }} className="doc-grid">
        <nav style={{ position: 'sticky', top: 80, alignSelf: 'start' }} className="doc-nav">
          <div style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>البنود</div>
          {CLAUSES.map(([n, t]) => (
            <a key={n} href={`#g${n}`} style={{ display: 'flex', gap: 10, padding: '7px 0', fontSize: 13, color: 'var(--paper)', opacity: .8, borderBottom: '1px solid var(--line)' }}>
              <span className="gold-metal" style={{ fontFamily: 'var(--disp)', fontWeight: 700 }}>{n}</span>{t}
            </a>
          ))}
        </nav>
        <div>
          {CLAUSES.map(([n, t, b]) => (
            <section key={n} id={`g${n}`} style={{ marginBottom: 26, scrollMarginTop: 90 }}>
              <h2 style={{ fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 21, display: 'flex', gap: 12, alignItems: 'baseline' }}><span className="gold-metal">{n}</span>{t}</h2>
              <p style={{ color: 'var(--paper)', opacity: .82, marginTop: 8, lineHeight: 1.85 }}>{b}</p>
            </section>
          ))}
          <div style={{ marginTop: 30, borderTop: '1px solid var(--line)', paddingTop: 20, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <Link href="/request" className="btn">اطلب نقلاً ←</Link>
            <Link href="/privacy-policy" style={{ color: 'var(--gold)', fontWeight: 700, alignSelf: 'center' }}>الخصوصية</Link>
            <Link href="/terms" style={{ color: 'var(--gold)', fontWeight: 700, alignSelf: 'center' }}>الشروط</Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:720px){.doc-grid{grid-template-columns:1fr!important}.doc-nav{position:static!important}}`}</style>
    </main>
  );
}

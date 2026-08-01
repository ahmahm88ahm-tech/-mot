'use client';
import Link from 'next/link';
import { CinematicHero } from '@/components/hero/cinematic-hero';
import { useInView, useCountUp } from '@/lib/useInView';

const PHONE = '05801444166';
const CITIES = ['الرياض','جدة','الدمام','مكة المكرمة','المدينة المنورة','الخبر','الطائف','تبوك','الأحساء','بريدة','حائل','جازان'];
const SERVICES = [
  { t: 'نقل عفش المنازل', d: 'نقل شامل لشقتك أو فيلتك — فك، تغليف، نقل، ثم تركيب في بيتك الجديد.' },
  { t: 'فك وتركيب', d: 'فنيون يفكون ويركّبون غرف النوم، المطابخ، الستائر والمكيفات بدقة.' },
  { t: 'تغليف وحماية', d: 'تغليف كل قطعة بمواد حماية حقيقية — فقاعات، كراتين، وأغطية مبطّنة.' },
  { t: 'نقل المكاتب والشركات', d: 'ننقل مكتبك كاملاً دون أن يتوقف عملك — ليلاً أو في العطلة.' },
  { t: 'نقل بين المدن', d: 'نقل آمن بين مدن المملكة بأسطول مجهّز وفريق مدرّب.' },
  { t: 'ونش ورفع الأثاث', d: 'رافعات للأدوار العليا والأثاث الثقيل الذي لا يمرّ بالممرات.' },
];

function Counter({ to, on, fixed }: { to: number; on: boolean; fixed?: number }) {
  const v = useCountUp(to, on);
  return <span className="bignum gold-metal">{fixed ?? v}</span>;
}

export default function Home() {
  const id = useInView(0.12);
  const svc = useInView(0.1);
  const nums = useInView(0.2);

  return (
    <main>
      {/* ═══ HERO سينمائي بعرض كامل — لا بطاقة سوداء ═══ */}
      <CinematicHero />

      {/* ═══ شريط المدن ═══ */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">{[...CITIES, ...CITIES].map((c, i) => <span key={i}><i>◆</i> {c}</span>)}</div>
      </div>

      {/* ═══ الهوية — شريط بصري، لا بطاقة سوداء ضخمة ═══ */}
      <section className="wrap" style={{ paddingTop: 76, paddingBottom: 30 }}>
        <div className={`id-strip reveal ${id.inView ? 'in' : ''}`}>
          <div>
            <span className="kicker">هويتنا</span>
            <h2 className="h-display" style={{ fontSize: 'clamp(28px, 4.4vw, 46px)', marginTop: 10 }}>ننقل <em>بمسؤولية</em><br />وأمانة حقيقية</h2>
            <p className="lede" style={{ marginTop: 16 }}>
              منذ 2018 ونحن نؤمن بمبدأ واحد: لا تدفع حتى يُنجَز العمل. فريقنا مدرّب على الاحترافية والدقة في كل التفاصيل، من التركيبات الأساسية حتى آخر قطعة.
            </p>
            <Link href="/request" className="btn" style={{ marginTop: 24 }}>ابدأ الآن ←</Link>
            <div className="id-facts">
              {[['2018','سنة التأسيس','انطلقنا منها'],['+6','سنوات','خبرة في المجال'],['مدرّبون','فنيون','لا عمالة عشوائية'],['المملكة','تغطية','جميع المناطق']].map(([v,k,d]) => (
                <div className="f" key={k}><div className="v">{v}</div><div className="k">{k}</div><div className="d">{d}</div></div>
              ))}
            </div>
          </div>
          {/* بصري: صورة حقيقية إن وُجدت وإلا مشهد مصغّر حيّ */}
          <div className="id-visual">
            {/* ضع صورة الفريق الحقيقية في /public/images/team-real.jpg لتظهر هنا */}
            <svg className="fallback" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <linearGradient id="idSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#33405c"/><stop offset=".6" stopColor="#c47b3a"/><stop offset="1" stopColor="#f0b25a"/></linearGradient>
                <linearGradient id="idG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a3620"/><stop offset="1" stopColor="#1a140c"/></linearGradient>
              </defs>
              <rect width="600" height="360" fill="url(#idSky)" />
              <circle cx="470" cy="120" r="40" fill="#fff0c2" opacity=".9" />
              <rect y="220" width="600" height="140" fill="url(#idG)" />
              <path d="M0 250 Q300 220 600 250 L600 270 Q300 240 0 270Z" fill="#3a3026" />
              {/* قافلة صغيرة تتحرك */}
              <g style={{ animation: 'truckMove1 14s linear infinite' }}>
                <rect x="0" y="206" width="70" height="34" rx="4" fill="#1c1610" stroke="#c9a24c" strokeWidth="2" />
                <path d="M70 240 V214 H86 L98 226 V240Z" fill="#2a2117" stroke="#c9a24c" strokeWidth="2" />
                <circle cx="20" cy="242" r="8" fill="#0d0c0a" stroke="#c9a24c" strokeWidth="2" />
                <circle cx="84" cy="242" r="8" fill="#0d0c0a" stroke="#c9a24c" strokeWidth="2" />
                <text x="14" y="228" fontFamily="Reem Kufi" fontSize="11" fill="#ecd28a" fontWeight="700">مُتنقِّل</text>
              </g>
              <g className="sway" opacity=".6"><rect x="120" y="150" width="6" height="80" rx="3" fill="#3a2a18"/><g fill="#2f3a1e"><path d="M123 152 q-30 -7 -44 6 q28 -1 44 4Z"/><path d="M123 152 q30 -7 44 6 q-28 -1 -44 4Z"/></g></g>
            </svg>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(13,12,10,.55), transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: 16, right: 18, left: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="gold-metal" style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 22 }}>مُتنقِّل</span>
              <span style={{ fontSize: 11, color: 'var(--gold-s)', letterSpacing: '.1em' }}>مسجلة 2018 · خبرة +6 سنوات</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ الخدمات ═══ */}
      <section id="services" className="wrap" style={{ paddingTop: 60, paddingBottom: 30 }}>
        <div className={`reveal ${svc.inView ? 'in' : ''}`} style={{ marginBottom: 32 }}>
          <span className="kicker">خدماتنا</span>
          <h2 className="h-display" style={{ fontSize: 'clamp(28px, 4.4vw, 48px)', marginTop: 10 }}>كل خدمة <em>بسعرها العادل</em></h2>
          <p className="lede" style={{ marginTop: 12 }}>التكلفة تختلف حسب نوعية الأثاث — لذلك نعرض الخدمة، ونحسب لك السعر حسب الطلب.</p>
        </div>
        <div className="bento">
          {SERVICES.map((s, i) => (
            <div key={s.t} className={`card svc ${i === 0 || i === 3 ? 's4' : 's2'} reveal ${svc.inView ? 'in' : ''}`} style={{ transitionDelay: `${i * 0.06}s` }}>
              <h3 className="h-display" style={{ fontSize: i === 0 || i === 3 ? 24 : 19 }}>{s.t}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8, maxWidth: 440 }}>{s.d}</p>
              <div className="svc-foot">
                <span className="svc-min">سعر حسب الطلب</span>
                <Link href="/request" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>اطلب عرض سعر ←</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ الأرقام ═══ */}
      <section className="wrap" style={{ paddingTop: 50, paddingBottom: 40 }}>
        <div className={`card reveal ${nums.inView ? 'in' : ''}`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 30, textAlign: 'center' }}>
            <div><Counter to={2018} on={nums.inView} fixed={2018} /><div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>سنة التأسيس</div></div>
            <div><span className="bignum gold-metal">+6</span><div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>سنوات خبرة</div></div>
            <div><Counter to={32} on={nums.inView} /><div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>مدينة مخدومة</div></div>
            <div><span className="bignum gold-metal">100<span className="u">%</span></span><div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>التزام بالموعد</div></div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ذهبي ═══ */}
      <section className="wrap" style={{ paddingBottom: 80 }}>
        <div className="reveal in" style={{ background: 'linear-gradient(120deg, #d6af57, #8f6f2c)', borderRadius: 'var(--radius-lg)', padding: 'clamp(30px,5vw,54px)', color: '#1a1408', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h2 className="h-display" style={{ fontSize: 'clamp(24px,4vw,40px)', color: '#1a1408' }}>جاهز تنقل بيتك؟</h2>
            <p style={{ fontWeight: 700, marginTop: 8, opacity: .85 }}>عرض سعر مجاني — وادفع بعد ما تشوف أثاثك مركّب.</p>
          </div>
          <Link href="/request" className="btn" style={{ background: '#14110c', color: 'var(--gold-s)', boxShadow: 'none' }}>اطلب الآن ←</Link>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--line)', padding: '32px 0 40px', color: 'var(--muted)', fontSize: 13 }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <span>© {new Date().getFullYear()} مُتنقِّل · تأسست 2018 · خبرة +6 سنوات · <Link href="/privacy-policy" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>الخصوصية</Link> · <Link href="/terms" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>الشروط</Link></span>
          <a href={`tel:${PHONE}`} style={{ color: 'var(--gold-s)', fontWeight: 700, direction: 'ltr' }}>{PHONE}</a>
        </div>
      </footer>
    </main>
  );
}

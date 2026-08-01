'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

const PHONE = '05801444166';

// 🔑 مفتاح الصورة الحقيقية: ضع صورة في /public/images/hero-scene.jpg
//    ثم غيّر القيمة إلى '/images/hero-scene.jpg' فتحلّ محل طبقة السماء
//    مع بقاء الشاحنات المتحركة فوقها. null = استخدم المشهد المرسوم.
const SCENE_PHOTO: string | null = null;

/* ── شاحنة مُتنقِّل (HTML overlay متحرك) ── */
function Truck() {
  return (
    <svg viewBox="0 0 240 120" fill="none" aria-hidden="true">
      {/* خطوط السرعة */}
      <g stroke="#f6e09a" strokeWidth="3" strokeLinecap="round" opacity=".7">
        <line x1="2" y1="44" x2="34" y2="44" /><line x1="0" y1="56" x2="40" y2="56" /><line x1="6" y1="68" x2="32" y2="68" />
      </g>
      {/* الصندوق — هوية ذهبية */}
      <rect x="40" y="22" width="120" height="66" rx="6" fill="#1c1610" stroke="#c9a24c" strokeWidth="3" />
      <rect x="40" y="22" width="120" height="14" rx="6" fill="#c9a24c" opacity=".22" />
      {/* شعار بيت+شاحنة مصغّر على الصندوق */}
      <g stroke="#e7b53c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M70 50 L84 40 L98 50" /><path d="M73 50 V66 H95 V50" />
        <path d="M78 64 V58 H90 V64" strokeWidth="1.8" />
      </g>
      <text x="118" y="62" fontFamily="Reem Kufi, sans-serif" fontWeight="700" fontSize="13" fill="#ecd28a">مُتنقِّل</text>
      {/* الكابينة */}
      <path d="M160 88 V44 H186 L206 62 V88 Z" fill="#2a2117" stroke="#c9a24c" strokeWidth="3" strokeLinejoin="round" />
      <path d="M166 50 H182 L196 64 H166 Z" fill="#9fd0e6" opacity=".55" />
      <rect x="200" y="70" width="8" height="6" rx="1.5" fill="#ffd86b" />
      {/* العجلات */}
      <g>
        <circle className="wheel" cx="74" cy="92" r="13" fill="#0d0c0a" stroke="#c9a24c" strokeWidth="3" />
        <circle className="wheel" cx="178" cy="92" r="13" fill="#0d0c0a" stroke="#c9a24c" strokeWidth="3" />
        <circle cx="74" cy="92" r="4" fill="#c9a24c" /><circle cx="178" cy="92" r="4" fill="#c9a24c" />
      </g>
    </svg>
  );
}

export function CinematicHero() {
  const ref = useRef<HTMLDivElement>(null);

  // parallax خفيف بالماوس — عمق حيّ دون دوخة
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="scene" ref={ref} aria-label="مُتنقِّل — نقل الأثاث باحترافية">
      {/* ── طبقة المشهد المرسوم (أو صورة حقيقية إن وُجدت) ── */}
      <svg className="scene-svg" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a3550" />
            <stop offset="0.42" stopColor="#7d5a52" />
            <stop offset="0.7" stopColor="#d98a4a" />
            <stop offset="0.88" stopColor="#f0b25a" />
            <stop offset="1" stopColor="#f6d28a" />
          </linearGradient>
          <radialGradient id="sunG" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff3cf" /><stop offset="0.4" stopColor="#ffd86b" /><stop offset="1" stopColor="#ffd86b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a4326" /><stop offset="1" stopColor="#241a10" />
          </linearGradient>
          <linearGradient id="villa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3e7cf" /><stop offset="1" stopColor="#cdb98f" />
          </linearGradient>
          <linearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d0c0a" stopOpacity="0" /><stop offset="1" stopColor="#0d0c0a" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* سماء */}
        <rect width="1440" height="760" fill="url(#sky)" />
        {/* شمس + هالة نابضة */}
        <circle className="sun-halo" cx="1040" cy="300" r="150" fill="url(#sunG)" />
        <circle cx="1040" cy="300" r="52" fill="#fff0c2" />
        {/* غيوم ت drift */}
        <g className="cloud" fill="#fbe6c4" opacity=".5">
          <ellipse cx="300" cy="150" rx="80" ry="20" /><ellipse cx="360" cy="138" rx="56" ry="16" />
        </g>
        <g className="cloud2" fill="#fbe6c4" opacity=".35">
          <ellipse cx="820" cy="110" rx="64" ry="15" /><ellipse cx="870" cy="100" rx="44" ry="12" />
        </g>

        {/* نخيل بعيد يتمايل */}
        <g className="sway" opacity=".55">
          <rect x="196" y="330" width="8" height="120" rx="4" fill="#3a2a18" />
          <g fill="#2f3a1e"><path d="M200 332 q-44 -10 -64 8 q40 -2 64 6 Z" /><path d="M200 332 q44 -10 64 8 q-40 -2 -64 6 Z" /><path d="M200 330 q-20 -40 -8 -64 q6 36 8 60 Z" /><path d="M200 330 q20 -40 8 -64 q-6 36 -8 60 Z" /></g>
        </g>
        <g className="sway2" opacity=".45">
          <rect x="1286" y="350" width="7" height="100" rx="3" fill="#3a2a18" />
          <g fill="#2f3a1e"><path d="M1290 352 q-38 -8 -54 7 q34 -2 54 5 Z" /><path d="M1290 352 q38 -8 54 7 q-34 -2 -54 5 Z" /><path d="M1290 350 q-16 -34 -6 -54 q5 30 6 50 Z" /></g>
        </g>

        {/* الفيلا السعودية الحديثة — يسار-وسط المشهد */}
        <g>
          <rect x="150" y="300" width="320" height="170" rx="6" fill="url(#villa)" />
          <rect x="150" y="300" width="320" height="20" fill="#b89e6f" />
          <rect x="430" y="250" width="120" height="220" rx="6" fill="url(#villa)" />
          <rect x="430" y="250" width="120" height="18" fill="#b89e6f" />
          {/* نوافذ مضيئة دافئة */}
          <g fill="#ffd86b" opacity=".85">
            <rect x="180" y="340" width="46" height="56" rx="3" /><rect x="250" y="340" width="46" height="56" rx="3" />
            <rect x="320" y="340" width="46" height="56" rx="3" /><rect x="455" y="290" width="34" height="44" rx="3" />
            <rect x="500" y="290" width="34" height="44" rx="3" />
          </g>
          <g stroke="#a98c5c" strokeWidth="2"><line x1="203" y1="340" x2="203" y2="396" /><line x1="273" y1="340" x2="273" y2="396" /><line x1="343" y1="340" x2="343" y2="396" /></g>
          {/* البوابة */}
          <rect x="372" y="400" width="44" height="70" rx="3" fill="#6b5230" />
          {/* مسبح لامع */}
          <ellipse cx="640" cy="486" rx="86" ry="20" fill="#7fc6d6" opacity=".7" />
          <ellipse cx="640" cy="482" rx="86" ry="18" fill="#a9dde8" opacity=".5" />
          {/* شجيرات */}
          <g fill="#33401f"><circle cx="150" cy="468" r="20" /><circle cx="178" cy="472" r="16" /><circle cx="560" cy="470" r="18" /></g>
        </g>

        {/* الأرض والطريق */}
        <rect x="0" y="470" width="1440" height="290" fill="url(#ground)" />
        <path d="M0 560 Q720 500 1440 560 L1440 600 Q720 540 0 600 Z" fill="#3a3026" />
        <path d="M0 578 Q720 520 1440 578" stroke="#e7b53c" strokeWidth="3" strokeDasharray="34 30" opacity=".7" fill="none" />

        {/* فريق + صناديق قرب الفيلا (إحساس العمل الفعلي) */}
        <g>
          {/* صناديق مكدّسة */}
          <g stroke="#8f6f2c" strokeWidth="2" fill="#c79a4a">
            <rect x="500" y="430" width="34" height="30" rx="2" /><rect x="536" y="430" width="34" height="30" rx="2" />
            <rect x="518" y="400" width="34" height="30" rx="2" />
          </g>
          {/* عاملان يحملان صندوق */}
          <g fill="#1c1610">
            <circle cx="600" cy="420" r="9" /><rect x="593" y="430" width="14" height="26" rx="5" />
            <circle cx="660" cy="420" r="9" /><rect x="653" y="430" width="14" height="26" rx="5" />
            <rect x="608" y="432" width="44" height="14" rx="2" fill="#c79a4a" stroke="#8f6f2c" strokeWidth="1.5" />
          </g>
          {/* لمسة الزي الموحّد — شريط ذهبي */}
          <rect x="593" y="432" width="14" height="4" fill="#e7b53c" /><rect x="653" y="432" width="14" height="4" fill="#e7b53c" />
        </g>

        {/* دمج سفلي لفحمي الهوية */}
        <rect x="0" y="560" width="1440" height="200" fill="url(#fadeBottom)" />
      </svg>

      {/* صورة حقيقية اختيارية فوق السماء (تحت الشاحنات) */}
      {SCENE_PHOTO && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={SCENE_PHOTO} alt="" aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: .9 }} />
      )}

      {/* ── الشاحنات المتحركة ── */}
      <div className="trucks scene-fg" aria-hidden="true">
        <div className="truck t3"><Truck /></div>
        <div className="truck t2"><Truck /></div>
        <div className="truck t1"><Truck /></div>
      </div>

      {/* ── البطاقة الزجاجية — المحتوى فوق المشهد ── */}
      <div className="glass">
        <span className="badge gold"><span className="dot" /> مسجلة 2018 · خبرة +6 سنوات</span>
        <h1 className="h-display" style={{ fontSize: 'clamp(32px, 4.6vw, 54px)', marginTop: 16, lineHeight: 1.06 }}>
          نقل الأثاث<br /><em>وتركيبه</em><br />باحترافية وأمان
        </h1>
        <p style={{ color: 'var(--paper)', opacity: .85, marginTop: 14, fontSize: 15, lineHeight: 1.7 }}>
          فنيون مدرّبون، تتبع لحظي لسائقك، وملاحظات كل قطعة. وادفع بعد أن ترى أثاثك مركّباً — هذه مصداقيتنا منذ 2018.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <Link href="/request" className="btn">اطلب عرض السعر المجاني ←</Link>
          <Link href="#services" className="btn ghost">تعرّف على خدماتنا</Link>
        </div>
        <div className="trust-glass">
          <div><span className="tk">✓</span> ادفع بعد إنجاز العمل</div>
          <div><span className="tk">✓</span> ضمان على الأثاث</div>
          <div><span className="tk">✓</span> التزام بالموعد</div>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true"><span className="mouse" />اكتشف</div>
    </section>
  );
}

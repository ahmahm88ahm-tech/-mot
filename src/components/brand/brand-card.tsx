import { LogoMark } from './logo';

const PHONE = '05801444166';

const FEATS = [
  { t: 'نقل آمن', i: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h13v13H1z"/><path d="M14 8h4l3 3v5h-3"/><circle cx="6" cy="18.5" r="2"/><circle cx="17" cy="18.5" r="2"/></svg> },
  { t: 'فك وتركيب باحترافية', i: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6z"/></svg> },
  { t: 'حماية شاملة للأثاث', i: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11h18v6H3z"/><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 14h18"/></svg> },
  { t: 'مصداقية وضمان', i: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></svg> },
];

const STRIP = [
  { t: 'فريق عمل متخصص', i: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { t: 'التزام بالوقت', i: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> },
  { t: 'خبرة في جميع مناطق المملكة', i: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z"/></svg> },
];

export function BrandCard() {
  return (
    <div className="brandcard" style={{ animation: 'floaty 7s ease-in-out infinite' }}>
      <div className="bc-inner">
        <div style={{ display: 'flex', justifyContent: 'center' }}><LogoMark size={120} /></div>
        <div className="bc-name gold-metal">مُتنقِّل</div>
        <div className="bc-sub">لنقل الأثاث فك وتركيب باحترافية وأمان</div>
        <div className="bc-feats">
          {FEATS.map((f) => (
            <div className="bc-feat" key={f.t}>{f.i}<span>{f.t}</span></div>
          ))}
        </div>
        <div className="bc-contact">
          <a href={`tel:${PHONE}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span><span className="lbl">تواصل معنا</span><span className="num">{PHONE}</span></span>
          </a>
          <div className="div" />
          <a href={`https://wa.me/966${PHONE}`} target="_blank" rel="noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.1 1.7.7 2.3.8 3.1.7.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z"/></svg>
            <span><span className="lbl">واتساب</span><span className="num">{PHONE}</span></span>
          </a>
        </div>
        <div className="bc-strip">
          {STRIP.map((s) => <div key={s.t}>{s.i}{s.t}</div>)}
        </div>
      </div>
    </div>
  );
}
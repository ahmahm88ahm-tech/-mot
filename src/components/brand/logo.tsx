export function LogoMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.66} viewBox="0 0 200 132" fill="none" aria-label="شعار مُتنقِّل" role="img">
      <defs>
        <linearGradient id="mq-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e09a" />
          <stop offset="0.45" stopColor="#d6af57" />
          <stop offset="0.75" stopColor="#b78f3c" />
          <stop offset="1" stopColor="#8f6f2c" />
        </linearGradient>
      </defs>
      <g stroke="url(#mq-gold)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1="6" y1="52" x2="44" y2="52" strokeWidth="5" />
        <line x1="2" y1="64" x2="48" y2="64" strokeWidth="6" />
        <line x1="10" y1="76" x2="44" y2="76" strokeWidth="4" />
        <path d="M60 48 L98 20 L136 48" />
        <path d="M66 48 V92 H132 V48" />
        <path d="M132 92 V62 H150 L162 74 V92" />
        <line x1="150" y1="66" x2="158" y2="74" strokeWidth="3" />
        <path d="M72 86 L72 76 L76 76 L76 71 L92 71 L92 76 L96 76 L96 86" strokeWidth="4" />
        <line x1="72" y1="86" x2="96" y2="86" strokeWidth="4" />
        <rect x="104" y="63" width="20" height="23" rx="2" strokeWidth="4" />
        <line x1="114" y1="63" x2="114" y2="86" strokeWidth="3" />
      </g>
      <g fill="url(#mq-gold)">
        <circle cx="90" cy="99" r="9" /><circle cx="150" cy="99" r="9" />
      </g>
      <g fill="#0d0c0a">
        <circle cx="90" cy="99" r="3.4" /><circle cx="150" cy="99" r="3.4" />
      </g>
      <g fill="url(#mq-gold)">
        <circle cx="98" cy="8" r="4.6" /><circle cx="118" cy="8" r="4.6" />
      </g>
    </svg>
  );
}

export function LogoText({ className = '' }: { className?: string }) {
  return <span className={`gold-metal ${className}`} style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>مُتنقِّل</span>;
}
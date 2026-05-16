/* Orbita v2 — Shared helper components */

function OrbLogo({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 30%, #3a0a0a 0%, #1a0606 55%, #08080c 100%)',
      boxShadow: `0 0 ${size*0.8}px rgba(200, 16, 46, 0.45), inset 0 0 ${size*0.25}px rgba(212,175,55,0.25)`,
      border: '1px solid rgba(212,175,55,0.5)',
      display: 'grid', placeItems: 'center',
      position: 'relative',
    }}>
      <svg viewBox="0 0 180 180" width={size * 0.78} height={size * 0.78} style={{ display: 'block' }}>
        <defs>
          <linearGradient id={`orblg-gold-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4D17A"/>
            <stop offset="50%" stopColor="#D4AF37"/>
            <stop offset="100%" stopColor="#9A7B1F"/>
          </linearGradient>
        </defs>
        <g fill={`url(#orblg-gold-${size})`}>
          <path d="M90 70 C 70 64, 50 70, 32 90 C 50 86, 62 90, 72 100 C 60 102, 50 110, 44 122 C 60 116, 76 116, 86 124 L 90 116 Z"/>
          <path d="M90 70 C 110 64, 130 70, 148 90 C 130 86, 118 90, 108 100 C 120 102, 130 110, 136 122 C 120 116, 104 116, 94 124 L 90 116 Z"/>
          <path d="M84 70 L 96 70 L 100 92 L 96 122 L 90 132 L 84 122 L 80 92 Z"/>
          <path d="M88 64 C 88 58, 92 54, 98 54 L 106 60 L 100 64 L 100 70 L 92 70 Z"/>
          <path d="M84 122 L 78 138 L 90 132 L 102 138 L 96 122 Z"/>
        </g>
      </svg>
    </div>
  );
}

function SpriteRender({ cls, spriteIndex, size = 200 }) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (!ref.current || !window.OrbitaSprites) return;
    const ptMap = { warrior: 'guerreiro', mage: 'mago', monk: 'monge', archer: 'arqueiro', paladin: 'paladino' };
    const baseLvls = [1, 4, 7, 10, 15];
    const classLvls = [30, 50, 70, 90, 100];
    let key;
    if (spriteIndex >= 5) {
      const pt = ptMap[cls] || cls;
      key = `${pt}_${classLvls[spriteIndex - 5]}`;
    } else {
      key = `avatar_${baseLvls[spriteIndex] || 1}`;
    }
    try { ref.current.innerHTML = window.OrbitaSprites.renderSVG(key); }
    catch (e) { ref.current.innerHTML = `<div style="color:#666;font-size:10px">sprite: ${key}</div>`; }
  }, [cls, spriteIndex, size]);
  return <div ref={ref} className="sprite-render" style={{ width: size, height: size * 1.375, display: 'grid', placeItems: 'center' }} />;
}

function TrophyBadge({ tier, label }) {
  const colors = {
    gold: { bg: 'linear-gradient(135deg, #ffd76a, #ff9f32)', shadow: 'rgba(255, 168, 50, 0.5)' },
    silver: { bg: 'linear-gradient(135deg, #e8e8f0, #9ea5b8)', shadow: 'rgba(200, 200, 220, 0.35)' },
    bronze: { bg: 'linear-gradient(135deg, #d4884f, #8a4a22)', shadow: 'rgba(200, 110, 60, 0.4)' },
  };
  const c = colors[tier] || colors.bronze;
  return (
    <div className={`trophy-badge ${tier}`}>
      <span style={{ width: 20, height: 20, borderRadius: '50%', background: c.bg, display: 'grid', placeItems: 'center', fontSize: 11, boxShadow: `0 0 14px ${c.shadow}` }}>🏆</span>
      {label}
    </div>
  );
}

function ToastLayer() {
  const { toasts } = useData();
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'xp' && <span style={{ color: 'var(--neon-a)' }}>⚡</span>}
          {t.type === 'levelup' && <span>🎉</span>}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

window.OrbLogo = OrbLogo;
window.SpriteRender = SpriteRender;
window.TrophyBadge = TrophyBadge;
window.ToastLayer = ToastLayer;

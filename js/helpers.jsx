/* Orbita v2 — Shared helper components */

function OrbLogo({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #ffbae0, #ff2e88 30%, #b066ff 55%, #5b8dff 80%, #1a1a2e 100%)',
      boxShadow: `0 0 ${size*0.8}px rgba(255,46,136,0.45), inset 0 0 ${size*0.3}px rgba(255,255,255,0.2)`,
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '15%', left: '22%',
        width: '24%', height: '18%', borderRadius: '50%',
        background: 'rgba(255,255,255,0.55)', filter: 'blur(1px)',
      }} />
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

/* Orbita v2 — Theme system with visual picker */

const THEMES = [
  { id: 'default', name: 'Neon Glass', bg: '#08080c', orb1: '#ff2e88', orb2: '#5b8dff', accent: '#ff2e88', accent2: '#5b8dff', surface: 'rgba(255,255,255,0.04)', text: '#e8e8f0', line: 'rgba(255,255,255,0.08)' },
  { id: 'teal', name: 'Teal & Cobre', bg: '#0a100f', orb1: '#1abc9c', orb2: '#e67e22', accent: '#1abc9c', accent2: '#e67e22', surface: 'rgba(255,255,255,0.04)', text: '#e0ede8', line: 'rgba(255,255,255,0.08)' },
  { id: 'outono', name: 'Outono', bg: '#0f0a08', orb1: '#e67e22', orb2: '#c0392b', accent: '#e67e22', accent2: '#c0392b', surface: 'rgba(255,255,255,0.04)', text: '#f0e6d8', line: 'rgba(255,255,255,0.08)' },
  { id: 'nord', name: 'Nord', bg: '#2e3440', orb1: '#88c0d0', orb2: '#b48ead', accent: '#88c0d0', accent2: '#b48ead', surface: 'rgba(255,255,255,0.05)', text: '#eceff4', line: 'rgba(255,255,255,0.1)' },
  { id: 'cobre', name: 'Cobre', bg: '#0d0806', orb1: '#cd7f32', orb2: '#8b4513', accent: '#cd7f32', accent2: '#ff6b35', surface: 'rgba(255,255,255,0.04)', text: '#f0dcc0', line: 'rgba(255,255,255,0.08)' },
  { id: 'sage', name: 'Sage & Mint', bg: '#080d0a', orb1: '#2d6a4f', orb2: '#74c69d', accent: '#74c69d', accent2: '#40916c', surface: 'rgba(255,255,255,0.04)', text: '#d8f0e0', line: 'rgba(255,255,255,0.08)' },
  { id: 'neon_forest', name: 'Neon Forest', bg: '#050a08', orb1: '#00ff88', orb2: '#006644', accent: '#00ff88', accent2: '#00cc66', surface: 'rgba(255,255,255,0.04)', text: '#d0f0d8', line: 'rgba(255,255,255,0.08)' },
  { id: 'rose_gold', name: 'Rose Gold', bg: '#0d0808', orb1: '#b76e79', orb2: '#f0c4a8', accent: '#e8a0b0', accent2: '#c97b84', surface: 'rgba(255,255,255,0.04)', text: '#f0e0e4', line: 'rgba(255,255,255,0.08)' },
  { id: 'ocean', name: 'Ocean', bg: '#060d14', orb1: '#006994', orb2: '#00b4d8', accent: '#00b4d8', accent2: '#0077b6', surface: 'rgba(255,255,255,0.04)', text: '#d0e8f0', line: 'rgba(255,255,255,0.08)' },
  { id: 'porcelana', name: 'Porcelana', bg: '#f5f0eb', orb1: '#d4a0ff', orb2: '#ff8fbf', accent: '#8b6fff', accent2: '#d4a0ff', surface: 'rgba(0,0,0,0.04)', text: '#1a1a2e', line: 'rgba(0,0,0,0.10)' },
  { id: 'paper', name: 'Paper', bg: '#fafaf5', orb1: '#a8a0f0', orb2: '#f0a0c0', accent: '#6c63ff', accent2: '#a855f7', surface: 'rgba(0,0,0,0.04)', text: '#1a1a2e', line: 'rgba(0,0,0,0.10)' },
  { id: 'midnight', name: 'Midnight', bg: '#0a0a1a', orb1: '#4a00e0', orb2: '#8e2de2', accent: '#8e2de2', accent2: '#a855f7', surface: 'rgba(255,255,255,0.04)', text: '#e0e0f0', line: 'rgba(255,255,255,0.08)' },
  { id: 'fluminense', name: 'Fluminense', bg: '#0e0608', orb1: '#8b1a2b', orb2: '#1a7a4a', accent: '#a0203a', accent2: '#22915a', surface: 'rgba(255,255,255,0.04)', text: '#f2e4e8', line: 'rgba(255,255,255,0.08)' },
];

function applyTheme(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const root = document.documentElement;

  if (themeId === 'default' || !themeId) {
    // Reset to original tokens.css — remove all inline overrides
    const props = ['--bg-0','--bg-1','--bg-2','--bg-3','--neon-a','--neon-b','--neon-c','--ink-0','--ink-1','--ink-2','--ink-3','--ink-4',
      '--line','--line-2','--glass-bg','--glass-bg-strong','--glass-border','--glass-border-hover','--gradient-neon','--gradient-neon-soft',
      '--neon-glow','--shadow-card','--shadow-float','--glass-blur','--glass-blur-strong'];
    props.forEach(p => root.style.removeProperty(p));
    document.body.style.background = '';
    document.body.style.removeProperty('--grain-opacity');
    document.body.classList.remove('theme-light');
    const oldWm = document.getElementById('theme-watermark'); if (oldWm) oldWm.remove();
    return;
  }

  const isLight = theme.id === 'porcelana' || theme.id === 'paper';
  const mid = mixColors(theme.accent, theme.accent2);

  root.style.setProperty('--bg-0', theme.bg);
  root.style.setProperty('--neon-a', theme.accent);
  root.style.setProperty('--neon-b', theme.accent2);
  root.style.setProperty('--neon-c', mid);
  root.style.setProperty('--ink-1', theme.text);
  root.style.setProperty('--glass-bg', theme.surface);
  root.style.setProperty('--glass-border', theme.line);
  root.style.setProperty('--line', theme.line);
  root.style.setProperty('--gradient-neon', `linear-gradient(135deg, ${theme.accent} 0%, ${mid} 50%, ${theme.accent2} 100%)`);
  root.style.setProperty('--gradient-neon-soft', `linear-gradient(135deg, ${theme.accent}33, ${theme.accent2}28)`);
  root.style.setProperty('--neon-glow', `0 0 40px ${theme.accent}55, 0 0 80px ${theme.accent2}35`);

  document.body.classList.toggle('theme-light', isLight);
  document.body.style.setProperty('--grain-opacity', isLight ? '0' : '0.4');

  if (isLight) {
    root.style.setProperty('--ink-0', '#111118');
    root.style.setProperty('--ink-1', '#1a1a2e');
    root.style.setProperty('--ink-2', '#3a3a4a');
    root.style.setProperty('--ink-3', '#6a6a7a');
    root.style.setProperty('--ink-4', '#9a9aaa');
    root.style.setProperty('--bg-1', theme.bg);
    root.style.setProperty('--bg-2', '#e8e6de');
    root.style.setProperty('--bg-3', '#dddbd4');
    root.style.setProperty('--line', 'rgba(0,0,0,0.08)');
    root.style.setProperty('--line-2', 'rgba(0,0,0,0.14)');
    root.style.setProperty('--glass-bg', 'rgba(255,255,255,0.6)');
    root.style.setProperty('--glass-bg-strong', 'rgba(255,255,255,0.75)');
    root.style.setProperty('--glass-border', 'rgba(0,0,0,0.08)');
    root.style.setProperty('--glass-border-hover', 'rgba(0,0,0,0.18)');
    root.style.setProperty('--glass-blur', 'blur(20px) saturate(120%)');
    root.style.setProperty('--glass-blur-strong', 'blur(30px) saturate(130%)');
    root.style.setProperty('--shadow-card', '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)');
    root.style.setProperty('--shadow-float', '0 4px 20px -6px rgba(0,0,0,0.15)');
    root.style.setProperty('--gradient-neon-soft', `linear-gradient(135deg, ${theme.accent}22, ${theme.accent2}18)`);
  } else {
    document.body.style.removeProperty('--grain-opacity');
    root.style.setProperty('--ink-2', '#a8a8bc');
    root.style.setProperty('--ink-3', '#6a6a80');
    root.style.setProperty('--ink-4', '#3a3a4a');
    root.style.setProperty('--line-2', 'rgba(255,255,255,0.14)');
    root.style.setProperty('--glass-bg-strong', 'rgba(255,255,255,0.07)');
    root.style.setProperty('--glass-border-hover', 'rgba(255,255,255,0.16)');
  }

  // Remove previous watermark
  const oldWm = document.getElementById('theme-watermark');
  if (oldWm) oldWm.remove();

  if (themeId === 'fluminense') {
    const wm = document.createElement('div');
    wm.id = 'theme-watermark';
    wm.style.cssText = 'position:fixed;bottom:10%;right:5%;width:300px;height:300px;opacity:0.08;pointer-events:none;z-index:0;background-size:contain;background-repeat:no-repeat;background-position:center;background-image:url("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Fluminense_FC_Logo.svg/200px-Fluminense_FC_Logo.svg.png")';
    document.body.appendChild(wm);
  }

  document.body.style.background = `
    radial-gradient(900px 700px at 88% -10%, ${theme.orb1}28, transparent 55%),
    radial-gradient(800px 800px at -10% 110%, ${theme.orb2}24, transparent 60%),
    radial-gradient(600px 500px at 50% 40%, ${mid}0d, transparent 60%),
    ${theme.bg}`;
}

function mixColors(c1, c2) {
  const h = s => parseInt(s.slice(1), 16);
  const a = h(c1), b = h(c2);
  const r = ((a >> 16 & 0xff) + (b >> 16 & 0xff)) >> 1;
  const g = ((a >> 8 & 0xff) + (b >> 8 & 0xff)) >> 1;
  const bl = ((a & 0xff) + (b & 0xff)) >> 1;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
}

function ThemePicker({ onClose }) {
  const { data, commit, calendarConnected } = useData();
  const current = data._theme || 'default';
  const [gcalStatus, setGcalStatus] = React.useState(calendarConnected ? 'connected' : 'disconnected');

  React.useEffect(() => {
    function onConn() { setGcalStatus('connected'); }
    function onDisc() { setGcalStatus('disconnected'); }
    window.addEventListener('orbita:calendarConnected', onConn);
    window.addEventListener('orbita:calendarDisconnected', onDisc);
    return () => { window.removeEventListener('orbita:calendarConnected', onConn); window.removeEventListener('orbita:calendarDisconnected', onDisc); };
  }, []);

  function selectTheme(id) {
    applyTheme(id);
    commit(D => { D._theme = id; });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(680px, 92vw)', maxHeight: '85vh' }}>
        <div className="modal-header">
          <h2>Configurações</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '16px 24px 12px' }}>
          <div className="panel" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: gcalStatus === 'connected' ? 'rgba(48,209,88,0.12)' : 'rgba(255,168,48,0.12)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>📅</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Google Calendar</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                {gcalStatus === 'connected' ? 'Eventos aparecem em Hoje → Eventos' : 'Veja seus eventos do Google Calendar no Orbita'}
              </div>
            </div>
            {gcalStatus === 'connected' ? (
              <button className="btn-ghost small" onClick={() => window.OrbitaFirebase.disconnectGoogleCalendar()}
                style={{ fontSize: 11, color: '#ff5555' }}>Desconectar</button>
            ) : (
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 12 }}
                onClick={() => {
                  if (window.OrbitaFirebase && window.OrbitaFirebase.getCurrentUser()) {
                    window.OrbitaFirebase.connectGoogleCalendar();
                  } else {
                    window.OrbitaFirebase.signInWithGoogle(true);
                  }
                }}>Conectar</button>
            )}
          </div>
        </div>
        <div style={{ padding: '4px 24px 8px' }}>
          <div className="eyebrow">Temas</div>
        </div>
        <div style={{ padding: '8px 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, overflowY: 'auto', maxHeight: '60vh' }}>
          {THEMES.map(theme => {
            const active = current === theme.id;
            const isLight = theme.id === 'porcelana' || theme.id === 'paper';
            return (
              <div key={theme.id} onClick={() => selectTheme(theme.id)} style={{
                cursor: 'pointer', borderRadius: 16, overflow: 'hidden',
                border: active ? `2px solid ${theme.accent}` : '2px solid transparent',
                boxShadow: active ? `0 0 20px ${theme.accent}44` : 'none',
                transition: 'all 200ms',
              }}>
                {/* Theme preview card */}
                <div style={{
                  height: 120, padding: 16, position: 'relative', overflow: 'hidden',
                  background: `
                    radial-gradient(120px 100px at 75% 80%, ${theme.orb1}66, transparent),
                    radial-gradient(100px 100px at 85% 90%, ${theme.orb2}55, transparent),
                    ${theme.bg}`,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20,
                    color: theme.text, letterSpacing: '-0.02em',
                  }}>{theme.name}</div>
                  {/* Mini color dots */}
                  <div style={{ position: 'absolute', bottom: 12, left: 16, display: 'flex', gap: 4 }}>
                    <div style={{ width: 14, height: 6, borderRadius: 3, background: theme.accent }} />
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: theme.accent2 }} />
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: theme.line.replace('0.08', '0.3') }} />
                  </div>
                  {active && (
                    <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: theme.accent, display: 'grid', placeItems: 'center', fontSize: 12, color: isLight ? '#fff' : '#fff' }}>✓</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Apply saved theme on load
(function() {
  try {
    const d = JSON.parse(localStorage.getItem('meuPainel_v4'));
    if (d && d._theme) applyTheme(d._theme);
  } catch(e) {}
})();

window.THEMES = THEMES;
window.applyTheme = applyTheme;
window.ThemePicker = ThemePicker;

/* Orbita v2 — Pomodoro Timer (fullscreen + mini bar) */

function Pomodoro({ onClose }) {
  const { toast, addXP } = useData();
  const [seconds, setSeconds] = React.useState(25 * 60);
  const [running, setRunning] = React.useState(false);
  const [mini, setMini] = React.useState(false);
  const [preset, setPreset] = React.useState(25);
  const [cycles, setCycles] = React.useState(0);
  const [focusText, setFocusText] = React.useState('');
  const intervalRef = React.useRef(null);

  React.useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setCycles(c => c + 1);
            addXP(25);
            new Audio('data:audio/wav;base64,UklGRl9vT19teleUsXAABAAEARAAIABAABAAQAAADQBAABAAEARAAIAAgAAAABQAAAExJU1QAAAASU0ZUTAAAAAxMYXZmNTkuMjcuMTAw').play().catch(() => {});
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  React.useEffect(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    document.title = running ? `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} — Orbita` : 'Orbita v2';
    return () => { document.title = 'Orbita v2'; };
  }, [seconds, running]);

  function reset(mins) {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSeconds(mins * 60);
    setPreset(mins);
  }

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const pct = 1 - seconds / (preset * 60);
  const circumference = Math.PI * 2 * 42;

  if (mini) {
    return (
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 900,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px', borderRadius: 14,
        background: 'rgba(14,14,20,0.95)', border: '1px solid var(--line-2)',
        backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-float)',
      }}>
        <span style={{ fontSize: 16 }}>🍅</span>
        <span className="mono" style={{ fontSize: 18, fontWeight: 300, letterSpacing: '-0.02em' }}>
          {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
        </span>
        <button className="btn-ghost small" onClick={() => setRunning(r => !r)}>{running ? '⏸' : '▶'}</button>
        <button className="btn-ghost small" onClick={() => setMini(false)}>↗</button>
        <button className="btn-ghost small" onClick={onClose}>✕</button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 900,
      background: 'rgba(8,8,12,0.97)', backdropFilter: 'blur(40px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 200ms',
    }}>
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8 }}>
        <button className="btn-ghost" onClick={() => setMini(true)}>↙ Mini</button>
        <button className="btn-ghost" onClick={onClose}>✕ Fechar</button>
      </div>

      <div className="eyebrow" style={{ marginBottom: 8 }}>Pomodoro · ciclo {cycles + 1}</div>
      {focusText && <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 24 }}>Foco: {focusText}</div>}

      <div style={{ position: 'relative', width: 260, height: 260, marginBottom: 32 }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#pomoGrad)" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 1s linear' }} />
          <defs>
            <linearGradient id="pomoGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#ff2e88" />
              <stop offset="1" stopColor="#5b8dff" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="mono" style={{ fontSize: 56, fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>{preset} min · {running ? 'rodando' : seconds === 0 ? 'concluído!' : 'pausado'}</div>
        </div>
      </div>

      {seconds === 0 && (
        <div style={{ marginBottom: 24, padding: '12px 20px', borderRadius: 12, background: 'rgba(255,214,10,0.1)', border: '1px solid rgba(255,214,10,0.3)', fontSize: 14 }}>
          🎉 +25 XP! Ciclo {cycles} concluído.
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button className={`btn-ghost ${running ? '' : ''}`} onClick={() => setRunning(r => !r)} style={{ padding: '12px 28px', fontSize: 15 }}>
          {running ? '⏸ Pausar' : seconds === 0 ? '▶ Próximo' : '▶ Iniciar'}
        </button>
        {(running || seconds < preset * 60) && seconds > 0 && (
          <button className="btn-ghost" onClick={() => reset(preset)}>↺ Reset</button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {[25, 15, 5].map(n => (
          <button key={n} className={`tab-btn ${preset === n && !running ? 'active' : ''}`}
            onClick={() => reset(n)}>{n} min</button>
        ))}
      </div>

      {!running && seconds === preset * 60 && (
        <div style={{ marginTop: 24, width: 280 }}>
          <input className="form-input" placeholder="No que vai focar? (opcional)" value={focusText}
            onChange={e => setFocusText(e.target.value)} style={{ textAlign: 'center', fontSize: 13 }}
            onKeyDown={e => { if (e.key === 'Enter') setRunning(true); }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginTop: 20 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ width: 24, height: 4, borderRadius: 2, background: i < cycles % 4 ? 'var(--neon-a)' : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
    </div>
  );
}

window.Pomodoro = Pomodoro;

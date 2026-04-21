/* Orbita v2 — Onboarding flow for new accounts */

function Onboarding({ onComplete }) {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState('');
  const [birthday, setBirthday] = React.useState('');
  const [avatar, setAvatar] = React.useState({ hair: '#5a3418', eye: '#3a9b4e', shirt: '#4a6fa5' });

  const HAIR_COLORS = [
    { c: '#5a3418', l: 'Castanho' }, { c: '#1a1014', l: 'Preto' }, { c: '#c4922a', l: 'Loiro' },
    { c: '#8b3a1a', l: 'Ruivo' }, { c: '#7a6650', l: 'Grisalho' }, { c: '#e8d5b0', l: 'Platina' },
  ];
  const EYE_COLORS = [
    { c: '#3a9b4e', l: 'Verde' }, { c: '#4a7ab5', l: 'Azul' }, { c: '#6a4a2a', l: 'Castanho' },
    { c: '#2a2a2a', l: 'Preto' }, { c: '#8a7a50', l: 'Mel' }, { c: '#6a5aa0', l: 'Violeta' },
  ];
  const SHIRT_COLORS = [
    { c: '#4a6fa5', l: 'Azul' }, { c: '#8b3a3a', l: 'Vermelho' }, { c: '#3a7a4a', l: 'Verde' },
    { c: '#6a5aa0', l: 'Roxo' }, { c: '#b08a3a', l: 'Dourado' }, { c: '#4a4a4a', l: 'Cinza' },
    { c: '#c46a2a', l: 'Laranja' }, { c: '#2a2a2a', l: 'Preto' },
  ];

  function handleFinish() {
    const profile = {
      name: name.trim() || 'Aventureiro',
      birthday: birthday || null,
      avatar,
      onboardingDone: true,
    };
    onComplete(profile);
  }

  const steps = [
    // Step 0: Welcome
    () => (
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ marginBottom: 24 }}><OrbLogo size={64} /></div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 42, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 12 }}>
          Bem-vindo ao Orbita
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 32 }}>
          Produtividade gamificada. Vamos configurar sua conta em 3 passos rápidos.
        </p>
        <button className="btn btn-primary" style={{ padding: '14px 40px', fontSize: 15 }} onClick={() => setStep(1)}>
          Começar →
        </button>
      </div>
    ),

    // Step 1: Name + Birthday
    () => (
      <div style={{ width: 'min(420px, 90vw)' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Passo 1 de 3</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, lineHeight: 1, marginBottom: 24 }}>
          Quem é você?
        </h2>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label">Seu nome</label>
          <input className="form-input" autoFocus placeholder="Como quer ser chamado?" value={name} onChange={e => setName(e.target.value)}
            style={{ fontSize: 16, padding: '14px 16px' }}
            onKeyDown={e => { if (e.key === 'Enter' && name.trim()) setStep(2); }} />
        </div>
        <div className="form-group" style={{ marginBottom: 32 }}>
          <label className="form-label">Data de nascimento</label>
          <input className="form-input" type="date" value={birthday} onChange={e => setBirthday(e.target.value)}
            style={{ fontSize: 14, padding: '12px 16px' }} />
          <div style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 4 }}>O Orbita vai te dar parabéns no seu aniversário</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => setStep(0)}>← Voltar</button>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px 0', fontSize: 14 }}
            onClick={() => setStep(2)} disabled={!name.trim()}>Próximo →</button>
        </div>
      </div>
    ),

    // Step 2: Avatar customization
    () => (
      <div style={{ width: 'min(480px, 90vw)' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Passo 2 de 3</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, lineHeight: 1, marginBottom: 24 }}>
          Seu avatar
        </h2>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* Avatar preview */}
          <div style={{
            width: 120, height: 165, flexShrink: 0, borderRadius: 16,
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <AvatarPreview avatar={avatar} />
          </div>

          {/* Color pickers */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">Cabelo</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {HAIR_COLORS.map(h => (
                  <button key={h.c} onClick={() => setAvatar(a => ({...a, hair: h.c}))}
                    title={h.l} style={{
                      width: 32, height: 32, borderRadius: 8, border: avatar.hair === h.c ? '2px solid #fff' : '2px solid transparent',
                      background: h.c, cursor: 'pointer', transition: 'all 120ms',
                      boxShadow: avatar.hair === h.c ? `0 0 12px ${h.c}88` : 'none',
                    }} />
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Olhos</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {EYE_COLORS.map(e => (
                  <button key={e.c} onClick={() => setAvatar(a => ({...a, eye: e.c}))}
                    title={e.l} style={{
                      width: 32, height: 32, borderRadius: 8, border: avatar.eye === e.c ? '2px solid #fff' : '2px solid transparent',
                      background: e.c, cursor: 'pointer', transition: 'all 120ms',
                      boxShadow: avatar.eye === e.c ? `0 0 12px ${e.c}88` : 'none',
                    }} />
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Roupa</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SHIRT_COLORS.map(s => (
                  <button key={s.c} onClick={() => setAvatar(a => ({...a, shirt: s.c}))}
                    title={s.l} style={{
                      width: 32, height: 32, borderRadius: 8, border: avatar.shirt === s.c ? '2px solid #fff' : '2px solid transparent',
                      background: s.c, cursor: 'pointer', transition: 'all 120ms',
                      boxShadow: avatar.shirt === s.c ? `0 0 12px ${s.c}88` : 'none',
                    }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="btn-ghost" onClick={() => setStep(1)}>← Voltar</button>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px 0', fontSize: 14 }}
            onClick={() => setStep(3)}>Próximo →</button>
        </div>
      </div>
    ),

    // Step 3: Ready!
    () => (
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ width: 100, height: 138, margin: '0 auto', borderRadius: 16, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
            <AvatarPreview avatar={avatar} />
          </div>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, lineHeight: 1, marginBottom: 8 }}>
          Tudo pronto, {name || 'Aventureiro'}!
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 8 }}>
          Você começa como <strong>Desbravador</strong> no nível 1.
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: 32 }}>
          Complete tarefas e hábitos para ganhar XP. No nível 30 você escolhe uma classe: Guerreiro, Mago, Monge, Arqueiro ou Paladino.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {Object.entries(Orbita.CLASSES_MAP).map(([k, v]) => (
            <div key={k} style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', fontSize: 11, color: 'var(--ink-2)' }}>
              {v.icon} {v.name}
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ padding: '14px 48px', fontSize: 16 }} onClick={handleFinish}>
          Começar jornada →
        </button>
      </div>
    ),
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 28, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,46,136,0.12), transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,141,255,0.10), transparent 60%)', pointerEvents: 'none' }} />

      {/* Progress dots */}
      <div style={{ position: 'fixed', top: 28, display: 'flex', gap: 8 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8, borderRadius: 4,
            background: i <= step ? 'var(--gradient-neon)' : 'rgba(255,255,255,0.08)',
            transition: 'all 300ms',
          }} />
        ))}
      </div>

      {steps[step]()}
    </div>
  );
}

function AvatarPreview({ avatar }) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (!ref.current || !window.OrbitaSprites) return;
    const svg = window.OrbitaSprites.renderSVG('avatar_1');
    // Replace colors in the SVG string
    let colored = svg
      .replace(/#5a3418/gi, avatar.hair)
      .replace(/#3a2010/gi, darken(avatar.hair, 0.6))
      .replace(/#3a9b4e/gi, avatar.eye)
      .replace(/#8ee89a/gi, lighten(avatar.eye, 1.4))
      .replace(/#4a6fa5/gi, avatar.shirt)
      .replace(/#3a5580/gi, darken(avatar.shirt, 0.7));
    ref.current.innerHTML = colored;
  }, [avatar.hair, avatar.eye, avatar.shirt]);

  function darken(hex, factor) {
    const r = Math.round(parseInt(hex.slice(1,3),16) * factor);
    const g = Math.round(parseInt(hex.slice(3,5),16) * factor);
    const b = Math.round(parseInt(hex.slice(5,7),16) * factor);
    return `#${Math.min(255,r).toString(16).padStart(2,'0')}${Math.min(255,g).toString(16).padStart(2,'0')}${Math.min(255,b).toString(16).padStart(2,'0')}`;
  }
  function lighten(hex, factor) { return darken(hex, factor); }

  return <div ref={ref} style={{ width: 80, height: 110, display: 'grid', placeItems: 'center' }} />;
}

// Class selection modal (shown at level 30)
function ClassSelectionModal({ onSelect }) {
  const classes = Object.entries(Orbita.CLASSES_MAP);
  const [selected, setSelected] = React.useState(null);
  const [hovered, setHovered] = React.useState(null);

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div style={{
        width: 'min(640px, 92vw)', padding: '32px 28px', borderRadius: 24,
        background: 'rgba(14,14,20,0.96)', backdropFilter: 'blur(40px)',
        border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-float)',
        textAlign: 'center', animation: 'slideDown 300ms cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>⚔️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, marginBottom: 6 }}>
          Nível 30!
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 24 }}>
          Escolha sua classe. Isso define seu avatar e títulos futuros.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
          {classes.map(([key, cls]) => {
            const active = selected === key;
            const hover = hovered === key;
            return (
              <div key={key} onClick={() => setSelected(key)}
                onMouseEnter={() => setHovered(key)} onMouseLeave={() => setHovered(null)}
                style={{
                  padding: '16px 8px', borderRadius: 14, cursor: 'pointer', transition: 'all 200ms',
                  background: active ? 'var(--gradient-neon-soft)' : hover ? 'rgba(255,255,255,0.04)' : 'var(--glass-bg)',
                  border: active ? '2px solid var(--neon-a)' : '2px solid var(--glass-border)',
                  boxShadow: active ? '0 0 20px rgba(255,46,136,0.2)' : 'none',
                }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{cls.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{cls.name}</div>
                <div style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 4 }}>
                  {key === 'guerreiro' && 'Força e resistência'}
                  {key === 'mago' && 'Sabedoria e foco'}
                  {key === 'monge' && 'Disciplina e paz'}
                  {key === 'arqueiro' && 'Precisão e agilidade'}
                  {key === 'paladino' && 'Equilíbrio e proteção'}
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary" style={{ padding: '12px 36px', fontSize: 14 }}
          onClick={() => selected && onSelect(selected)} disabled={!selected}>
          Confirmar classe
        </button>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
window.AvatarPreview = AvatarPreview;
window.ClassSelectionModal = ClassSelectionModal;

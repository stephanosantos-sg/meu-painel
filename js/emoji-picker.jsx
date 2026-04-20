/* Orbita v2 — Emoji Picker with categories and search */

const EMOJI_DATA = {
  'Frequentes': ['✅','📋','💻','📖','🏋️','🧘','💧','🍅','📝','🎯','🔥','⭐','💡','🎵','🎮','📱','🏠','🛒','💰','❤️','👶','🐶','☕','🧹','💊','🛏️','🚗','📞','👔','🍳'],
  'Casa': ['🏠','🏡','🛏️','🛋️','🧹','🧺','🧼','🪥','🚿','🛁','🪴','🍳','🧑‍🍳','🍽️','🗑️','🧊','💡','🔑','🪟','🚪','📦','🧲','🔧','🪛','🪜','🧰','🪣','🧤','🧯','🔌'],
  'Trabalho': ['💻','💼','📊','📈','📉','📋','📎','📌','✏️','📝','📧','📨','💬','🗓️','⏰','🎯','🔍','📱','🖥️','⌨️','🖨️','📡','💡','🧠','🤝','📐','🗂️','📂','💳','🏦'],
  'Saúde': ['🏋️','🧘','🏃','🚴','🏊','💪','🧗','🤸','🥗','🍎','💧','💊','🩺','🫀','🧬','😴','🛏️','🧴','🦷','👁️','🩹','🌡️','⚖️','🥦','🍌','🥑','🫐','🥤','🍵','🧊'],
  'Bebê': ['👶','🍼','🧷','🧸','👣','🎒','🛁','😴','🍳','🏥','📖','🎵','🧹','🚗','👕','🧦','🧴','🪥','🍎','🥛','🧃','🎂','📷','🎈','🧩','🎪','🖍️','📏','🌙','⭐'],
  'Pessoas': ['😀','😊','😎','🤔','😴','🥳','💪','🙏','👋','👍','👎','✌️','🤝','🧑‍💻','🧑‍🎓','👨‍👩‍👧','🧙','⚔️','🤓','😤','🥰','🤗','😇','🫡','💃','🕺','🧑‍🏫','🧑‍⚕️','🧑‍🔬','👨‍👧'],
  'Natureza': ['🌱','🌿','🍀','🌸','🌻','🌙','⭐','☀️','🌈','❄️','🔥','💧','🌊','🐶','🐱','🦁','🐻','🐸','🦋','🐝','🌲','🌴','🍁','🌺','🪷','🐦','🦜','🐠','🐢','🦔'],
  'Comida': ['🍎','🍊','🍋','🍇','🍓','🥑','🥦','🍕','🍔','🍰','☕','🍵','🥤','🍷','🍺','🥗','🍳','🧁','🍫','🍿','🍜','🍱','🥘','🍝','🌮','🥐','🧀','🥚','🍞','🥩'],
  'Atividades': ['⚽','🏀','🏃','🚴','🏊','🧗','🎯','🎮','🎨','🎵','🎸','📚','✍️','🧩','♟️','🎲','🏆','🥇','🎭','🎪','🎤','🎬','📸','🎹','🥊','⛷️','🏄','🏌️','🎣','🪂'],
  'Viagem': ['🚗','✈️','🚀','🏖️','🏔️','🗺️','🧳','🏕️','🎒','🗼','🏛️','⛩️','🕌','🏰','🎢','🌍','🧭','⛵','🚂','🚁','🚌','🛵','🚲','⛽','🅿️','🏨','🎡','🌅','🌆','🗽'],
  'Objetos': ['💼','📱','💻','⌚','📷','🔑','💡','🔔','📌','✏️','📐','🗂️','📊','💳','🛡️','⚙️','🔧','💊','🧴','🧹','🪞','🧲','📻','🕯️','🧸','🎁','💎','👑','🎓','📿'],
  'Símbolos': ['❤️','💜','💙','💚','💛','🧡','⚡','✨','💫','🌟','💥','🔴','🟠','🟡','🟢','🔵','🟣','⬛','✅','❌','⚠️','♻️','🔄','➡️','⬆️','⬇️','🔗','📍','🏷️','💬'],
};

function EmojiPicker({ value, onChange, label }) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [cat, setCat] = React.useState('Frequentes');
  const ref = React.useRef();

  React.useEffect(() => {
    if (!open) return;
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function select(emoji) { onChange(emoji); setOpen(false); setSearch(''); }

  const allEmojis = search
    ? Object.entries(EMOJI_DATA).flatMap(([catName, emojis]) =>
        catName.toLowerCase().includes(search.toLowerCase()) ? emojis : []
      ).filter((e, i, arr) => arr.indexOf(e) === i)
    : EMOJI_DATA[cat] || [];

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)',
        borderRadius: 10, cursor: 'pointer', fontSize: 14, color: 'var(--ink-1)', transition: 'border-color 120ms',
      }}>
        <span style={{ fontSize: 18 }}>{value || '😀'}</span>
        <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Escolher</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 100,
          width: 340, background: 'rgba(14, 14, 20, 0.97)', backdropFilter: 'blur(40px)',
          border: '1px solid var(--line-2)', borderRadius: 16, boxShadow: 'var(--shadow-float)',
          animation: 'slideDown 180ms cubic-bezier(.2,.7,.2,1)', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>
            <input autoFocus placeholder="Buscar emoji..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 8, padding: '6px 10px', color: 'var(--ink-1)', fontFamily: 'var(--font-ui)', fontSize: 12, outline: 'none' }} />
          </div>
          {!search && (
            <div style={{ display: 'flex', gap: 1, padding: '6px 6px', overflowX: 'auto', borderBottom: '1px solid var(--line)', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              {Object.keys(EMOJI_DATA).map(c => (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '3px 7px', borderRadius: 6, fontSize: 9, fontWeight: 500,
                  background: cat === c ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: 'none', color: cat === c ? '#fff' : 'var(--ink-3)',
                  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)',
                }}>{c}</button>
              ))}
            </div>
          )}
          <div style={{ padding: 8, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 2, overflowY: 'auto', maxHeight: 260 }}>
            {allEmojis.map((emoji, i) => (
              <button key={`${emoji}-${i}`} onClick={() => select(emoji)} style={{
                width: 36, height: 36, display: 'grid', placeItems: 'center', fontSize: 18,
                background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'background 80ms',
              }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {emoji}
              </button>
            ))}
            {allEmojis.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 16, fontSize: 12, color: 'var(--ink-3)' }}>Nenhum emoji encontrado</div>}
          </div>
        </div>
      )}
    </div>
  );
}

window.EmojiPicker = EmojiPicker;

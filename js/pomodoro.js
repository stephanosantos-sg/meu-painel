function Pomodoro({
  onClose
}) {
  const {
    toast,
    addXP
  } = useData();
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
    document.title = running ? `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} — Orbita` : 'Orbita v2';
    return () => {
      document.title = 'Orbita v2';
    };
  }, [seconds, running]);
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMini(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
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
  const cs = typeof getComputedStyle !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const neonA = cs ? cs.getPropertyValue('--neon-a').trim() || '#ff2e88' : '#ff2e88';
  const neonB = cs ? cs.getPropertyValue('--neon-b').trim() || '#5b8dff' : '#5b8dff';
  const bgColor = cs ? cs.getPropertyValue('--bg-0').trim() || '#08080c' : '#08080c';
  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  const miniRingSize = 64;
  const miniRingR = 26;
  const miniCirc = Math.PI * 2 * miniRingR;
  if (mini) {
    return React.createElement("div", {
      style: {
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 900,
        padding: '16px 20px',
        borderRadius: 18,
        width: 320,
        background: `radial-gradient(ellipse 300px 200px at 90% 20%, ${hexToRgba(neonB, 0.12)}, transparent), var(--glass-bg-strong, rgba(14,14,20,0.95))`,
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-float)'
      }
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9,
        marginBottom: 10
      }
    }, "Pomodoro \xB7 Ciclo ", cycles + 1, "/4"), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        marginBottom: 12
      }
    }, React.createElement("svg", {
      viewBox: `0 0 ${miniRingSize} ${miniRingSize}`,
      style: {
        width: miniRingSize,
        height: miniRingSize,
        transform: 'rotate(-90deg)',
        flexShrink: 0
      }
    }, React.createElement("circle", {
      cx: miniRingSize / 2,
      cy: miniRingSize / 2,
      r: miniRingR,
      fill: "none",
      stroke: "rgba(255,255,255,0.06)",
      strokeWidth: "5"
    }), React.createElement("circle", {
      cx: miniRingSize / 2,
      cy: miniRingSize / 2,
      r: miniRingR,
      fill: "none",
      stroke: `url(#miniGrad)`,
      strokeWidth: "5",
      strokeLinecap: "round",
      strokeDasharray: miniCirc,
      strokeDashoffset: miniCirc * (1 - pct),
      style: {
        transition: 'stroke-dashoffset 1s linear'
      }
    }), React.createElement("defs", null, React.createElement("linearGradient", {
      id: "miniGrad",
      x1: "0",
      x2: "1"
    }, React.createElement("stop", {
      offset: "0",
      stopColor: neonA
    }), React.createElement("stop", {
      offset: "1",
      stopColor: neonB
    })))), React.createElement("div", null, React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 32,
        fontWeight: 300,
        letterSpacing: '-0.03em',
        lineHeight: 1
      }
    }, String(m).padStart(2, '0'), ":", String(s).padStart(2, '0')), focusText && React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-3)',
        marginTop: 4
      }
    }, "Foco em: ", focusText), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        marginTop: 6
      }
    }, Array.from({
      length: 4
    }).map((_, i) => React.createElement("div", {
      key: i,
      style: {
        width: 20,
        height: 4,
        borderRadius: 2,
        background: i < cycles % 4 ? i < 2 ? neonA : neonB : 'rgba(255,255,255,0.08)'
      }
    }))))), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => setRunning(r => !r),
      style: {
        flex: 1,
        justifyContent: 'center'
      }
    }, running ? '⏸ Pausar' : '▶ Retomar'), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => reset(preset),
      title: "Resetar"
    }, "\u21BA"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => {
        reset(preset === 25 ? 5 : 25);
        setRunning(true);
      },
      style: {
        flex: 1,
        justifyContent: 'center'
      }
    }, "\u23ED Skip"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => setMini(false),
      title: "Expandir"
    }, "\u2197")));
  }
  return React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 900,
      background: `radial-gradient(ellipse 500px 400px at 20% 80%, ${hexToRgba(neonA, 0.35)}, transparent), radial-gradient(ellipse 450px 350px at 80% 20%, ${hexToRgba(neonB, 0.25)}, transparent), ${bgColor}`,
      backdropFilter: 'blur(40px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 200ms'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: 20,
      right: 20,
      display: 'flex',
      gap: 8
    }
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: () => setMini(true)
  }, "\u2199 Mini"), React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "\u2715 Fechar")), React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "Pomodoro \xB7 ciclo ", cycles + 1), focusText && React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--ink-2)',
      marginBottom: 24
    }
  }, "Foco: ", focusText), React.createElement("div", {
    style: {
      position: 'relative',
      width: 260,
      height: 260,
      marginBottom: 32
    }
  }, React.createElement("svg", {
    viewBox: "0 0 100 100",
    style: {
      width: '100%',
      height: '100%',
      transform: 'rotate(-90deg)'
    }
  }, React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "42",
    fill: "none",
    stroke: "var(--line, rgba(255,255,255,0.06))",
    strokeWidth: "4"
  }), React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "42",
    fill: "none",
    stroke: "url(#pomoGrad)",
    strokeWidth: "4",
    strokeLinecap: "round",
    strokeDasharray: circumference,
    strokeDashoffset: circumference * (1 - pct),
    style: {
      transition: 'stroke-dashoffset 1s linear'
    }
  }), React.createElement("defs", null, React.createElement("linearGradient", {
    id: "pomoGrad",
    x1: "0",
    x2: "1"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: neonA
  }), React.createElement("stop", {
    offset: "1",
    stopColor: neonB
  })))), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 56,
      fontWeight: 300,
      letterSpacing: '-0.04em',
      lineHeight: 1
    }
  }, String(m).padStart(2, '0'), ":", String(s).padStart(2, '0')), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      marginTop: 8
    }
  }, preset, " min \xB7 ", running ? 'rodando' : seconds === 0 ? 'concluído!' : 'pausado'))), seconds === 0 && React.createElement("div", {
    style: {
      marginBottom: 24,
      padding: '12px 20px',
      borderRadius: 12,
      background: 'rgba(255,214,10,0.1)',
      border: '1px solid rgba(255,214,10,0.3)',
      fontSize: 14
    }
  }, "\uD83C\uDF89 +25 XP! Ciclo ", cycles, " conclu\xEDdo."), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 24
    }
  }, React.createElement("button", {
    className: `btn-ghost ${running ? '' : ''}`,
    onClick: () => setRunning(r => !r),
    style: {
      padding: '12px 28px',
      fontSize: 15
    }
  }, running ? '⏸ Pausar' : seconds === 0 ? '▶ Próximo' : '▶ Iniciar'), (running || seconds < preset * 60) && seconds > 0 && React.createElement("button", {
    className: "btn-ghost",
    onClick: () => reset(preset)
  }, "\u21BA Reset")), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, [25, 15, 5].map(n => React.createElement("button", {
    key: n,
    className: `tab-btn ${preset === n && !running ? 'active' : ''}`,
    onClick: () => reset(n)
  }, n, " min"))), !running && seconds === preset * 60 && React.createElement("div", {
    style: {
      marginTop: 24,
      width: 280
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "No que vai focar? (opcional)",
    value: focusText,
    onChange: e => setFocusText(e.target.value),
    style: {
      textAlign: 'center',
      fontSize: 13,
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.15)',
      color: '#fff'
    },
    onKeyDown: e => {
      if (e.key === 'Enter') setRunning(true);
    }
  })), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      marginTop: 20
    }
  }, Array.from({
    length: 4
  }).map((_, i) => React.createElement("div", {
    key: i,
    style: {
      width: 24,
      height: 4,
      borderRadius: 2,
      background: i < cycles % 4 ? 'var(--neon-a)' : 'rgba(255,255,255,0.08)'
    }
  }))));
}
window.Pomodoro = Pomodoro;
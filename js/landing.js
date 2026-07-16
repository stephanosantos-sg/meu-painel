function LandingPage() {
  const [mode, setMode] = React.useState('main');
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  async function handleGoogle() {
    setLoading(true);
    setError('');
    try {
      await window.OrbitaFirebase.signInWithGoogle();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }
  async function handleEmail() {
    if (!email || !pass) return;
    setLoading(true);
    setError('');
    try {
      await window.OrbitaFirebase.signInWithEmail(email, pass);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }
  return React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 28,
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      position: 'fixed',
      top: '-20%',
      right: '-10%',
      width: 600,
      height: 600,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,46,136,0.15), transparent 60%)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: '-20%',
      left: '-10%',
      width: 700,
      height: 700,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(91,141,255,0.12), transparent 60%)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, React.createElement(OrbLogo, {
    size: 56
  })), React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 52,
      lineHeight: 1,
      letterSpacing: '-0.03em',
      marginBottom: 8
    }
  }, "Imperium"), React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--ink-2)',
      marginBottom: 40,
      textAlign: 'center',
      maxWidth: 360,
      lineHeight: 1.6
    }
  }, "Produtividade imperial. Tarefas, h\xE1bitos, objetivos e uma legi\xE3o de agentes IA \u2014 sob seu comando."), React.createElement("div", {
    className: "glass-strong",
    style: {
      width: 'min(380px, 90vw)',
      padding: 32,
      borderRadius: 24
    }
  }, mode === 'main' && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: handleGoogle,
    disabled: loading,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      width: '100%',
      padding: '14px 0',
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 500,
      background: '#fff',
      color: '#333',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      transition: 'all 120ms',
      opacity: loading ? 0.6 : 1
    }
  }, React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24"
  }, React.createElement("path", {
    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
    fill: "#4285F4"
  }), React.createElement("path", {
    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
    fill: "#34A853"
  }), React.createElement("path", {
    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
    fill: "#FBBC05"
  }), React.createElement("path", {
    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
    fill: "#EA4335"
  })), "Entrar com Google"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '20px 0'
    }
  }, React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--line)'
    }
  }), React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "ou"), React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--line)'
    }
  })), React.createElement("button", {
    onClick: () => setMode('email'),
    style: {
      width: '100%',
      padding: '12px 0',
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 500,
      background: 'var(--glass-bg)',
      color: 'var(--ink-1)',
      border: '1px solid var(--glass-border)',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      transition: 'all 120ms'
    }
  }, "Entrar com Email")), mode === 'email' && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "Email",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    autoFocus: true,
    style: {
      width: '100%',
      marginBottom: 10
    }
  }), React.createElement("input", {
    className: "form-input",
    placeholder: "Senha",
    type: "password",
    value: pass,
    onChange: e => setPass(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') handleEmail();
    },
    style: {
      width: '100%'
    }
  })), React.createElement("button", {
    onClick: handleEmail,
    disabled: loading,
    className: "btn btn-primary",
    style: {
      width: '100%',
      justifyContent: 'center',
      padding: '12px 0',
      fontSize: 14
    }
  }, loading ? 'Entrando...' : 'Entrar / Criar conta'), React.createElement("button", {
    onClick: () => setMode('main'),
    style: {
      width: '100%',
      marginTop: 10,
      padding: '10px 0',
      background: 'transparent',
      border: 'none',
      color: 'var(--ink-3)',
      fontSize: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)'
    }
  }, "\u2190 Voltar")), error && React.createElement("div", {
    style: {
      marginTop: 12,
      padding: '8px 12px',
      borderRadius: 8,
      background: 'rgba(255,85,85,0.1)',
      border: '1px solid rgba(255,85,85,0.2)',
      fontSize: 11,
      color: '#ff5555'
    }
  }, error)), React.createElement("button", {
    onClick: () => window.dispatchEvent(new CustomEvent('orbita:skipLogin')),
    style: {
      marginTop: 20,
      background: 'transparent',
      border: 'none',
      color: 'var(--ink-3)',
      fontSize: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)'
    }
  }, "Continuar sem conta (dados locais apenas)"), React.createElement("div", {
    style: {
      marginTop: 40,
      fontSize: 10,
      color: 'var(--ink-4)'
    }
  }, "Imperium \xB7 SPQR \xB7 v2"));
}
window.LandingPage = LandingPage;
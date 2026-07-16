function ScreenNotes() {
  const {
    data,
    commit
  } = useData();
  const notebooks = data._notebooks || [];
  const notes = data.notes || [];
  const [activeNb, setActiveNb] = React.useState(null);
  const [showNewNb, setShowNewNb] = React.useState(false);
  const [nbName, setNbName] = React.useState('');
  const [nbIcon, setNbIcon] = React.useState('📓');
  const [editing, setEditing] = React.useState(null);
  const [noteTitle, setNoteTitle] = React.useState('');
  const [noteText, setNoteText] = React.useState('');
  const [noteColor, setNoteColor] = React.useState('');
  const [noteNb, setNoteNb] = React.useState('');
  const [noteImages, setNoteImages] = React.useState([]);
  const fileRef = React.useRef();
  const colors = ['', '#ff2e88', '#5b8dff', '#b066ff', '#3ccf91', '#ffa830', '#ff5a3c', '#ffd60a'];
  const filtered = activeNb ? notes.filter(n => n.notebook === activeNb) : notes;
  function createNotebook() {
    if (!nbName.trim()) return;
    commit(D => {
      if (!D._notebooks) D._notebooks = [];
      D._notebooks.push({
        id: Orbita.uid(),
        name: nbName.trim(),
        icon: nbIcon
      });
    });
    setNbName('');
    setNbIcon('📓');
    setShowNewNb(false);
  }
  function deleteNotebook(id) {
    commit(D => {
      D._notebooks = (D._notebooks || []).filter(n => n.id !== id);
      (D.notes || []).forEach(n => {
        if (n.notebook === id) n.notebook = null;
      });
    });
    if (activeNb === id) setActiveNb(null);
  }
  function openNewNote() {
    setEditing('new');
    setNoteTitle('');
    setNoteText('');
    setNoteColor('');
    setNoteNb(activeNb || '');
    setNoteImages([]);
  }
  function openEditNote(idx) {
    const n = notes[idx];
    setEditing(idx);
    setNoteTitle(n.title || '');
    setNoteText(n.text || '');
    setNoteColor(n.color || '');
    setNoteNb(n.notebook || '');
    setNoteImages(n.images || []);
  }
  function saveNote() {
    if (!noteText.trim() && !noteTitle.trim()) return;
    commit(D => {
      if (!D.notes) D.notes = [];
      const noteData = {
        title: noteTitle.trim() || null,
        text: noteText.trim(),
        color: noteColor || null,
        notebook: noteNb || null,
        images: noteImages.length > 0 ? noteImages : undefined,
        date: Orbita.todayStr(),
        time: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      if (editing === 'new') {
        D.notes.unshift(noteData);
      } else if (typeof editing === 'number') {
        Object.assign(D.notes[editing], noteData);
      }
    });
    setEditing(null);
  }
  function deleteNote(idx) {
    commit(D => {
      D.notes.splice(idx, 1);
    });
  }
  function addImage() {
    fileRef.current.click();
  }
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        const s = Math.min(1, 800 / img.width);
        c.width = img.width * s;
        c.height = img.height * s;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        setNoteImages(prev => [...prev, c.toDataURL('image/jpeg', 0.7)]);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }
  return React.createElement(React.Fragment, null, React.createElement(TopBar, {
    title: "Notas.",
    subtitle: `${notebooks.length} cadernos · ${notes.length} notas`,
    actions: React.createElement("button", {
      className: "btn btn-primary",
      style: {
        padding: '10px 18px',
        fontSize: 13
      },
      onClick: openNewNote
    }, "\uFF0B Nota")
  }), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: 16,
      padding: '0 28px 40px'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, React.createElement("button", {
    onClick: () => setActiveNb(null),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      padding: '8px 12px',
      borderRadius: 8,
      background: !activeNb ? 'var(--gradient-neon-soft)' : 'transparent',
      border: !activeNb ? '1px solid rgba(255,46,136,0.22)' : '1px solid transparent',
      color: !activeNb ? '#fff' : 'var(--ink-2)',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      textAlign: 'left'
    }
  }, React.createElement("span", null, "\uD83D\uDCCB"), " Todas (", notes.length, ")")), notebooks.map(nb => {
    const count = notes.filter(n => n.notebook === nb.id).length;
    return React.createElement("div", {
      key: nb.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 4
      }
    }, React.createElement("button", {
      onClick: () => setActiveNb(nb.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        padding: '8px 12px',
        borderRadius: 8,
        background: activeNb === nb.id ? 'var(--gradient-neon-soft)' : 'transparent',
        border: activeNb === nb.id ? '1px solid rgba(255,46,136,0.22)' : '1px solid transparent',
        color: activeNb === nb.id ? '#fff' : 'var(--ink-2)',
        cursor: 'pointer',
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        textAlign: 'left'
      }
    }, React.createElement("span", null, nb.icon), " ", nb.name, " ", React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-4)',
        marginLeft: 'auto'
      }
    }, count)), React.createElement("button", {
      onClick: () => deleteNotebook(nb.id),
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--ink-4)',
        cursor: 'pointer',
        fontSize: 10,
        padding: '4px',
        opacity: 0.5
      },
      onMouseEnter: e => e.target.style.opacity = 1,
      onMouseLeave: e => e.target.style.opacity = 0.5
    }, "\u2715"));
  }), showNewNb ? React.createElement("div", {
    style: {
      padding: '8px 0'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      marginBottom: 6
    }
  }, React.createElement(EmojiPicker, {
    value: nbIcon,
    onChange: setNbIcon
  }), React.createElement("input", {
    className: "form-input",
    placeholder: "Nome do caderno",
    value: nbName,
    onChange: e => setNbName(e.target.value),
    autoFocus: true,
    onKeyDown: e => {
      if (e.key === 'Enter') createNotebook();
      if (e.key === 'Escape') setShowNewNb(false);
    },
    style: {
      flex: 1,
      padding: '6px 10px',
      fontSize: 12
    }
  })), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, React.createElement("button", {
    className: "btn-ghost small",
    onClick: createNotebook
  }, "Criar"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setShowNewNb(false)
  }, "\u2715"))) : React.createElement("button", {
    onClick: () => setShowNewNb(true),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      padding: '8px 12px',
      borderRadius: 8,
      background: 'transparent',
      border: '1px dashed var(--line)',
      color: 'var(--ink-3)',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      marginTop: 8
    }
  }, "\uFF0B Caderno")), React.createElement("div", null, filtered.length === 0 && React.createElement("div", {
    className: "panel",
    style: {
      textAlign: 'center',
      padding: '48px 24px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 12
    }
  }, "\u270E"), React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, activeNb ? 'Caderno vazio' : 'Nenhuma nota'), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, "Clique em \"+ Nota\" para come\xE7ar")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 12
    }
  }, filtered.map((note, idx) => {
    const realIdx = notes.indexOf(note);
    const nb = notebooks.find(n => n.id === note.notebook);
    return React.createElement("div", {
      key: realIdx,
      className: "panel",
      style: {
        padding: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        borderTop: note.color ? `3px solid ${note.color}` : undefined
      },
      onClick: () => openEditNote(realIdx)
    }, note.images && note.images.length > 0 && React.createElement("div", {
      style: {
        height: 100,
        overflow: 'hidden'
      }
    }, React.createElement("img", {
      src: note.images[0],
      alt: "",
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    })), React.createElement("div", {
      style: {
        padding: 16
      }
    }, note.title && React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        marginBottom: 4
      }
    }, note.title), React.createElement("div", {
      style: {
        fontSize: 13,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        color: 'var(--ink-2)',
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, note.text), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
      }
    }, React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-4)'
      }
    }, note.date && Orbita.fmtDate(note.date), note.time && ` · ${note.time}`), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, nb && React.createElement("span", {
      style: {
        fontSize: 9,
        padding: '2px 6px',
        borderRadius: 4,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--line)',
        color: 'var(--ink-3)'
      }
    }, nb.icon, " ", nb.name), note.images && note.images.length > 1 && React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-4)'
      }
    }, "\uD83D\uDCF7 ", note.images.length), React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        deleteNote(realIdx);
      },
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--ink-4)',
        cursor: 'pointer',
        fontSize: 10
      }
    }, "\u2715")))));
  })))), editing !== null && React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setEditing(null)
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(600px, 92vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editing === 'new' ? 'Nova nota' : 'Editar nota'), React.createElement("button", {
    className: "modal-close",
    onClick: () => setEditing(null)
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "T\xEDtulo"), React.createElement("input", {
    className: "form-input",
    placeholder: "T\xEDtulo da nota (opcional)",
    value: noteTitle,
    onChange: e => setNoteTitle(e.target.value),
    autoFocus: true,
    style: {
      fontSize: 16,
      fontWeight: 500
    }
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Conte\xFAdo"), React.createElement("textarea", {
    className: "form-input",
    placeholder: "Escreva aqui...",
    value: noteText,
    onChange: e => setNoteText(e.target.value),
    style: {
      minHeight: 160,
      fontSize: 14,
      lineHeight: 1.7
    }
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Imagens"), noteImages.length > 0 && React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 8
    }
  }, noteImages.map((img, i) => React.createElement("div", {
    key: i,
    style: {
      position: 'relative',
      width: 80,
      height: 80,
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, React.createElement("img", {
    src: img,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), React.createElement("button", {
    onClick: () => setNoteImages(p => p.filter((_, j) => j !== i)),
    style: {
      position: 'absolute',
      top: 2,
      right: 2,
      width: 18,
      height: 18,
      borderRadius: 4,
      background: 'rgba(0,0,0,0.7)',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontSize: 10,
      display: 'grid',
      placeItems: 'center'
    }
  }, "\u2715")))), React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: handleImageUpload
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: addImage
  }, "\uD83D\uDCF7 Adicionar imagem")), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Cor"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, colors.map((c, i) => React.createElement("div", {
    key: i,
    onClick: () => setNoteColor(c),
    style: {
      width: 22,
      height: 22,
      borderRadius: 5,
      cursor: 'pointer',
      background: c || 'rgba(255,255,255,0.08)',
      border: noteColor === c ? '2px solid #fff' : '2px solid transparent'
    }
  })))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Caderno"), React.createElement("select", {
    className: "form-input",
    value: noteNb,
    onChange: e => setNoteNb(e.target.value),
    style: {
      padding: '8px 10px'
    }
  }, React.createElement("option", {
    value: ""
  }, "Sem caderno"), notebooks.map(nb => React.createElement("option", {
    key: nb.id,
    value: nb.id
  }, nb.icon, " ", nb.name)))))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: () => setEditing(null)
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: saveNote
  }, "Salvar")))));
}
function ScreenIdeas() {
  const {
    data,
    commit
  } = useData();
  const ideas = data.ideias || [];
  const [showNew, setShowNew] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  function deleteIdea(id) {
    commit(D => {
      D.ideias = D.ideias.filter(x => x.id !== id);
    });
  }
  function toggleStep(ideaId, stepIdx) {
    commit(D => {
      const idea = D.ideias.find(x => x.id === ideaId);
      if (idea && idea.steps[stepIdx]) idea.steps[stepIdx].done = !idea.steps[stepIdx].done;
    });
  }
  const editIdea = editId ? ideas.find(x => x.id === editId) : null;
  return React.createElement(React.Fragment, null, React.createElement(TopBar, {
    title: "Ideias.",
    subtitle: `${ideas.length} ideias`,
    actions: React.createElement("button", {
      className: "btn btn-primary",
      style: {
        padding: '10px 18px',
        fontSize: 13
      },
      onClick: () => {
        setEditId(null);
        setShowNew(true);
      }
    }, "\uFF0B Ideia")
  }), React.createElement("div", {
    style: {
      padding: '0 28px 40px'
    }
  }, ideas.length === 0 && React.createElement("div", {
    className: "panel",
    style: {
      textAlign: 'center',
      padding: '48px 24px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 12
    }
  }, "\u25C6"), React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, "Banco de ideias vazio"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginTop: 4,
      marginBottom: 16
    }
  }, "Capture suas ideias antes que escapem"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 18px',
      fontSize: 13
    },
    onClick: () => setShowNew(true)
  }, "\uFF0B Nova ideia")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 16
    }
  }, ideas.map(idea => {
    const stepsTotal = (idea.steps || []).length;
    const stepsDone = (idea.steps || []).filter(s => s.done).length;
    const hue = (idea.title || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0) % 360;
    const diffColors = {
      facil: '#3ccf91',
      medio: '#ffa830',
      dificil: '#ff2e88'
    };
    const diffLabels = {
      facil: 'Fácil',
      medio: 'Médio',
      dificil: 'Difícil'
    };
    return React.createElement("div", {
      key: idea.id,
      className: "panel",
      style: {
        padding: 0,
        overflow: 'hidden'
      }
    }, idea.image ? React.createElement("div", {
      style: {
        height: 140,
        overflow: 'hidden',
        position: 'relative'
      }
    }, React.createElement("img", {
      src: idea.image,
      alt: "",
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(8,8,12,0.95) 0%, transparent 60%)'
      }
    })) : React.createElement("div", {
      style: {
        height: 100,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, hsl(${hue}, 40%, 12%), hsl(${(hue + 60) % 360}, 30%, 8%))`
      }
    }, React.createElement("div", {
      style: {
        position: 'absolute',
        right: -20,
        bottom: -30,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: `hsl(${hue}, 60%, 30%)`,
        opacity: 0.4
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        right: 30,
        bottom: -10,
        width: 70,
        height: 70,
        borderRadius: '50%',
        background: `hsl(${(hue + 40) % 360}, 50%, 25%)`,
        opacity: 0.5
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        top: 16,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 12,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        display: 'grid',
        placeItems: 'center',
        fontSize: 20
      }
    }, idea.icon || '💡'), React.createElement("div", {
      style: {
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        gap: 6
      }
    }, idea.difficulty && React.createElement("span", {
      style: {
        fontSize: 9,
        padding: '3px 8px',
        borderRadius: 999,
        background: (diffColors[idea.difficulty] || '#b066ff') + '22',
        color: diffColors[idea.difficulty] || '#b066ff',
        border: `1px solid ${diffColors[idea.difficulty] || '#b066ff'}44`,
        fontWeight: 600
      }
    }, diffLabels[idea.difficulty] || idea.difficulty), idea.cost && React.createElement("span", {
      style: {
        fontSize: 9,
        padding: '3px 8px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid var(--line)',
        color: 'var(--ink-2)'
      }
    }, "R$ ", idea.cost))), React.createElement("div", {
      style: {
        padding: '16px 20px 20px',
        marginTop: idea.image ? -30 : 0,
        position: 'relative'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6
      }
    }, React.createElement("div", {
      style: {
        fontSize: 17,
        fontWeight: 600,
        lineHeight: 1.2
      }
    }, idea.title), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        flexShrink: 0,
        marginLeft: 8
      }
    }, React.createElement("button", {
      onClick: () => {
        setEditId(idea.id);
        setShowNew(true);
      },
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--ink-3)',
        cursor: 'pointer',
        fontSize: 13
      }
    }, "\u270E"), React.createElement("button", {
      onClick: () => {
        if (confirm('Deletar "' + idea.title + '"?')) deleteIdea(idea.id);
      },
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--ink-4)',
        cursor: 'pointer',
        fontSize: 13
      }
    }, "\u2715"))), idea.desc && React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--ink-2)',
        lineHeight: 1.5,
        marginBottom: 12
      }
    }, idea.desc), stepsTotal > 0 && React.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, stepsDone, "/", stepsTotal, " etapas"), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--neon-a)'
      }
    }, stepsTotal ? Math.round(stepsDone / stepsTotal * 100) : 0, "%")), React.createElement("div", {
      style: {
        height: 3,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 8
      }
    }, React.createElement("div", {
      style: {
        width: `${stepsTotal ? stepsDone / stepsTotal * 100 : 0}%`,
        height: '100%',
        background: 'var(--gradient-neon)'
      }
    })), idea.steps.map((s, i) => React.createElement("div", {
      key: i,
      onClick: () => toggleStep(idea.id, i),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 0',
        cursor: 'pointer'
      }
    }, React.createElement("div", {
      className: `check ${s.done ? 'checked' : ''}`,
      style: {
        width: 14,
        height: 14,
        fontSize: 7
      }
    }, s.done && '✓'), React.createElement("span", {
      style: {
        fontSize: 11.5,
        textDecoration: s.done ? 'line-through' : 'none',
        color: s.done ? 'var(--ink-3)' : 'var(--ink-1)'
      }
    }, s.text)))), idea.deadline && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, "prazo: ", Orbita.fmtDate(idea.deadline))));
  }))), showNew && React.createElement(IdeaModal, {
    onClose: () => {
      setShowNew(false);
      setEditId(null);
    },
    editIdea: editIdea
  }));
}
function IdeaModal({
  onClose,
  editIdea
}) {
  const {
    commit
  } = useData();
  const [title, setTitle] = React.useState(editIdea?.title || '');
  const [desc, setDesc] = React.useState(editIdea?.desc || '');
  const [icon, setIcon] = React.useState(editIdea?.icon || '💡');
  const [difficulty, setDifficulty] = React.useState(editIdea?.difficulty || '');
  const [cost, setCost] = React.useState(editIdea?.cost || '');
  const [deadline, setDeadline] = React.useState(editIdea?.deadline || '');
  const [image, setImage] = React.useState(editIdea?.image || '');
  const [steps, setSteps] = React.useState(editIdea?.steps ? editIdea.steps.map(s => ({
    ...s
  })) : []);
  const [newStep, setNewStep] = React.useState('');
  const fileRef = React.useRef();
  function addStep() {
    if (!newStep.trim()) return;
    setSteps(p => [...p, {
      text: newStep.trim(),
      done: false
    }]);
    setNewStep('');
  }
  function handleSave() {
    if (!title.trim()) return;
    commit(D => {
      if (!D.ideias) D.ideias = [];
      const ideaData = {
        title: title.trim(),
        desc: desc.trim(),
        icon,
        difficulty: difficulty || null,
        cost: cost || null,
        deadline: deadline || null,
        image: image || null,
        steps
      };
      if (editIdea) {
        const idx = D.ideias.findIndex(x => x.id === editIdea.id);
        if (idx >= 0) Object.assign(D.ideias[idx], ideaData);
      } else D.ideias.push({
        id: Orbita.uid(),
        ...ideaData
      });
    });
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation()
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editIdea ? 'Editar ideia' : 'Nova ideia'), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Imagem de capa"), image && React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 8,
      borderRadius: 12,
      overflow: 'hidden',
      height: 100
    }
  }, React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), React.createElement("button", {
    onClick: () => setImage(''),
    style: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 24,
      height: 24,
      borderRadius: 6,
      background: 'rgba(0,0,0,0.6)',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontSize: 12,
      display: 'grid',
      placeItems: 'center'
    }
  }, "\u2715")), React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          const s = Math.min(1, 600 / img.width);
          c.width = img.width * s;
          c.height = img.height * s;
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          setImage(c.toDataURL('image/jpeg', 0.7));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => fileRef.current.click()
  }, "\uD83D\uDCF7 ", image ? 'Trocar' : 'Upload')), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, React.createElement(EmojiPicker, {
    label: "\xCDcone",
    value: icon,
    onChange: setIcon
  }), React.createElement("div", {
    className: "form-group",
    style: {
      flex: 1
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "T\xEDtulo"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Qual a ideia?",
    value: title,
    onChange: e => setTitle(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Descri\xE7\xE3o"), React.createElement("textarea", {
    className: "form-input",
    placeholder: "Detalhes...",
    value: desc,
    onChange: e => setDesc(e.target.value)
  })), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Dificuldade"), React.createElement("div", {
    className: "form-chips"
  }, [{
    v: '',
    l: '—'
  }, {
    v: 'facil',
    l: 'Fácil'
  }, {
    v: 'medio',
    l: 'Médio'
  }, {
    v: 'dificil',
    l: 'Difícil'
  }].map(d => React.createElement("div", {
    key: d.v,
    className: `form-chip ${difficulty === d.v ? 'active' : ''}`,
    onClick: () => setDifficulty(d.v)
  }, d.l)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Custo"), React.createElement("input", {
    className: "form-input",
    placeholder: "R$ 0",
    value: cost,
    onChange: e => setCost(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Prazo"), React.createElement("input", {
    className: "form-input",
    type: "date",
    value: deadline,
    onChange: e => setDeadline(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Etapas"), steps.map((s, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 8px',
      borderRadius: 6,
      background: 'rgba(255,255,255,0.03)',
      marginBottom: 4
    }
  }, React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 12
    }
  }, s.text), React.createElement("button", {
    onClick: () => setSteps(p => p.filter((_, j) => j !== i)),
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--ink-4)',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "\u2715"))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "Nova etapa...",
    value: newStep,
    onChange: e => setNewStep(e.target.value),
    style: {
      flex: 1,
      padding: '6px 10px',
      fontSize: 12
    },
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addStep();
      }
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: addStep
  }, "\uFF0B")))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: handleSave
  }, editIdea ? 'Salvar' : 'Criar'))));
}
window.ScreenNotes = ScreenNotes;
window.ScreenIdeas = ScreenIdeas;
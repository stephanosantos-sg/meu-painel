function ScreenBooks() {
  const {
    data,
    commit
  } = useData();
  const books = data.media && data.media.livros || [];
  const reading = books.filter(b => b.status === 'Lendo');
  const queued = books.filter(b => b.status === 'Fila' || b.queued && b.status !== 'Lendo' && b.status !== 'Lido' && b.status !== 'Biblioteca');
  const done = books.filter(b => b.status === 'Lido');
  const library = books.filter(b => b.status === 'Biblioteca');
  const [showAdd, setShowAdd] = React.useState(false);
  const [editIdx, setEditIdx] = React.useState(null);
  const [newTitle, setNewTitle] = React.useState('');
  const [newAuthor, setNewAuthor] = React.useState('');
  const [fetching, setFetching] = React.useState(false);
  const [libSearch, setLibSearch] = React.useState('');
  const [showLibrary, setShowLibrary] = React.useState(true);
  const [libView, setLibView] = React.useState('grid');
  function addBook(status) {
    if (!newTitle.trim()) return;
    const book = {
      title: newTitle.trim(),
      author: newAuthor.trim(),
      status: status || 'Fila',
      queued: status === 'Fila',
      progress: 0,
      done: false,
      poster: null,
      year: null,
      pages: null,
      genre: null,
      userRating: 0
    };
    commit(D => {
      if (!D.media) D.media = {
        livros: [],
        filmes: [],
        series: [],
        docs: []
      };
      D.media.livros.push(book);
    });
    fetchMetadata(newTitle.trim(), newAuthor.trim(), books.length);
    setNewTitle('');
    setNewAuthor('');
    setShowAdd(false);
  }
  function fetchMetadata(title, author, idx) {
    const q = encodeURIComponent(`${title} ${author}`);
    fetch(`https://openlibrary.org/search.json?q=${q}&limit=1`).then(r => r.json()).then(d => {
      if (!d.docs || !d.docs[0]) return;
      const doc = d.docs[0];
      commit(D => {
        const b = D.media.livros[idx];
        if (!b) return;
        if (!b.author && doc.author_name) b.author = doc.author_name[0];
        if (!b.year && doc.first_publish_year) b.year = doc.first_publish_year;
        if (!b.pages && doc.number_of_pages_median) b.pages = doc.number_of_pages_median;
        if (!b.genre && doc.subject) b.genre = doc.subject.slice(0, 3).join(', ');
        if (!b.poster && doc.cover_i) b.poster = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
      });
    }).catch(() => {});
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`).then(r => r.json()).then(d => {
      if (!d.items || !d.items[0]) return;
      const vol = d.items[0].volumeInfo;
      commit(D => {
        const b = D.media.livros[idx];
        if (!b) return;
        if (!b.pages && vol.pageCount) b.pages = vol.pageCount;
        if (!b.poster && vol.imageLinks) b.poster = (vol.imageLinks.thumbnail || '').replace('http:', 'https:');
        if (!b.genre && vol.categories) b.genre = vol.categories[0];
      });
    }).catch(() => {});
  }
  function reFetch(idx) {
    const b = books[idx];
    if (!b) return;
    setFetching(true);
    commit(D => {
      D.media.livros[idx].poster = null;
    });
    fetchMetadata(b.title, b.author || '', idx);
    setTimeout(() => setFetching(false), 2000);
  }
  function setStatus(idx, status) {
    commit(D => {
      const b = D.media.livros[idx];
      if (!b) return;
      b.status = status;
      if (status === 'Lido') {
        b.done = true;
        b.progress = b.pages || 100;
        b.queued = false;
      }
      if (status === 'Lendo') {
        b.queued = false;
        b.done = false;
      }
      if (status === 'Fila') {
        b.queued = true;
        b.done = false;
      }
      if (status === 'Biblioteca') {
        b.queued = false;
        b.done = false;
      }
    });
  }
  function addPages(idx, amount) {
    commit(D => {
      const b = D.media.livros[idx];
      if (!b) return;
      b.progress = Math.min((b.progress || 0) + amount, b.pages || 9999);
    });
  }
  function updateProgress(idx, pages) {
    commit(D => {
      const b = D.media.livros[idx];
      if (b) {
        b.progress = parseInt(pages) || 0;
      }
    });
  }
  function setRating(idx, rating) {
    commit(D => {
      const b = D.media.livros[idx];
      if (!b) return;
      b.userRating = rating;
      if (rating > 0 && b.status !== 'Lido') {
        b.status = 'Lido';
        b.done = true;
        b.queued = false;
      }
    });
  }
  function deleteBook(idx) {
    commit(D => {
      D.media.livros.splice(idx, 1);
    });
  }
  const heroBook = reading[0];
  const heroIdx = heroBook ? books.indexOf(heroBook) : -1;
  return React.createElement(React.Fragment, null, React.createElement(TopBar, {
    title: "Livros.",
    subtitle: `${reading.length} lendo · ${queued.length} na fila · ${done.length} lidos${library.length ? ` · ${library.length} no acervo` : ''}`,
    actions: React.createElement("button", {
      className: "btn btn-primary",
      style: {
        padding: '10px 18px',
        fontSize: 13
      },
      onClick: () => setShowAdd(true)
    }, "\uFF0B Livro")
  }), React.createElement("div", {
    className: "books-screen-pad"
  }, heroBook && React.createElement("div", {
    className: "panel books-hero",
    style: {
      padding: 28,
      marginBottom: 24,
      display: 'flex',
      gap: 28
    }
  }, React.createElement("div", {
    className: "books-hero-cover"
  }, React.createElement(BookCover, {
    book: heroBook,
    size: 160
  })), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Lendo agora"), React.createElement("div", {
    className: "books-hero-title",
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 32,
      lineHeight: 1.1,
      letterSpacing: '-0.02em'
    }
  }, heroBook.title), heroBook.author && React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--ink-2)',
      marginTop: 6
    }
  }, "por ", heroBook.author), React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6,
      gap: 8,
      flexWrap: 'wrap'
    }
  }, React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-2)'
    }
  }, "p\xE1gina ", heroBook.progress || 0), React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)'
    }
  }, heroBook.pages ? `de ${heroBook.pages} · ${Math.round((heroBook.progress || 0) / heroBook.pages * 100)}%` : 'sem total — busque metadados')), (() => {
    const pct = heroBook.pages ? Math.round((heroBook.progress || 0) / heroBook.pages * 100) : Math.round((heroBook.progress || 0) / 500 * 100);
    return React.createElement("input", {
      type: "range",
      min: "0",
      max: heroBook.pages || 500,
      value: heroBook.progress || 0,
      onChange: e => updateProgress(heroIdx, e.target.value),
      className: "neon-slider",
      style: {
        width: '100%',
        background: `linear-gradient(90deg, #ff2e88 0%, #b066ff ${pct}%, rgba(255,255,255,0.06) ${pct}%)`
      }
    });
  })()), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 16,
      flexWrap: 'wrap'
    }
  }, heroBook.pages && (heroBook.progress || 0) >= heroBook.pages ? React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 14
    },
    onClick: () => setStatus(heroIdx, 'Lido')
  }, "\u2713 Marcar como lido") : React.createElement("button", {
    className: "btn-ghost",
    onClick: () => setStatus(heroIdx, 'Lido')
  }, "\u2713 Conclu\xEDdo"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => reFetch(heroIdx),
    disabled: fetching
  }, "\u21BB Metadados"), React.createElement("button", {
    className: "icon-btn",
    onClick: () => setEditIdx(heroIdx),
    style: {
      width: 30,
      height: 30,
      fontSize: 13
    }
  }, "\u270E")))), reading.length > 1 && React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Tamb\xE9m lendo"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 14
    }
  }, reading.slice(1).map((b, i) => {
    const realIdx = books.indexOf(b);
    const pct = b.pages ? Math.round((b.progress || 0) / b.pages * 100) : 0;
    return React.createElement("div", {
      key: realIdx,
      className: "panel",
      style: {
        padding: 16,
        display: 'flex',
        gap: 14
      }
    }, React.createElement(BookCover, {
      book: b,
      size: 80
    }), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500
      }
    }, b.title), b.author && React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-3)',
        marginTop: 2
      }
    }, b.author), b.pages && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)',
        marginTop: 6
      }
    }, "pg ", b.progress || 0, "/", b.pages, " \xB7 ", pct, "%"), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        marginTop: 8
      }
    }, React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => addPages(realIdx, 10)
    }, "+10"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => setStatus(realIdx, 'Lido')
    }, "\u2713"))));
  }))), queued.length > 0 && React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Fila de leitura"), React.createElement("h3", {
    className: "panel-title",
    style: {
      marginTop: 4
    }
  }, "A seguir.")), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, queued.length, "/10")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: 14
    }
  }, queued.map((b, i) => {
    const realIdx = books.indexOf(b);
    return React.createElement("div", {
      key: realIdx,
      className: "panel",
      style: {
        padding: 14,
        textAlign: 'center'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 10
      }
    }, React.createElement(BookCover, {
      book: b,
      size: 110
    })), React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, b.title), b.author && React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-3)',
        marginTop: 2
      }
    }, b.author), b.pages && React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, React.createElement("div", {
      style: {
        height: 3,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        width: `${Math.round((b.progress || 0) / b.pages * 100)}%`,
        height: '100%',
        background: 'var(--gradient-neon)',
        borderRadius: 2
      }
    })), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)',
        marginTop: 3,
        textAlign: 'center'
      }
    }, b.progress || 0, "/", b.pages)), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        marginTop: 8,
        justifyContent: 'center'
      }
    }, React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => setStatus(realIdx, 'Lendo')
    }, "Come\xE7ar"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => setEditIdx(realIdx)
    }, "\u270E"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => deleteBook(realIdx),
      style: {
        color: 'var(--ink-4)'
      }
    }, "\u2715")));
  }))), library.length > 0 && React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Biblioteca"), React.createElement("h3", {
    className: "panel-title",
    style: {
      marginTop: 4
    }
  }, "Acervo.")), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, library.length, " livros"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setShowLibrary(s => !s)
  }, showLibrary ? '▲ Fechar' : '▼ Abrir'))), showLibrary && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 14,
      alignItems: 'center'
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "Buscar na biblioteca...",
    value: libSearch,
    onChange: e => setLibSearch(e.target.value),
    style: {
      flex: 1,
      fontSize: 13
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setLibView(v => v === 'list' ? 'grid' : 'list'),
    title: libView === 'list' ? 'Grid' : 'Lista'
  }, libView === 'list' ? '▦' : '☰')), (() => {
    const filtered = library.filter(b => {
      if (!libSearch.trim()) return true;
      const q = libSearch.toLowerCase();
      return (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q);
    });
    if (libView === 'grid') return React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 12,
        maxHeight: 600,
        overflowY: 'auto',
        padding: 2
      }
    }, filtered.map(b => {
      const realIdx = books.indexOf(b);
      return React.createElement("div", {
        key: realIdx,
        className: "panel",
        style: {
          padding: 10,
          textAlign: 'center'
        }
      }, React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 8
        }
      }, React.createElement(BookCover, {
        book: b,
        size: 90
      })), React.createElement("div", {
        style: {
          fontSize: 11,
          fontWeight: 500,
          lineHeight: 1.3
        }
      }, b.title), b.author && React.createElement("div", {
        style: {
          fontSize: 9,
          color: 'var(--ink-3)',
          marginTop: 2
        }
      }, b.author), React.createElement("div", {
        style: {
          display: 'flex',
          gap: 3,
          marginTop: 6,
          justifyContent: 'center'
        }
      }, React.createElement("button", {
        className: "btn-ghost small",
        onClick: () => setStatus(realIdx, 'Fila'),
        style: {
          fontSize: 9,
          padding: '2px 5px'
        }
      }, "Fila"), React.createElement("button", {
        className: "btn-ghost small",
        onClick: () => setStatus(realIdx, 'Lendo'),
        style: {
          fontSize: 9,
          padding: '2px 5px'
        }
      }, "\u25B6")));
    }));
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        maxHeight: 600,
        overflowY: 'auto',
        padding: 2
      }
    }, filtered.map(b => {
      const realIdx = books.indexOf(b);
      return React.createElement("div", {
        key: realIdx,
        style: {
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          padding: '6px 10px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--line)'
        }
      }, React.createElement("span", {
        className: "mono",
        style: {
          fontSize: 9,
          color: 'var(--ink-4)',
          width: 24,
          textAlign: 'right',
          flexShrink: 0
        }
      }, filtered.indexOf(b) + 1), React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, React.createElement("div", {
        style: {
          fontSize: 12,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, b.title), b.author && React.createElement("div", {
        style: {
          fontSize: 10,
          color: 'var(--ink-3)'
        }
      }, b.author)), React.createElement("div", {
        style: {
          display: 'flex',
          gap: 3,
          flexShrink: 0
        }
      }, React.createElement("button", {
        className: "btn-ghost small",
        onClick: () => setStatus(realIdx, 'Fila'),
        style: {
          fontSize: 9,
          padding: '2px 5px'
        }
      }, "\u2192 Fila"), React.createElement("button", {
        className: "btn-ghost small",
        onClick: () => setStatus(realIdx, 'Lendo'),
        style: {
          fontSize: 9,
          padding: '2px 5px'
        }
      }, "\u25B6"), React.createElement("button", {
        className: "btn-ghost small",
        onClick: () => setEditIdx(realIdx),
        style: {
          fontSize: 9,
          padding: '2px 5px'
        }
      }, "\u270E")));
    }));
  })())), done.length > 0 && React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Arquivo \xB7 ", new Date().getFullYear()), React.createElement("h3", {
    className: "panel-title",
    style: {
      marginTop: 4
    }
  }, "Conclu\xEDdos.")), React.createElement("span", {
    className: "chip chip-neon"
  }, done.length, " lidos")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: 14
    }
  }, done.map((b, i) => {
    const realIdx = books.indexOf(b);
    return React.createElement("div", {
      key: realIdx,
      className: "panel",
      style: {
        padding: 14,
        textAlign: 'center'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 10
      }
    }, React.createElement(BookCover, {
      book: b,
      size: 110
    })), React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, b.title), b.author && React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-3)',
        marginTop: 2
      }
    }, b.author), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2,
        marginTop: 6,
        justifyContent: 'center'
      }
    }, [1, 2, 3, 4, 5].map(s => React.createElement("span", {
      key: s,
      onClick: () => setRating(realIdx, s),
      style: {
        cursor: 'pointer',
        fontSize: 16,
        color: s <= (b.userRating || 0) ? '#ffd60a' : 'var(--ink-4)'
      }
    }, "\u2605"))), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => setEditIdx(realIdx),
      style: {
        marginTop: 6,
        width: '100%',
        justifyContent: 'center',
        fontSize: 10
      }
    }, "\u270E Editar"));
  }))), books.length === 0 && React.createElement("div", {
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
  }, "\uD83D\uDCDA"), React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, "Biblioteca vazia"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginTop: 4,
      marginBottom: 16
    }
  }, "Adicione seu primeiro livro"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 18px',
      fontSize: 13
    },
    onClick: () => setShowAdd(true)
  }, "\uFF0B Livro"))), showAdd && React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setShowAdd(false)
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(460px, 90vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, "Adicionar livro"), React.createElement("button", {
    className: "modal-close",
    onClick: () => setShowAdd(false)
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "T\xEDtulo"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Nome do livro",
    value: newTitle,
    onChange: e => setNewTitle(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') addBook('Fila');
    }
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Autor (opcional \u2014 busca autom\xE1tica)"), React.createElement("input", {
    className: "form-input",
    placeholder: "Autor",
    value: newAuthor,
    onChange: e => setNewAuthor(e.target.value)
  })), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      padding: '4px 0'
    }
  }, "Metadados (capa, p\xE1ginas, g\xEAnero) s\xE3o buscados automaticamente via Open Library e Google Books")), React.createElement("div", {
    className: "modal-footer",
    style: {
      flexWrap: 'wrap',
      gap: 6
    }
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: () => setShowAdd(false)
  }, "Cancelar"), React.createElement("button", {
    className: "btn-ghost",
    onClick: () => addBook('Biblioteca')
  }, "Biblioteca"), React.createElement("button", {
    className: "btn-ghost",
    onClick: () => addBook('Lendo')
  }, "Come\xE7ar a ler"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: () => addBook('Fila')
  }, "Adicionar \xE0 fila")))), editIdx !== null && books[editIdx] && React.createElement(BookEditModal, {
    book: books[editIdx],
    idx: editIdx,
    onClose: () => setEditIdx(null),
    commit: commit,
    onReFetch: reFetch
  }));
}
function BookEditModal({
  book,
  idx,
  onClose,
  commit,
  onReFetch
}) {
  const [title, setTitle] = React.useState(book.title || '');
  const [author, setAuthor] = React.useState(book.author || '');
  const [pages, setPages] = React.useState(book.pages || '');
  const [progress, setProgress] = React.useState(book.progress || 0);
  const [genre, setGenre] = React.useState(book.genre || '');
  const [year, setYear] = React.useState(book.year || '');
  const [poster, setPoster] = React.useState(book.poster || '');
  const [status, setStatus] = React.useState(book.status || 'Fila');
  const [coverMsg, setCoverMsg] = React.useState('');
  const fileRef = React.useRef();
  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      setCoverMsg('Imagem muito grande (max 2MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      setPoster(ev.target.result);
      setCoverMsg('✓ Capa carregada');
    };
    reader.readAsDataURL(f);
  }
  function handleSave() {
    let p = poster.trim();
    if (p && !/^(https?:|data:)/.test(p)) p = 'https://' + p;
    commit(D => {
      const b = D.media.livros[idx];
      if (!b) return;
      b.title = title.trim() || b.title;
      b.author = author.trim();
      b.pages = parseInt(pages) || null;
      b.progress = parseInt(progress) || 0;
      b.genre = genre.trim() || null;
      b.year = parseInt(year) || null;
      b.poster = p || null;
      b.status = status;
      b.done = status === 'Lido';
      b.queued = status === 'Fila';
    });
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(480px, 90vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, "Editar livro"), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "T\xEDtulo"), React.createElement("input", {
    className: "form-input",
    value: title,
    onChange: e => setTitle(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Autor"), React.createElement("input", {
    className: "form-input",
    value: author,
    onChange: e => setAuthor(e.target.value)
  })), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Total de p\xE1ginas"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    value: pages,
    onChange: e => setPages(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "P\xE1gina atual"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "0",
    value: progress,
    onChange: e => setProgress(e.target.value)
  }))), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "G\xEAnero"), React.createElement("input", {
    className: "form-input",
    value: genre,
    onChange: e => setGenre(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Ano"), React.createElement("input", {
    className: "form-input",
    type: "number",
    value: year,
    onChange: e => setYear(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Capa (URL ou upload)"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, poster && React.createElement("img", {
    src: poster,
    alt: "",
    style: {
      width: 56,
      height: 84,
      objectFit: 'cover',
      borderRadius: 6,
      flexShrink: 0,
      border: '1px solid var(--line)'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }), React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "https://... (cole link da imagem)",
    value: poster,
    onChange: e => setPoster(e.target.value),
    style: {
      fontSize: 12
    }
  }), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    onChange: handleFile,
    style: {
      display: 'none'
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    type: "button",
    onClick: () => fileRef.current && fileRef.current.click(),
    style: {
      fontSize: 11
    }
  }, "\uD83D\uDCC1 Upload"), poster && React.createElement("button", {
    className: "btn-ghost small",
    type: "button",
    onClick: () => setPoster(''),
    style: {
      fontSize: 11,
      color: 'var(--ink-4)'
    }
  }, "\u2715 Limpar"), coverMsg && React.createElement("span", {
    style: {
      fontSize: 10,
      color: coverMsg.startsWith('✓') ? '#3ccf91' : '#ff5a3c'
    }
  }, coverMsg))))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Status"), React.createElement("div", {
    className: "form-chips"
  }, ['Biblioteca', 'Fila', 'Lendo', 'Lido'].map(s => React.createElement("div", {
    key: s,
    className: `form-chip ${status === s ? 'active' : ''}`,
    onClick: () => setStatus(s)
  }, s)))), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => {
      onReFetch(idx);
      onClose();
    }
  }, "\u21BB Buscar metadados novamente")), React.createElement("div", {
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
  }, "Salvar"))));
}
function BookCover({
  book,
  size = 100
}) {
  const b = book;
  if (b.poster) {
    return React.createElement("img", {
      src: b.poster,
      alt: b.title,
      style: {
        width: size,
        height: size * 1.5,
        borderRadius: 8,
        objectFit: 'cover',
        boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)',
        flexShrink: 0
      }
    });
  }
  const hue = (b.title || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0) % 360;
  const hue2 = (hue + 40) % 360;
  return React.createElement("div", {
    style: {
      width: size,
      height: size * 1.5,
      borderRadius: 8,
      padding: '12px 10px',
      flexShrink: 0,
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 45%), hsl(${hue2}, 60%, 30%))`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      fontSize: Math.max(9, size * 0.09),
      fontWeight: 700,
      lineHeight: 1.2,
      color: 'rgba(255,255,255,0.9)',
      position: 'relative'
    }
  }, b.title), b.author && React.createElement("div", {
    style: {
      fontSize: Math.max(7, size * 0.065),
      color: 'rgba(255,255,255,0.5)',
      marginTop: 'auto',
      position: 'relative'
    }
  }, b.author));
}
function ScreenMedia() {
  const {
    data,
    commit
  } = useData();
  const [tab, setTab] = React.useState('filmes');
  const [showAdd, setShowAdd] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [editMediaIdx, setEditMediaIdx] = React.useState(null);
  const media = data.media || {};
  const items = media[tab] || [];
  const watching = items.filter(i => i.queued && !i.done);
  const doneItems = items.filter(i => i.done);
  const unwatched = items.filter(i => !i.queued && !i.done);
  async function fetchOMDB(title, tabKey, idx, opts = {}) {
    const KEY = '4a3b711b';
    const type = tabKey === 'series' ? 'series' : 'movie';
    const setStatus = opts.setStatus;
    const titleClean = title.trim();
    if (!titleClean) {
      if (setStatus) setStatus('Digite um título para buscar.', 'err');
      return;
    }
    if (setStatus) setStatus('⟳ Buscando...', 'info');
    async function applyByImdbID(id) {
      const r = await fetch(`https://www.omdbapi.com/?i=${encodeURIComponent(id)}&plot=short&apikey=${KEY}`);
      const d = await r.json();
      if (d.Response === 'False') {
        if (setStatus) setStatus('Não encontrado: ' + (d.Error || 'sem detalhes'), 'err');
        return false;
      }
      commit(D => {
        const item = D.media[tabKey][idx];
        if (!item) return;
        if (d.Poster && d.Poster !== 'N/A') item.poster = d.Poster;
        if (d.Year) item.year = d.Year;
        if (d.Genre) item.genre = d.Genre;
        if (d.Director && d.Director !== 'N/A') item.director = d.Director;
        if (d.Runtime && d.Runtime !== 'N/A') item.runtime = d.Runtime;
        if (d.totalSeasons) item.seasons = parseInt(d.totalSeasons);
        if (d.imdbRating && d.imdbRating !== 'N/A') item.rating = Math.round(parseFloat(d.imdbRating) / 2);
        if (d.imdbID) item.imdbID = d.imdbID;
        if (d.Plot && d.Plot !== 'N/A') item.plot = d.Plot;
      });
      if (setStatus) setStatus('✓ Metadados atualizados', 'ok');
      return true;
    }
    try {
      const exact = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(titleClean)}&type=${type}&plot=short&apikey=${KEY}`);
      const ed = await exact.json();
      if (ed.Response !== 'False' && ed.imdbID) {
        return applyByImdbID(ed.imdbID);
      }
      const search = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(titleClean)}&type=${type}&apikey=${KEY}`);
      const sd = await search.json();
      if (sd.Response === 'False' || !sd.Search || !sd.Search.length) {
        const any = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(titleClean)}&apikey=${KEY}`);
        const ad = await any.json();
        if (ad.Response === 'False' || !ad.Search || !ad.Search.length) {
          if (setStatus) setStatus('Nenhum resultado para "' + titleClean + '"', 'err');
          return;
        }
        return applyByImdbID(ad.Search[0].imdbID);
      }
      return applyByImdbID(sd.Search[0].imdbID);
    } catch (e) {
      if (setStatus) setStatus('Erro de rede: ' + e.message, 'err');
    }
  }
  function addItem(status) {
    if (!newTitle.trim()) return;
    const item = {
      title: newTitle.trim(),
      done: false,
      queued: status === 'queue',
      poster: null,
      year: null,
      genre: null,
      director: null,
      userRating: 0
    };
    if (tab === 'series') {
      item.seasons = null;
      item.currentSeason = 1;
    }
    const idx = items.length;
    commit(D => {
      if (!D.media) D.media = {
        livros: [],
        filmes: [],
        series: [],
        docs: []
      };
      if (!D.media[tab]) D.media[tab] = [];
      D.media[tab].push(item);
    });
    fetchOMDB(newTitle.trim(), tab, idx);
    setNewTitle('');
    setShowAdd(false);
  }
  function toggleDone(idx) {
    commit(D => {
      const item = D.media[tab][idx];
      if (!item) return;
      item.done = !item.done;
      if (item.done) item.queued = false;
    });
  }
  function toggleQueue(idx) {
    commit(D => {
      const item = D.media[tab][idx];
      if (!item) return;
      item.queued = !item.queued;
      if (item.queued) item.done = false;
    });
  }
  function setRating(idx, rating) {
    commit(D => {
      const item = D.media[tab][idx];
      if (!item) return;
      item.userRating = rating;
      if (rating > 0) {
        item.done = true;
        item.queued = false;
      }
    });
  }
  function reFetch(idx, opts) {
    const item = items[idx];
    if (item) fetchOMDB(item.title, tab, idx, opts);
  }
  function deleteItem(idx) {
    commit(D => {
      D.media[tab].splice(idx, 1);
    });
  }
  const tabLabel = tab === 'filmes' ? 'Filmes' : tab === 'series' ? 'Séries' : 'Documentários';
  function MediaCard({
    item,
    idx
  }) {
    const [hovered, setHovered] = React.useState(false);
    return React.createElement("div", {
      className: "panel",
      style: {
        padding: 14,
        position: 'relative'
      },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false)
    }, item.poster ? React.createElement("img", {
      src: item.poster,
      alt: item.title,
      style: {
        width: '100%',
        borderRadius: 8,
        marginBottom: 8,
        aspectRatio: '2/3',
        objectFit: 'cover'
      }
    }) : React.createElement("div", {
      style: {
        width: '100%',
        aspectRatio: '2/3',
        borderRadius: 8,
        marginBottom: 8,
        background: `linear-gradient(135deg, hsl(${(item.title || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0) % 360}, 50%, 35%), hsl(${((item.title || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0) + 40) % 360}, 40%, 25%))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12
      }
    }, React.createElement("span", {
      style: {
        fontSize: 32,
        opacity: 0.6
      }
    }, tab === 'series' ? '📺' : tab === 'docs' ? '🎥' : '🎬')), React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, item.title), item.year && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)',
        marginTop: 2
      }
    }, item.year, item.director && ` · ${item.director}`), item.genre && React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, item.genre), tab === 'series' && item.seasons && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, item.seasons, " temporadas"), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2,
        marginTop: 6
      }
    }, [1, 2, 3, 4, 5].map(s => React.createElement("span", {
      key: s,
      onClick: () => setRating(idx, s),
      style: {
        cursor: 'pointer',
        fontSize: 14,
        color: s <= (item.userRating || 0) ? '#ffd60a' : 'var(--ink-4)'
      }
    }, "\u2605"))), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 3,
        marginTop: 6,
        flexWrap: 'wrap'
      }
    }, !item.done && React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => toggleDone(idx),
      style: {
        fontSize: 10,
        padding: '3px 6px'
      }
    }, "\u2713"), !item.queued && !item.done && React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => toggleQueue(idx),
      style: {
        fontSize: 10,
        padding: '3px 6px'
      }
    }, "Fila"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => setEditMediaIdx(idx),
      style: {
        fontSize: 10,
        padding: '3px 6px'
      }
    }, "\u270E"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => reFetch(idx),
      style: {
        fontSize: 10,
        padding: '3px 6px'
      }
    }, "\u21BB"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => deleteItem(idx),
      style: {
        fontSize: 10,
        padding: '3px 6px',
        color: 'var(--ink-4)'
      }
    }, "\u2715")));
  }
  return React.createElement(React.Fragment, null, React.createElement(TopBar, {
    title: "M\xEDdia.",
    subtitle: `${watching.length} assistindo · ${doneItems.length} concluídos · ${items.length} total`,
    actions: React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, [{
      v: 'filmes',
      l: 'Filmes'
    }, {
      v: 'series',
      l: 'Séries'
    }, {
      v: 'docs',
      l: 'Docs'
    }].map(t => React.createElement("button", {
      key: t.v,
      className: `tab-btn ${tab === t.v ? 'active' : ''}`,
      onClick: () => setTab(t.v)
    }, t.l))), React.createElement("button", {
      className: "btn btn-primary",
      style: {
        padding: '10px 18px',
        fontSize: 13
      },
      onClick: () => setShowAdd(true)
    }, "\uFF0B ", tabLabel.slice(0, -1)))
  }), React.createElement("div", {
    style: {
      padding: '0 28px 40px'
    }
  }, watching.length > 0 && React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Assistindo agora"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 14
    }
  }, watching.map((item, i) => React.createElement(MediaCard, {
    key: items.indexOf(item),
    item: item,
    idx: items.indexOf(item)
  })))), unwatched.length > 0 && React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Para assistir \xB7 ", unwatched.length), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 14
    }
  }, unwatched.map((item, i) => React.createElement(MediaCard, {
    key: items.indexOf(item),
    item: item,
    idx: items.indexOf(item)
  })))), doneItems.length > 0 && React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Conclu\xEDdos \xB7 ", doneItems.length), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 14
    }
  }, doneItems.map((item, i) => React.createElement(MediaCard, {
    key: items.indexOf(item),
    item: item,
    idx: items.indexOf(item)
  })))), items.length === 0 && React.createElement("div", {
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
  }, "\u25B7"), React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, "Nenhum item em ", tabLabel), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginTop: 4,
      marginBottom: 16
    }
  }, "Adicione seu primeiro t\xEDtulo"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 18px',
      fontSize: 13
    },
    onClick: () => setShowAdd(true)
  }, "\uFF0B ", tabLabel.slice(0, -1)))), showAdd && React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setShowAdd(false)
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(420px, 90vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, "Adicionar ", tabLabel.slice(0, -1).toLowerCase()), React.createElement("button", {
    className: "modal-close",
    onClick: () => setShowAdd(false)
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "T\xEDtulo"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: `Nome do ${tabLabel.slice(0, -1).toLowerCase()}`,
    value: newTitle,
    onChange: e => setNewTitle(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') addItem('queue');
    }
  })), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      padding: '4px 0'
    }
  }, "Metadados (capa, ano, g\xEAnero) s\xE3o buscados automaticamente via OMDB")), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: () => setShowAdd(false)
  }, "Cancelar"), React.createElement("button", {
    className: "btn-ghost",
    onClick: () => addItem('list')
  }, "Adicionar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: () => addItem('queue')
  }, "Assistir agora")))), editMediaIdx !== null && items[editMediaIdx] && React.createElement(MediaEditModal, {
    item: items[editMediaIdx],
    idx: editMediaIdx,
    tabKey: tab,
    commit: commit,
    reFetch: reFetch,
    onClose: () => setEditMediaIdx(null)
  }));
}
function MediaEditModal({
  item,
  idx,
  tabKey,
  commit,
  reFetch,
  onClose
}) {
  const [title, setTitle] = React.useState(item.title || '');
  const [year, setYear] = React.useState(item.year || '');
  const [genre, setGenre] = React.useState(item.genre || '');
  const [director, setDirector] = React.useState(item.director || '');
  const [poster, setPoster] = React.useState(item.poster || '');
  const [seasons, setSeasons] = React.useState(item.seasons || '');
  const [currentSeason, setCurrentSeason] = React.useState(item.currentSeason || 1);
  const [status, setStatus] = React.useState(item.done ? 'done' : item.queued ? 'queue' : 'list');
  const [fetchMsg, setFetchMsg] = React.useState({
    text: '',
    kind: ''
  });
  const fileRef = React.useRef();
  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      setFetchMsg({
        text: 'Imagem muito grande (max 2MB)',
        kind: 'err'
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      setPoster(ev.target.result);
      setFetchMsg({
        text: '✓ Capa carregada',
        kind: 'ok'
      });
    };
    reader.readAsDataURL(f);
  }
  function handleSave() {
    let p = poster.trim();
    if (p && !/^(https?:|data:)/.test(p)) p = 'https://' + p;
    commit(D => {
      const it = D.media[tabKey][idx];
      if (!it) return;
      it.title = title.trim() || it.title;
      it.year = year || null;
      it.genre = genre.trim() || null;
      it.director = director.trim() || null;
      it.poster = p || null;
      if (tabKey === 'series') {
        it.seasons = parseInt(seasons) || null;
        it.currentSeason = parseInt(currentSeason) || 1;
      }
      it.done = status === 'done';
      it.queued = status === 'queue';
    });
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(480px, 90vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, "Editar"), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "T\xEDtulo"), React.createElement("input", {
    className: "form-input",
    value: title,
    onChange: e => setTitle(e.target.value)
  })), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Ano"), React.createElement("input", {
    className: "form-input",
    value: year,
    onChange: e => setYear(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "G\xEAnero"), React.createElement("input", {
    className: "form-input",
    value: genre,
    onChange: e => setGenre(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Diretor"), React.createElement("input", {
    className: "form-input",
    value: director,
    onChange: e => setDirector(e.target.value)
  })), tabKey === 'series' && React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Temporadas"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    value: seasons,
    onChange: e => setSeasons(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Temporada atual"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    value: currentSeason,
    onChange: e => setCurrentSeason(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Capa (URL ou upload)"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, poster && React.createElement("img", {
    src: poster,
    alt: "",
    style: {
      width: 56,
      height: 84,
      objectFit: 'cover',
      borderRadius: 6,
      flexShrink: 0,
      border: '1px solid var(--line)'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }), React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "https://... (cole link da imagem)",
    value: poster,
    onChange: e => setPoster(e.target.value),
    style: {
      fontSize: 12
    }
  }), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    onChange: handleFile,
    style: {
      display: 'none'
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    type: "button",
    onClick: () => fileRef.current && fileRef.current.click(),
    style: {
      fontSize: 11
    }
  }, "\uD83D\uDCC1 Upload"), poster && React.createElement("button", {
    className: "btn-ghost small",
    type: "button",
    onClick: () => setPoster(''),
    style: {
      fontSize: 11,
      color: 'var(--ink-4)'
    }
  }, "\u2715 Limpar"))))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Status"), React.createElement("div", {
    className: "form-chips"
  }, [{
    v: 'list',
    l: 'Para assistir'
  }, {
    v: 'queue',
    l: 'Assistindo'
  }, {
    v: 'done',
    l: 'Concluído'
  }].map(s => React.createElement("div", {
    key: s.v,
    className: `form-chip ${status === s.v ? 'active' : ''}`,
    onClick: () => setStatus(s.v)
  }, s.l)))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => reFetch(idx, {
      setStatus: (text, kind) => setFetchMsg({
        text,
        kind
      })
    }),
    style: {
      fontSize: 12
    }
  }, "\u21BB Buscar metadados"), fetchMsg.text && React.createElement("span", {
    style: {
      fontSize: 11,
      color: fetchMsg.kind === 'ok' ? '#3ccf91' : fetchMsg.kind === 'err' ? '#ff5a3c' : 'var(--ink-3)'
    }
  }, fetchMsg.text))), React.createElement("div", {
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
  }, "Salvar"))));
}
window.ScreenBooks = ScreenBooks;
window.ScreenMedia = ScreenMedia;
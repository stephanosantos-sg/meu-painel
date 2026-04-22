/* Orbita v2 — Books (Biblioteca) with metadata fetch + hero reading view */

function ScreenBooks() {
  const { data, commit } = useData();
  const books = (data.media && data.media.livros) || [];
  const reading = books.filter(b => b.status === 'Lendo');
  const queued = books.filter(b => b.queued && b.status !== 'Lendo' && b.status !== 'Lido' && b.status !== 'Biblioteca');
  const done = books.filter(b => b.status === 'Lido');
  const library = books.filter(b => b.status === 'Biblioteca');
  const [showAdd, setShowAdd] = React.useState(false);
  const [editIdx, setEditIdx] = React.useState(null);
  const [newTitle, setNewTitle] = React.useState('');
  const [newAuthor, setNewAuthor] = React.useState('');
  const [fetching, setFetching] = React.useState(false);
  const [libSearch, setLibSearch] = React.useState('');
  const [showLibrary, setShowLibrary] = React.useState(false);

  function addBook(status) {
    if (!newTitle.trim()) return;
    const book = { title: newTitle.trim(), author: newAuthor.trim(), status: status || 'Fila', queued: status === 'Fila', progress: 0, done: false, poster: null, year: null, pages: null, genre: null, userRating: 0 };
    commit(D => {
      if (!D.media) D.media = { livros: [], filmes: [], series: [], docs: [] };
      D.media.livros.push(book);
    });
    fetchMetadata(newTitle.trim(), newAuthor.trim(), books.length);
    setNewTitle(''); setNewAuthor(''); setShowAdd(false);
  }

  function fetchMetadata(title, author, idx) {
    const q = encodeURIComponent(`${title} ${author}`);
    fetch(`https://openlibrary.org/search.json?q=${q}&limit=1`)
      .then(r => r.json()).then(d => {
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
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`)
      .then(r => r.json()).then(d => {
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
    commit(D => { D.media.livros[idx].poster = null; });
    fetchMetadata(b.title, b.author || '', idx);
    setTimeout(() => setFetching(false), 2000);
  }

  function setStatus(idx, status) {
    commit(D => {
      const b = D.media.livros[idx];
      if (!b) return;
      b.status = status;
      if (status === 'Lido') { b.done = true; b.progress = b.pages || 100; b.queued = false; }
      if (status === 'Lendo') { b.queued = false; b.done = false; }
      if (status === 'Fila') { b.queued = true; b.done = false; }
      if (status === 'Biblioteca') { b.queued = false; b.done = false; }
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
      if (b) { b.progress = parseInt(pages) || 0; }
    });
  }

  function setRating(idx, rating) {
    commit(D => {
      const b = D.media.livros[idx];
      if (!b) return;
      b.userRating = rating;
      if (rating > 0 && b.status !== 'Lido') { b.status = 'Lido'; b.done = true; b.queued = false; }
    });
  }

  function deleteBook(idx) {
    commit(D => { D.media.livros.splice(idx, 1); });
  }

  const heroBook = reading[0];
  const heroIdx = heroBook ? books.indexOf(heroBook) : -1;

  return (
    <>
      <TopBar title="Livros." subtitle={`${reading.length} lendo · ${queued.length} na fila · ${done.length} lidos${library.length ? ` · ${library.length} no acervo` : ''}`}
        actions={<button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setShowAdd(true)}>＋ Livro</button>}
      />
      <div style={{ padding: '0 28px 40px' }}>

        {/* Hero: Lendo Agora */}
        {heroBook && (
          <div className="panel" style={{ padding: 28, marginBottom: 24, display: 'flex', gap: 28 }}>
            <BookCover book={heroBook} size={160} />
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Lendo agora</div>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{heroBook.title}</div>
              {heroBook.author && <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 6 }}>por {heroBook.author}</div>}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>página {heroBook.progress || 0}</span>
                  <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{heroBook.pages ? `de ${heroBook.pages} · ${Math.round((heroBook.progress || 0) / heroBook.pages * 100)}%` : 'sem total — busque metadados'}</span>
                </div>
                {(() => {
                  const pct = heroBook.pages ? Math.round((heroBook.progress || 0) / heroBook.pages * 100) : Math.round((heroBook.progress || 0) / 500 * 100);
                  return <input type="range" min="0" max={heroBook.pages || 500} value={heroBook.progress || 0}
                    onChange={e => updateProgress(heroIdx, e.target.value)}
                    className="neon-slider"
                    style={{ width: '100%', background: `linear-gradient(90deg, #ff2e88 0%, #b066ff ${pct}%, rgba(255,255,255,0.06) ${pct}%)` }} />;
                })()}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                {heroBook.pages && (heroBook.progress || 0) >= heroBook.pages ? (
                  <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 14 }} onClick={() => setStatus(heroIdx, 'Lido')}>✓ Marcar como lido</button>
                ) : (
                  <button className="btn-ghost" onClick={() => setStatus(heroIdx, 'Lido')}>✓ Concluído</button>
                )}
                <button className="btn-ghost small" onClick={() => reFetch(heroIdx)} disabled={fetching}>↻ Metadados</button>
                <button className="icon-btn" onClick={() => setEditIdx(heroIdx)} style={{ width: 30, height: 30, fontSize: 13 }}>✎</button>
              </div>
            </div>
          </div>
        )}

        {/* Other reading */}
        {reading.length > 1 && (
          <div style={{ marginBottom: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Também lendo</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {reading.slice(1).map((b, i) => {
                const realIdx = books.indexOf(b);
                const pct = b.pages ? Math.round((b.progress || 0) / b.pages * 100) : 0;
                return (
                  <div key={realIdx} className="panel" style={{ padding: 16, display: 'flex', gap: 14 }}>
                    <BookCover book={b} size={80} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{b.title}</div>
                      {b.author && <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{b.author}</div>}
                      {b.pages && <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 6 }}>pg {b.progress || 0}/{b.pages} · {pct}%</div>}
                      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                        <button className="btn-ghost small" onClick={() => addPages(realIdx, 10)}>+10</button>
                        <button className="btn-ghost small" onClick={() => setStatus(realIdx, 'Lido')}>✓</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Queue */}
        {queued.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div className="eyebrow">Fila de leitura</div>
                <h3 className="panel-title" style={{ marginTop: 4 }}>A seguir.</h3>
              </div>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{queued.length}/10</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {queued.map((b, i) => {
                const realIdx = books.indexOf(b);
                return (
                  <div key={realIdx} className="panel" style={{ padding: 14, textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                      <BookCover book={b} size={110} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{b.title}</div>
                    {b.author && <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{b.author}</div>}
                    {b.pages && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.round((b.progress || 0) / b.pages * 100)}%`, height: '100%', background: 'var(--gradient-neon)', borderRadius: 2 }} />
                        </div>
                        <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 3, textAlign: 'center' }}>{b.progress || 0}/{b.pages}</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'center' }}>
                      <button className="btn-ghost small" onClick={() => setStatus(realIdx, 'Lendo')}>Começar</button>
                      <button className="btn-ghost small" onClick={() => setEditIdx(realIdx)}>✎</button>
                      <button className="btn-ghost small" onClick={() => deleteBook(realIdx)} style={{ color: 'var(--ink-4)' }}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Done / Archive */}
        {done.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div className="eyebrow">Arquivo · {new Date().getFullYear()}</div>
                <h3 className="panel-title" style={{ marginTop: 4 }}>Concluídos.</h3>
              </div>
              <span className="chip chip-neon">{done.length} / meta {data.media?.livros?.length > 0 ? 24 : 24}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {done.map((b, i) => {
                const realIdx = books.indexOf(b);
                return (
                  <div key={realIdx} className="panel" style={{ padding: 14, textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                      <BookCover book={b} size={110} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{b.title}</div>
                    {b.author && <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{b.author}</div>}
                    <div style={{ display: 'flex', gap: 2, marginTop: 6, justifyContent: 'center' }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} onClick={() => setRating(realIdx, s)} style={{ cursor: 'pointer', fontSize: 16, color: s <= (b.userRating || 0) ? '#ffd60a' : 'var(--ink-4)' }}>★</span>
                      ))}
                    </div>
                    <button className="btn-ghost small" onClick={() => setEditIdx(realIdx)} style={{ marginTop: 6, width: '100%', justifyContent: 'center', fontSize: 10 }}>✎ Editar</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Biblioteca (archive) */}
        {library.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div className="eyebrow">Biblioteca</div>
                <h3 className="panel-title" style={{ marginTop: 4 }}>Acervo.</h3>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{library.length} livros</span>
                <button className="btn-ghost small" onClick={() => setShowLibrary(s => !s)}>{showLibrary ? '▲ Fechar' : '▼ Abrir'}</button>
              </div>
            </div>
            {showLibrary && (
              <>
                <input className="form-input" placeholder="Buscar na biblioteca..." value={libSearch} onChange={e => setLibSearch(e.target.value)}
                  style={{ width: '100%', marginBottom: 14, fontSize: 13 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10, maxHeight: 500, overflowY: 'auto' }}>
                  {library.filter(b => {
                    if (!libSearch.trim()) return true;
                    const q = libSearch.toLowerCase();
                    return (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q);
                  }).map((b, i) => {
                    const realIdx = books.indexOf(b);
                    return (
                      <div key={realIdx} className="panel" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <BookCover book={b} size={40} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                          {b.author && <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{b.author}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          <button className="btn-ghost small" onClick={() => setStatus(realIdx, 'Fila')} title="Mover para fila">→ Fila</button>
                          <button className="btn-ghost small" onClick={() => setStatus(realIdx, 'Lendo')} title="Começar a ler">▶</button>
                          <button className="btn-ghost small" onClick={() => setEditIdx(realIdx)} style={{ fontSize: 10 }}>✎</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {books.length === 0 && (
          <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Biblioteca vazia</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4, marginBottom: 16 }}>Adicione seu primeiro livro</div>
            <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setShowAdd(true)}>＋ Livro</button>
          </div>
        )}
      </div>

      {/* Add book modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(460px, 90vw)' }}>
            <div className="modal-header"><h2>Adicionar livro</h2><button className="modal-close" onClick={() => setShowAdd(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Título</label>
                <input className="form-input" autoFocus placeholder="Nome do livro" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addBook('Fila'); }} />
              </div>
              <div className="form-group">
                <label className="form-label">Autor (opcional — busca automática)</label>
                <input className="form-input" placeholder="Autor" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', padding: '4px 0' }}>
                Metadados (capa, páginas, gênero) são buscados automaticamente via Open Library e Google Books
              </div>
            </div>
            <div className="modal-footer" style={{ flexWrap: 'wrap', gap: 6 }}>
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancelar</button>
              <button className="btn-ghost" onClick={() => addBook('Biblioteca')}>Biblioteca</button>
              <button className="btn-ghost" onClick={() => addBook('Lendo')}>Começar a ler</button>
              <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={() => addBook('Fila')}>Adicionar à fila</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit book modal */}
      {editIdx !== null && books[editIdx] && <BookEditModal book={books[editIdx]} idx={editIdx} onClose={() => setEditIdx(null)} commit={commit} onReFetch={reFetch} />}
    </>
  );
}

function BookEditModal({ book, idx, onClose, commit, onReFetch }) {
  const [title, setTitle] = React.useState(book.title || '');
  const [author, setAuthor] = React.useState(book.author || '');
  const [pages, setPages] = React.useState(book.pages || '');
  const [progress, setProgress] = React.useState(book.progress || 0);
  const [genre, setGenre] = React.useState(book.genre || '');
  const [year, setYear] = React.useState(book.year || '');
  const [status, setStatus] = React.useState(book.status || 'Fila');

  function handleSave() {
    commit(D => {
      const b = D.media.livros[idx];
      if (!b) return;
      b.title = title.trim() || b.title;
      b.author = author.trim();
      b.pages = parseInt(pages) || null;
      b.progress = parseInt(progress) || 0;
      b.genre = genre.trim() || null;
      b.year = parseInt(year) || null;
      b.status = status;
      b.done = status === 'Lido';
      b.queued = status === 'Fila';
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(480px, 90vw)' }}>
        <div className="modal-header"><h2>Editar livro</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Título</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Autor</label>
            <input className="form-input" value={author} onChange={e => setAuthor(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Total de páginas</label>
              <input className="form-input" type="number" min="1" value={pages} onChange={e => setPages(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Página atual</label>
              <input className="form-input" type="number" min="0" value={progress} onChange={e => setProgress(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gênero</label>
              <input className="form-input" value={genre} onChange={e => setGenre(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ano</label>
              <input className="form-input" type="number" value={year} onChange={e => setYear(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="form-chips">
              {['Biblioteca','Fila','Lendo','Lido'].map(s => (
                <div key={s} className={`form-chip ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>{s}</div>
              ))}
            </div>
          </div>
          <button className="btn-ghost small" onClick={() => { onReFetch(idx); onClose(); }}>↻ Buscar metadados novamente</button>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

function BookCover({ book, size = 100 }) {
  const b = book;
  if (b.poster) {
    return <img src={b.poster} alt={b.title} style={{ width: size, height: size * 1.5, borderRadius: 8, objectFit: 'cover', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)', flexShrink: 0 }} />;
  }
  const hue = (b.title || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0) % 360;
  const hue2 = (hue + 40) % 360;
  return (
    <div style={{
      width: size, height: size * 1.5, borderRadius: 8, padding: '12px 10px', flexShrink: 0,
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 45%), hsl(${hue2}, 60%, 30%))`,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
      boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)', pointerEvents: 'none' }} />
      <div style={{ fontSize: Math.max(9, size * 0.09), fontWeight: 700, lineHeight: 1.2, color: 'rgba(255,255,255,0.9)', position: 'relative' }}>{b.title}</div>
      {b.author && <div style={{ fontSize: Math.max(7, size * 0.065), color: 'rgba(255,255,255,0.5)', marginTop: 'auto', position: 'relative' }}>{b.author}</div>}
    </div>
  );
}

function ScreenMedia() {
  const { data, commit } = useData();
  const [tab, setTab] = React.useState('filmes');
  const [showAdd, setShowAdd] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [editMediaIdx, setEditMediaIdx] = React.useState(null);
  const media = data.media || {};
  const items = media[tab] || [];
  const watching = items.filter(i => i.queued && !i.done);
  const doneItems = items.filter(i => i.done);
  const unwatched = items.filter(i => !i.queued && !i.done);

  function fetchOMDB(title, tabKey, idx) {
    const q = encodeURIComponent(title);
    const type = tabKey === 'series' ? 'series' : 'movie';
    fetch(`https://www.omdbapi.com/?t=${q}&type=${type}&apikey=4a3b711b`)
      .then(r => r.json()).then(d => {
        if (d.Response === 'False') return;
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
        });
      }).catch(() => {});
  }

  function addItem(status) {
    if (!newTitle.trim()) return;
    const item = { title: newTitle.trim(), done: false, queued: status === 'queue', poster: null, year: null, genre: null, director: null, userRating: 0 };
    if (tab === 'series') { item.seasons = null; item.currentSeason = 1; }
    const idx = items.length;
    commit(D => {
      if (!D.media) D.media = { livros: [], filmes: [], series: [], docs: [] };
      if (!D.media[tab]) D.media[tab] = [];
      D.media[tab].push(item);
    });
    fetchOMDB(newTitle.trim(), tab, idx);
    setNewTitle(''); setShowAdd(false);
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
      if (rating > 0) { item.done = true; item.queued = false; }
    });
  }

  function reFetch(idx) {
    const item = items[idx];
    if (item) fetchOMDB(item.title, tab, idx);
  }

  function deleteItem(idx) {
    commit(D => { D.media[tab].splice(idx, 1); });
  }

  const tabLabel = tab === 'filmes' ? 'Filmes' : tab === 'series' ? 'Séries' : 'Documentários';

  function MediaCard({ item, idx }) {
    const [hovered, setHovered] = React.useState(false);
    return (
      <div className="panel" style={{ padding: 14, position: 'relative' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {item.poster ? (
          <img src={item.poster} alt={item.title} style={{ width: '100%', borderRadius: 8, marginBottom: 8, aspectRatio: '2/3', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '100%', aspectRatio: '2/3', borderRadius: 8, marginBottom: 8,
            background: `linear-gradient(135deg, hsl(${(item.title||'').split('').reduce((s,c)=>s+c.charCodeAt(0),0)%360}, 50%, 35%), hsl(${((item.title||'').split('').reduce((s,c)=>s+c.charCodeAt(0),0)+40)%360}, 40%, 25%))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12,
          }}>
            <span style={{ fontSize: 32, opacity: 0.6 }}>{tab === 'series' ? '📺' : tab === 'docs' ? '🎥' : '🎬'}</span>
          </div>
        )}
        <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
        {item.year && <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>{item.year}{item.director && ` · ${item.director}`}</div>}
        {item.genre && <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{item.genre}</div>}
        {tab === 'series' && item.seasons && <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{item.seasons} temporadas</div>}
        <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} onClick={() => setRating(idx, s)} style={{ cursor: 'pointer', fontSize: 14, color: s <= (item.userRating || 0) ? '#ffd60a' : 'var(--ink-4)' }}>★</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 3, marginTop: 6, flexWrap: 'wrap' }}>
          {!item.done && <button className="btn-ghost small" onClick={() => toggleDone(idx)} style={{ fontSize: 10, padding: '3px 6px' }}>✓</button>}
          {!item.queued && !item.done && <button className="btn-ghost small" onClick={() => toggleQueue(idx)} style={{ fontSize: 10, padding: '3px 6px' }}>Fila</button>}
          <button className="btn-ghost small" onClick={() => setEditMediaIdx(idx)} style={{ fontSize: 10, padding: '3px 6px' }}>✎</button>
          <button className="btn-ghost small" onClick={() => reFetch(idx)} style={{ fontSize: 10, padding: '3px 6px' }}>↻</button>
          <button className="btn-ghost small" onClick={() => deleteItem(idx)} style={{ fontSize: 10, padding: '3px 6px', color: 'var(--ink-4)' }}>✕</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar title="Mídia." subtitle={`${watching.length} assistindo · ${doneItems.length} concluídos · ${items.length} total`}
        actions={<>
          <div style={{ display: 'flex', gap: 4 }}>
            {[{ v: 'filmes', l: 'Filmes' },{ v: 'series', l: 'Séries' },{ v: 'docs', l: 'Docs' }].map(t => (
              <button key={t.v} className={`tab-btn ${tab === t.v ? 'active' : ''}`} onClick={() => setTab(t.v)}>{t.l}</button>
            ))}
          </div>
          <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setShowAdd(true)}>＋ {tabLabel.slice(0,-1)}</button>
        </>}
      />
      <div style={{ padding: '0 28px 40px' }}>

        {/* Watching / Queue */}
        {watching.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Assistindo agora</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              {watching.map((item, i) => <MediaCard key={items.indexOf(item)} item={item} idx={items.indexOf(item)} />)}
            </div>
          </div>
        )}

        {/* Unwatched */}
        {unwatched.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Para assistir · {unwatched.length}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              {unwatched.map((item, i) => <MediaCard key={items.indexOf(item)} item={item} idx={items.indexOf(item)} />)}
            </div>
          </div>
        )}

        {/* Done */}
        {doneItems.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Concluídos · {doneItems.length}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              {doneItems.map((item, i) => <MediaCard key={items.indexOf(item)} item={item} idx={items.indexOf(item)} />)}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>▷</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Nenhum item em {tabLabel}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4, marginBottom: 16 }}>Adicione seu primeiro título</div>
            <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setShowAdd(true)}>＋ {tabLabel.slice(0,-1)}</button>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(420px, 90vw)' }}>
            <div className="modal-header"><h2>Adicionar {tabLabel.slice(0,-1).toLowerCase()}</h2><button className="modal-close" onClick={() => setShowAdd(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Título</label>
                <input className="form-input" autoFocus placeholder={`Nome do ${tabLabel.slice(0,-1).toLowerCase()}`} value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addItem('queue'); }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', padding: '4px 0' }}>Metadados (capa, ano, gênero) são buscados automaticamente via OMDB</div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancelar</button>
              <button className="btn-ghost" onClick={() => addItem('list')}>Adicionar</button>
              <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={() => addItem('queue')}>Assistir agora</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit media modal */}
      {editMediaIdx !== null && items[editMediaIdx] && (
        <MediaEditModal item={items[editMediaIdx]} idx={editMediaIdx} tabKey={tab} commit={commit} reFetch={reFetch} onClose={() => setEditMediaIdx(null)} />
      )}
    </>
  );
}

function MediaEditModal({ item, idx, tabKey, commit, reFetch, onClose }) {
  const [title, setTitle] = React.useState(item.title || '');
  const [year, setYear] = React.useState(item.year || '');
  const [genre, setGenre] = React.useState(item.genre || '');
  const [director, setDirector] = React.useState(item.director || '');
  const [seasons, setSeasons] = React.useState(item.seasons || '');
  const [currentSeason, setCurrentSeason] = React.useState(item.currentSeason || 1);
  const [status, setStatus] = React.useState(item.done ? 'done' : item.queued ? 'queue' : 'list');

  function handleSave() {
    commit(D => {
      const it = D.media[tabKey][idx];
      if (!it) return;
      it.title = title.trim() || it.title;
      it.year = year || null;
      it.genre = genre.trim() || null;
      it.director = director.trim() || null;
      if (tabKey === 'series') { it.seasons = parseInt(seasons) || null; it.currentSeason = parseInt(currentSeason) || 1; }
      it.done = status === 'done';
      it.queued = status === 'queue';
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(480px, 90vw)' }}>
        <div className="modal-header"><h2>Editar</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Título</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ano</label>
              <input className="form-input" value={year} onChange={e => setYear(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Gênero</label>
              <input className="form-input" value={genre} onChange={e => setGenre(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Diretor</label>
            <input className="form-input" value={director} onChange={e => setDirector(e.target.value)} />
          </div>
          {tabKey === 'series' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Temporadas</label>
                <input className="form-input" type="number" min="1" value={seasons} onChange={e => setSeasons(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Temporada atual</label>
                <input className="form-input" type="number" min="1" value={currentSeason} onChange={e => setCurrentSeason(e.target.value)} />
              </div>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="form-chips">
              {[{ v: 'list', l: 'Para assistir' }, { v: 'queue', l: 'Assistindo' }, { v: 'done', l: 'Concluído' }].map(s => (
                <div key={s.v} className={`form-chip ${status === s.v ? 'active' : ''}`} onClick={() => setStatus(s.v)}>{s.l}</div>
              ))}
            </div>
          </div>
          <button className="btn-ghost small" onClick={() => { reFetch(idx); onClose(); }}>↻ Buscar metadados novamente</button>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

window.ScreenBooks = ScreenBooks;
window.ScreenMedia = ScreenMedia;

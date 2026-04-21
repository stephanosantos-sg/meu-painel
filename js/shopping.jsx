/* Orbita v2 — Shopping Lists */

function ScreenShopping() {
  const { data, commit } = useData();
  const lists = data.shopLists || [];
  const [showNewList, setShowNewList] = React.useState(false);
  const [newListName, setNewListName] = React.useState('');
  const [newListIcon, setNewListIcon] = React.useState('🛒');
  const [addingItemTo, setAddingItemTo] = React.useState(null);
  const [newItemText, setNewItemText] = React.useState('');
  const [newItemPrice, setNewItemPrice] = React.useState('');

  function createList() {
    if (!newListName.trim()) return;
    commit(D => {
      if (!D.shopLists) D.shopLists = [];
      D.shopLists.push({ id: Orbita.uid(), name: newListName.trim(), icon: newListIcon, items: [] });
    });
    setNewListName(''); setNewListIcon('🛒'); setShowNewList(false);
  }

  function addItem(listId) {
    if (!newItemText.trim()) return;
    commit(D => {
      const list = D.shopLists.find(l => l.id === listId);
      if (!list) return;
      list.items.push({ text: newItemText.trim(), price: parseFloat(newItemPrice) || 0, done: false });
    });
    setNewItemText(''); setNewItemPrice(''); setAddingItemTo(null);
  }

  function toggleItem(listId, idx) {
    commit(D => {
      const list = D.shopLists.find(l => l.id === listId);
      if (list && list.items[idx]) list.items[idx].done = !list.items[idx].done;
    });
  }

  function deleteItem(listId, idx) {
    commit(D => {
      const list = D.shopLists.find(l => l.id === listId);
      if (list) list.items.splice(idx, 1);
    });
  }

  function deleteList(listId) {
    commit(D => { D.shopLists = D.shopLists.filter(l => l.id !== listId); });
  }

  function archiveList(listId) {
    commit(D => {
      const idx = D.shopLists.findIndex(l => l.id === listId);
      if (idx < 0) return;
      const list = D.shopLists.splice(idx, 1)[0];
      if (!D._shopArchive) D._shopArchive = [];
      D._shopArchive.push({
        ...list,
        archivedAt: new Date().toISOString(),
        stats: { total: list.items.length, done: list.items.filter(i => i.done).length, totalPrice: list.items.reduce((s, i) => s + (i.price || 0), 0) },
      });
    });
  }

  return (
    <>
      <TopBar title="Listas." subtitle={`${lists.length} listas ativas`}
        actions={<button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setShowNewList(true)}>＋ Nova lista</button>}
      />
      <div style={{ padding: '0 28px 40px', display: 'grid', gridTemplateColumns: lists.length > 1 ? '1fr 1fr' : '1fr', gap: 16 }} className="goals-grid">
        {lists.length === 0 && (
          <div className="panel" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⊞</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Nenhuma lista ainda</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Crie uma lista de compras para começar</div>
          </div>
        )}
        {lists.map(list => {
          if (!list.items) list.items = [];
          const total = list.items.length;
          const done = list.items.filter(i => i.done).length;
          const totalPrice = list.items.reduce((s, i) => s + (i.price || 0), 0);
          return (
            <div key={list.id} className="panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{list.icon || '🛒'}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{list.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{done}/{total} itens{totalPrice > 0 ? ` · R$ ${totalPrice.toFixed(2)}` : ''}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn-ghost small" onClick={() => archiveList(list.id)}>📦</button>
                  <button className="btn-ghost small" onClick={() => deleteList(list.id)} style={{ color: 'var(--neon-a)' }}>✕</button>
                </div>
              </div>
              {total > 0 && (
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${total ? (done/total)*100 : 0}%`, height: '100%', background: 'var(--gradient-neon)' }} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {list.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
                    <div className={`check ${item.done ? 'checked' : ''}`} style={{ width: 16, height: 16, fontSize: 8 }}
                      onClick={() => toggleItem(list.id, idx)}>{item.done && '✓'}</div>
                    <span style={{ flex: 1, fontSize: 13, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--ink-3)' : 'var(--ink-1)' }}>{item.text}</span>
                    {item.price > 0 && <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>R$ {item.price.toFixed(2)}</span>}
                    <button onClick={() => deleteItem(list.id, idx)} style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', fontSize: 12 }}>✕</button>
                  </div>
                ))}
              </div>
              {addingItemTo === list.id ? (
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <input className="form-input" placeholder="Item..." value={newItemText} onChange={e => setNewItemText(e.target.value)} style={{ flex: 1, padding: '6px 10px', fontSize: 12 }}
                    autoFocus onKeyDown={e => { if (e.key === 'Enter') addItem(list.id); if (e.key === 'Escape') setAddingItemTo(null); }} />
                  <input className="form-input" placeholder="R$" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} style={{ width: 60, padding: '6px 8px', fontSize: 12 }}
                    onKeyDown={e => { if (e.key === 'Enter') addItem(list.id); }} />
                  <button className="btn-ghost small" onClick={() => addItem(list.id)}>✓</button>
                </div>
              ) : (
                <button className="btn-ghost small" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }} onClick={() => { setAddingItemTo(list.id); setNewItemText(''); setNewItemPrice(''); }}>
                  ＋ Adicionar item
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showNewList && (
        <div className="modal-overlay" onClick={() => setShowNewList(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(400px, 90vw)' }}>
            <div className="modal-header"><h2>Nova lista</h2><button className="modal-close" onClick={() => setShowNewList(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Nome</label>
                  <input className="form-input" autoFocus placeholder="Ex: Supermercado" value={newListName} onChange={e => setNewListName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') createList(); }} />
                </div>
                <div className="form-group" style={{ width: 80 }}>
                  <label className="form-label">Ícone</label>
                  <input className="form-input" value={newListIcon} onChange={e => setNewListIcon(e.target.value)} style={{ textAlign: 'center' }} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowNewList(false)}>Cancelar</button>
              <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={createList}>Criar lista</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

window.ScreenShopping = ScreenShopping;

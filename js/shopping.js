function ScreenShopping() {
  const {
    data,
    commit
  } = useData();
  const lists = data.shopLists || [];
  const [showNewList, setShowNewList] = React.useState(false);
  const [newListName, setNewListName] = React.useState('');
  const [newListIcon, setNewListIcon] = React.useState('🛒');
  const [addingItemTo, setAddingItemTo] = React.useState(null);
  const [newItemText, setNewItemText] = React.useState('');
  const [newItemPrice, setNewItemPrice] = React.useState('');
  const [newItemUrl, setNewItemUrl] = React.useState('');
  const [newItemDate, setNewItemDate] = React.useState('');
  const [showExtras, setShowExtras] = React.useState(false);
  function createList() {
    if (!newListName.trim()) return;
    commit(D => {
      if (!D.shopLists) D.shopLists = [];
      D.shopLists.push({
        id: Orbita.uid(),
        name: newListName.trim(),
        icon: newListIcon,
        items: []
      });
    });
    setNewListName('');
    setNewListIcon('🛒');
    setShowNewList(false);
  }
  function addItem(listId) {
    if (!newItemText.trim()) return;
    let url = newItemUrl.trim();
    if (url && !/^[a-z]+:\/\//i.test(url)) url = 'https://' + url;
    commit(D => {
      const list = D.shopLists.find(l => l.id === listId);
      if (!list) return;
      const item = {
        text: newItemText.trim(),
        price: parseFloat(newItemPrice) || 0,
        done: false
      };
      if (url) item.url = url;
      if (newItemDate) item.date = newItemDate;
      list.items.push(item);
    });
    setNewItemText('');
    setNewItemPrice('');
    setNewItemUrl('');
    setNewItemDate('');
    setShowExtras(false);
    setAddingItemTo(null);
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
    commit(D => {
      D.shopLists = D.shopLists.filter(l => l.id !== listId);
    });
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
        stats: {
          total: list.items.length,
          done: list.items.filter(i => i.done).length,
          totalPrice: list.items.reduce((s, i) => s + (i.price || 0), 0)
        }
      });
    });
  }
  return React.createElement(React.Fragment, null, React.createElement(TopBar, {
    title: "Listas.",
    subtitle: `${lists.length} listas ativas`,
    actions: React.createElement("button", {
      className: "btn btn-primary",
      style: {
        padding: '10px 18px',
        fontSize: 13
      },
      onClick: () => setShowNewList(true)
    }, "\uFF0B Nova lista")
  }), React.createElement("div", {
    style: {
      padding: '0 28px 40px',
      display: 'grid',
      gridTemplateColumns: lists.length > 1 ? '1fr 1fr' : '1fr',
      gap: 16
    },
    className: "goals-grid"
  }, lists.length === 0 && React.createElement("div", {
    className: "panel",
    style: {
      gridColumn: '1/-1',
      textAlign: 'center',
      padding: '48px 24px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 12
    }
  }, "\u229E"), React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, "Nenhuma lista ainda"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, "Crie uma lista de compras para come\xE7ar")), lists.map(list => {
    if (!list.items) list.items = [];
    const total = list.items.length;
    const done = list.items.filter(i => i.done).length;
    const totalPrice = list.items.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
    return React.createElement("div", {
      key: list.id,
      className: "panel",
      style: {
        padding: 20
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement("span", {
      style: {
        fontSize: 20
      }
    }, list.icon || '🛒'), React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 500
      }
    }, list.name), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, done, "/", total, " itens", totalPrice > 0 ? ` · R$ ${totalPrice.toFixed(2)}` : ''))), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => archiveList(list.id)
    }, "\uD83D\uDCE6"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => deleteList(list.id),
      style: {
        color: 'var(--neon-a)'
      }
    }, "\u2715"))), total > 0 && React.createElement("div", {
      style: {
        height: 3,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        marginBottom: 12,
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        width: `${total ? done / total * 100 : 0}%`,
        height: '100%',
        background: 'var(--gradient-neon)'
      }
    })), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, list.items.map((item, idx) => {
      const dateLabel = item.date ? (() => {
        const [y, m, d] = item.date.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.round((dt - today) / 86400000);
        if (diffDays === 0) return 'hoje';
        if (diffDays === 1) return 'amanhã';
        if (diffDays === -1) return 'ontem';
        if (diffDays > 1 && diffDays < 7) return `em ${diffDays}d`;
        if (diffDays < -1 && diffDays > -30) return `há ${-diffDays}d`;
        return dt.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'short'
        });
      })() : null;
      const isOverdue = item.date && !item.done && new Date(item.date) < new Date(new Date().toDateString());
      return React.createElement("div", {
        key: idx,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 0',
          borderBottom: '1px solid var(--line)'
        }
      }, React.createElement("div", {
        className: `check ${item.done ? 'checked' : ''}`,
        style: {
          width: 16,
          height: 16,
          fontSize: 8
        },
        onClick: () => toggleItem(list.id, idx)
      }, item.done && '✓'), React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }
      }, React.createElement("span", {
        style: {
          fontSize: 13,
          textDecoration: item.done ? 'line-through' : 'none',
          color: item.done ? 'var(--ink-3)' : 'var(--ink-1)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, item.text), dateLabel && React.createElement("span", {
        className: "mono",
        style: {
          fontSize: 9,
          color: isOverdue ? '#ff5a3c' : 'var(--ink-3)'
        }
      }, isOverdue ? '⚠ ' : '⏱ ', dateLabel)), item.url && React.createElement("a", {
        href: item.url,
        target: "_blank",
        rel: "noopener noreferrer",
        title: item.url,
        onClick: e => e.stopPropagation(),
        style: {
          display: 'grid',
          placeItems: 'center',
          width: 22,
          height: 22,
          borderRadius: 6,
          background: 'rgba(91,141,255,0.1)',
          border: '1px solid rgba(91,141,255,0.25)',
          color: '#5b8dff',
          fontSize: 11,
          textDecoration: 'none',
          flexShrink: 0
        }
      }, "\u2197"), parseFloat(item.price) > 0 && React.createElement("span", {
        className: "mono",
        style: {
          fontSize: 11,
          color: 'var(--ink-3)',
          flexShrink: 0
        }
      }, "R$ ", parseFloat(item.price).toFixed(2)), React.createElement("button", {
        onClick: () => deleteItem(list.id, idx),
        style: {
          background: 'none',
          border: 'none',
          color: 'var(--ink-4)',
          cursor: 'pointer',
          fontSize: 12,
          flexShrink: 0
        }
      }, "\u2715"));
    })), addingItemTo === list.id ? React.createElement("div", {
      style: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, React.createElement("input", {
      className: "form-input",
      placeholder: "Item...",
      value: newItemText,
      onChange: e => setNewItemText(e.target.value),
      style: {
        flex: 1,
        padding: '6px 10px',
        fontSize: 12
      },
      autoFocus: true,
      onKeyDown: e => {
        if (e.key === 'Enter') addItem(list.id);
        if (e.key === 'Escape') {
          setAddingItemTo(null);
          setShowExtras(false);
        }
      }
    }), React.createElement("input", {
      className: "form-input",
      placeholder: "R$",
      value: newItemPrice,
      onChange: e => setNewItemPrice(e.target.value),
      style: {
        width: 60,
        padding: '6px 8px',
        fontSize: 12
      },
      onKeyDown: e => {
        if (e.key === 'Enter') addItem(list.id);
      }
    }), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => setShowExtras(s => !s),
      title: "Link / data",
      style: {
        padding: '6px 8px',
        color: showExtras ? 'var(--neon-a)' : undefined
      }
    }, "\uFF0B"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => addItem(list.id)
    }, "\u2713")), showExtras && React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, React.createElement("input", {
      className: "form-input",
      type: "url",
      placeholder: "\uD83D\uDD17 https://...",
      value: newItemUrl,
      onChange: e => setNewItemUrl(e.target.value),
      style: {
        flex: 1,
        padding: '6px 10px',
        fontSize: 11
      },
      onKeyDown: e => {
        if (e.key === 'Enter') addItem(list.id);
      }
    }), React.createElement("input", {
      className: "form-input",
      type: "date",
      placeholder: "\uD83D\uDCC5",
      value: newItemDate,
      onChange: e => setNewItemDate(e.target.value),
      style: {
        width: 130,
        padding: '6px 8px',
        fontSize: 11
      },
      onKeyDown: e => {
        if (e.key === 'Enter') addItem(list.id);
      }
    }))) : React.createElement("button", {
      className: "btn-ghost small",
      style: {
        marginTop: 8,
        width: '100%',
        justifyContent: 'center'
      },
      onClick: () => {
        setAddingItemTo(list.id);
        setNewItemText('');
        setNewItemPrice('');
        setNewItemUrl('');
        setNewItemDate('');
        setShowExtras(false);
      }
    }, "\uFF0B Adicionar item"));
  })), showNewList && React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setShowNewList(false)
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(400px, 90vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, "Nova lista"), React.createElement("button", {
    className: "modal-close",
    onClick: () => setShowNewList(false)
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group",
    style: {
      flex: 1
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "Nome"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Ex: Supermercado",
    value: newListName,
    onChange: e => setNewListName(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') createList();
    }
  })), React.createElement("div", {
    className: "form-group",
    style: {
      width: 80
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "\xCDcone"), React.createElement("input", {
    className: "form-input",
    value: newListIcon,
    onChange: e => setNewListIcon(e.target.value),
    style: {
      textAlign: 'center'
    }
  })))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: () => setShowNewList(false)
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: createList
  }, "Criar lista")))));
}
window.ScreenShopping = ScreenShopping;
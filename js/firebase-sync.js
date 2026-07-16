/* Orbita v2 — Firebase integration (Auth + Firestore sync) */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA5Mr_PMNfazmPqOeDaqdwWv3yHzEone5Q",
  authDomain: "orbita-386d6.firebaseapp.com",
  projectId: "orbita-386d6",
  storageBucket: "orbita-386d6.firebasestorage.app",
  messagingSenderId: "558543348252",
  appId: "1:558543348252:web:e9b79438b31bb9db7435d9"
};

let _fb = null;
let _auth = null;
let _db = null;
let _currentUser = null;
let _syncTimer = null;

function initFirebase() {
  if (_fb) return;
  _fb = firebase.initializeApp(FIREBASE_CONFIG);
  _auth = firebase.auth();
  _db = firebase.firestore();

  _auth.onAuthStateChanged(user => {
    _currentUser = user;
    window.dispatchEvent(new CustomEvent('orbita:authChanged', { detail: user }));
    if (user) {
      console.log('Firebase: logged in as', user.email);
      pullFromCloud();
    } else {
      console.log('Firebase: logged out');
    }
  });
}

async function signInWithGoogle(requestCalendar) {
  initFirebase();
  const provider = new firebase.auth.GoogleAuthProvider();
  if (requestCalendar || localStorage.getItem('orbita_gcalConnected')) {
    provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
  }
  try {
    const result = await _auth.signInWithPopup(provider);
    const credential = result.credential;
    if (credential && credential.accessToken && window.OrbitaCalendar) {
      window.OrbitaCalendar.setAccessToken(credential.accessToken);
      if (requestCalendar) localStorage.setItem('orbita_gcalConnected', '1');
      window.dispatchEvent(new CustomEvent('orbita:calendarConnected'));
    }
  } catch (e) {
    console.error('Google sign-in failed:', e);
    alert('Erro no login: ' + e.message);
  }
}

async function connectGoogleCalendar() {
  initFirebase();
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
  try {
    const result = await _auth.currentUser.linkWithPopup(provider);
    const credential = result.credential;
    if (credential && credential.accessToken && window.OrbitaCalendar) {
      window.OrbitaCalendar.setAccessToken(credential.accessToken);
      localStorage.setItem('orbita_gcalConnected', '1');
      window.dispatchEvent(new CustomEvent('orbita:calendarConnected'));
    }
  } catch (e) {
    if (e.code === 'auth/credential-already-in-use' || e.code === 'auth/provider-already-linked') {
      await signInWithGoogle(true);
    } else {
      console.error('Calendar connect failed:', e);
      alert('Erro ao conectar Google Calendar: ' + e.message);
    }
  }
}

function disconnectGoogleCalendar() {
  if (window.OrbitaCalendar) window.OrbitaCalendar.disconnect();
  window.dispatchEvent(new CustomEvent('orbita:calendarDisconnected'));
}

async function signInWithEmail(email, password) {
  initFirebase();
  try {
    await _auth.signInWithEmailAndPassword(email, password);
  } catch (e) {
    if (e.code === 'auth/user-not-found') {
      if (confirm('Conta não encontrada. Criar nova conta?')) {
        await _auth.createUserWithEmailAndPassword(email, password);
      }
    } else {
      alert('Erro: ' + e.message);
    }
  }
}

function signOut() {
  if (_auth) _auth.signOut();
}

function getCurrentUser() { return _currentUser; }

async function pushToCloud(data) {
  if (!_currentUser || !_db) return;
  try {
    const payload = JSON.parse(JSON.stringify(data));
    // Strip large base64 images to keep document under 1MB
    stripImages(payload);
    await _db.collection('users').doc(_currentUser.uid).set({
      data: payload,
      lastModified: firebase.firestore.FieldValue.serverTimestamp(),
      email: _currentUser.email,
      displayName: _currentUser.displayName || null,
    }, { merge: true });
    console.log('Firebase: pushed to cloud');
    maybeCloudBackup(payload);
  } catch (e) {
    console.error('Firebase push failed:', e);
  }
}

/* Backup versionado na nuvem: 1x/dia grava um snapshot em users/{uid}/backups/{YYYY-MM-DD}.
 * Recuperável se um sync ruim corromper o doc principal. Mantém ~14 dias. */
async function maybeCloudBackup(payload) {
  if (!_currentUser || !_db) return;
  try {
    const dayKey = new Date().toISOString().slice(0, 10);
    const lastKey = localStorage.getItem('orbita_lastCloudBackup');
    if (lastKey === dayKey) return;
    await _db.collection('users').doc(_currentUser.uid)
      .collection('backups').doc(dayKey)
      .set({ data: payload, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    localStorage.setItem('orbita_lastCloudBackup', dayKey);
    // Limpeza best-effort: remove backups além dos 14 mais recentes
    const snap = await _db.collection('users').doc(_currentUser.uid)
      .collection('backups').orderBy('createdAt', 'desc').get();
    if (snap.size > 14) {
      const extra = snap.docs.slice(14);
      await Promise.allSettled(extra.map(d => d.ref.delete()));
    }
  } catch (e) {
    console.warn('Cloud backup skipped:', e.message);
  }
}

/* Merge nível-entidade: une arrays por id (o "base", mais recente, vence em conflito).
 * Preserva itens criados offline no outro device em vez de sobrescrever o doc inteiro. */
function mergeById(baseArr, otherArr) {
  if (!Array.isArray(baseArr)) return otherArr || [];
  if (!Array.isArray(otherArr)) return baseArr;
  const seen = new Set(baseArr.map(x => x && x.id).filter(Boolean));
  const merged = baseArr.slice();
  otherArr.forEach(x => { if (x && x.id && !seen.has(x.id)) merged.push(x); });
  return merged;
}

function mergeData(base, other) {
  if (!other) return base;
  if (!base) return other;
  const out = JSON.parse(JSON.stringify(base));
  ['tasks', 'habits', 'goals', 'categories', 'notes', 'ideias', 'shopLists'].forEach(k => {
    if (Array.isArray(base[k]) || Array.isArray(other[k])) out[k] = mergeById(base[k], other[k]);
  });
  if (base.media || other.media) {
    out.media = out.media || {};
    ['livros', 'filmes', 'series', 'docs'].forEach(k => {
      out.media[k] = mergeById((base.media || {})[k], (other.media || {})[k]);
    });
  }
  if ((base._finance && base._finance.transactions) || (other._finance && other._finance.transactions)) {
    out._finance = out._finance || base._finance || other._finance || {};
    out._finance.transactions = mergeById(
      (base._finance || {}).transactions, (other._finance || {}).transactions);
  }
  return out;
}

async function pullFromCloud() {
  if (!_currentUser || !_db) return null;
  try {
    const doc = await _db.collection('users').doc(_currentUser.uid).get();
    if (doc.exists && doc.data().data) {
      const cloudData = doc.data().data;
      const localData = JSON.parse(localStorage.getItem('meuPainel_v4') || '{}');
      const cloudTime = cloudData.lastModified || 0;
      const localTime = localData.lastModified || 0;
      if (cloudTime > localTime) {
        // Nuvem é mais nova — mas une entidades criadas só no local (offline) pra não perdê-las
        const merged = mergeData(cloudData, localData);
        mergeLocalImages(merged, localData);
        merged.lastModified = cloudData.lastModified || cloudTime;
        localStorage.setItem('meuPainel_v4', JSON.stringify(merged));
        console.log('Firebase: pulled newer data from cloud (merged local-only entities)');
        window.dispatchEvent(new CustomEvent('orbita:dataPulled', { detail: merged }));
        return merged;
      } else {
        console.log('Firebase: local is newer, merging cloud-only entities then pushing');
        const merged = mergeData(localData, cloudData);
        merged.lastModified = localData.lastModified || localTime;
        localStorage.setItem('meuPainel_v4', JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('orbita:dataPulled', { detail: merged }));
        pushToCloud(merged);
      }
    } else {
      console.log('Firebase: no cloud data, pushing local');
      const localData = JSON.parse(localStorage.getItem('meuPainel_v4') || '{}');
      if (localData.tasks) pushToCloud(localData);
    }
  } catch (e) {
    console.error('Firebase pull failed:', e);
  }
  return null;
}

function scheduleSyncFirebase(data) {
  if (!_currentUser) return;
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => pushToCloud(data), 3000);
}

function stripImages(obj) {
  if (Array.isArray(obj)) { obj.forEach(stripImages); return; }
  if (obj && typeof obj === 'object') {
    for (const k in obj) {
      if (k === 'coverImage' || k === 'image' || k === 'images') { delete obj[k]; continue; }
      if (typeof obj[k] === 'string' && obj[k].startsWith('data:image/')) { delete obj[k]; continue; }
      stripImages(obj[k]);
    }
  }
}

function mergeLocalImages(cloud, local) {
  // Restore images from local that were stripped from cloud
  if (local.goals && cloud.goals) {
    cloud.goals.forEach((g, i) => {
      const localG = local.goals.find(lg => lg.id === g.id);
      if (localG) { g.coverImage = localG.coverImage; }
    });
  }
  if (local.ideias && cloud.ideias) {
    cloud.ideias.forEach((idea, i) => {
      const localI = local.ideias.find(li => li.id === idea.id);
      if (localI) { idea.image = localI.image; }
    });
  }
  if (local.notes && cloud.notes) {
    cloud.notes.forEach((n, i) => {
      if (local.notes[i] && local.notes[i].images) { n.images = local.notes[i].images; }
    });
  }
  if (local._notebooks) cloud._notebooks = local._notebooks;
}

window.OrbitaFirebase = {
  init: initFirebase,
  signInWithGoogle,
  signInWithEmail,
  signOut,
  getCurrentUser,
  pushToCloud,
  pullFromCloud,
  scheduleSyncFirebase,
  connectGoogleCalendar,
  disconnectGoogleCalendar,
  mergeData,
  mergeImagesInto: mergeLocalImages,
};

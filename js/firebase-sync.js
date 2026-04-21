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
  } catch (e) {
    console.error('Firebase push failed:', e);
  }
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
        // Cloud is newer — merge images from local (they're stripped from cloud)
        mergeLocalImages(cloudData, localData);
        localStorage.setItem('meuPainel_v4', JSON.stringify(cloudData));
        console.log('Firebase: pulled newer data from cloud');
        window.dispatchEvent(new CustomEvent('orbita:dataPulled', { detail: cloudData }));
        return cloudData;
      } else {
        console.log('Firebase: local is newer, pushing');
        pushToCloud(localData);
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
};

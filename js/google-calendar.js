/* Orbita v2 — Google Calendar integration via REST API */

const OrbitaCalendar = (() => {
  let _accessToken = null;
  let _eventsCache = {};
  let _lastFetch = 0;
  const CACHE_TTL = 5 * 60 * 1000; // 5 min

  function setAccessToken(token) {
    _accessToken = token;
    _eventsCache = {};
    _lastFetch = 0;
    if (token) localStorage.setItem('orbita_gcalToken', token);
    else localStorage.removeItem('orbita_gcalToken');
  }

  function restoreToken() {
    if (_accessToken) return;
    const saved = localStorage.getItem('orbita_gcalToken');
    if (saved && localStorage.getItem('orbita_gcalConnected')) {
      _accessToken = saved;
    }
  }

  function getAccessToken() { return _accessToken; }
  function isConnected() { restoreToken(); return !!_accessToken; }

  async function fetchEvents(dateStr) {
    if (!_accessToken) return [];

    const now = Date.now();
    if (_eventsCache[dateStr] && now - _lastFetch < CACHE_TTL) {
      return _eventsCache[dateStr];
    }

    const dayStart = new Date(dateStr + 'T00:00:00');
    const dayEnd = new Date(dateStr + 'T23:59:59');
    const params = new URLSearchParams({
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '50',
    });

    try {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
        { headers: { Authorization: `Bearer ${_accessToken}` } }
      );

      if (res.status === 401) {
        _accessToken = null;
        localStorage.removeItem('orbita_gcalToken');
        window.dispatchEvent(new CustomEvent('orbita:calendarTokenExpired'));
        return [];
      }

      if (!res.ok) return [];

      const json = await res.json();
      const events = (json.items || []).map(ev => ({
        id: ev.id,
        title: ev.summary || '(sem título)',
        start: ev.start.dateTime || ev.start.date,
        end: ev.end.dateTime || ev.end.date,
        allDay: !ev.start.dateTime,
        location: ev.location || null,
        description: ev.description || null,
        color: ev.colorId ? GCAL_COLORS[ev.colorId] : null,
        htmlLink: ev.htmlLink,
        status: ev.status,
      })).filter(ev => ev.status !== 'cancelled');

      _eventsCache[dateStr] = events;
      _lastFetch = now;
      return events;
    } catch (e) {
      console.error('Google Calendar fetch failed:', e);
      return [];
    }
  }

  async function fetchWeekEvents(baseDateStr) {
    if (!_accessToken) return [];

    const base = new Date(baseDateStr);
    const start = new Date(base);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const params = new URLSearchParams({
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '100',
    });

    try {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
        { headers: { Authorization: `Bearer ${_accessToken}` } }
      );
      if (!res.ok) return [];
      const json = await res.json();
      return (json.items || []).map(ev => ({
        id: ev.id,
        title: ev.summary || '(sem título)',
        start: ev.start.dateTime || ev.start.date,
        end: ev.end.dateTime || ev.end.date,
        allDay: !ev.start.dateTime,
        location: ev.location || null,
        color: ev.colorId ? GCAL_COLORS[ev.colorId] : null,
        htmlLink: ev.htmlLink,
      })).filter(ev => ev.status !== 'cancelled');
    } catch (e) {
      console.error('Google Calendar week fetch failed:', e);
      return [];
    }
  }

  async function fetchRangeEvents(startDate, endDate) {
    if (!_accessToken) return [];
    const cacheKey = `${startDate}_${endDate}`;
    const now = Date.now();
    if (_eventsCache[cacheKey] && now - _lastFetch < CACHE_TTL) {
      return _eventsCache[cacheKey];
    }
    const params = new URLSearchParams({
      timeMin: new Date(startDate + 'T00:00:00').toISOString(),
      timeMax: new Date(endDate + 'T23:59:59').toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '200',
    });
    try {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
        { headers: { Authorization: `Bearer ${_accessToken}` } }
      );
      if (!res.ok) return [];
      const json = await res.json();
      const events = (json.items || []).map(ev => ({
        id: ev.id,
        title: ev.summary || '(sem título)',
        start: ev.start.dateTime || ev.start.date,
        end: ev.end.dateTime || ev.end.date,
        allDay: !ev.start.dateTime,
        location: ev.location || null,
        color: ev.colorId ? GCAL_COLORS[ev.colorId] : null,
        htmlLink: ev.htmlLink,
        status: ev.status,
      })).filter(ev => ev.status !== 'cancelled');
      _eventsCache[cacheKey] = events;
      _lastFetch = now;
      return events;
    } catch (e) {
      console.error('Google Calendar range fetch failed:', e);
      return [];
    }
  }

  function clearCache() {
    _eventsCache = {};
    _lastFetch = 0;
  }

  function disconnect() {
    _accessToken = null;
    _eventsCache = {};
    _lastFetch = 0;
    localStorage.removeItem('orbita_gcalConnected');
    localStorage.removeItem('orbita_gcalToken');
  }

  const GCAL_COLORS = {
    '1': '#7986cb', '2': '#33b679', '3': '#8e24aa', '4': '#e67c73',
    '5': '#f6bf26', '6': '#f4511e', '7': '#039be5', '8': '#616161',
    '9': '#3f51b5', '10': '#0b8043', '11': '#d50000',
  };

  return {
    setAccessToken,
    getAccessToken,
    isConnected,
    fetchEvents,
    fetchWeekEvents,
    fetchRangeEvents,
    clearCache,
    disconnect,
    GCAL_COLORS,
  };
})();

window.OrbitaCalendar = OrbitaCalendar;

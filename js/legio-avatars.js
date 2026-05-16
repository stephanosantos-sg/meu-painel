/* Imperium — Legio Avatars
 * Stylized Roman denarius-style profile portraits for each of the 10 emperor agents.
 * Each render returns an inline SVG string. Vector, ~1KB each, zero network deps.
 */
(function () {
  const GOLD_DARK = '#9A7B1F';
  const GOLD_MID = '#D4AF37';
  const GOLD_LIGHT = '#F4D17A';
  const RED_DEEP = '#3a0a0a';
  const RED_DARK = '#1a0606';

  // Reusable defs (gradients) — generated once per render to keep id-uniqueness when multiple SVGs are inlined.
  function defs(uid) {
    return `
      <defs>
        <radialGradient id="bg_${uid}" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stop-color="${RED_DEEP}"/>
          <stop offset="55%" stop-color="${RED_DARK}"/>
          <stop offset="100%" stop-color="#08080c"/>
        </radialGradient>
        <linearGradient id="gold_${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${GOLD_LIGHT}"/>
          <stop offset="50%" stop-color="${GOLD_MID}"/>
          <stop offset="100%" stop-color="${GOLD_DARK}"/>
        </linearGradient>
      </defs>
    `;
  }

  // Wrap any content in the coin frame (rim, background)
  function coin(uid, content) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      ${defs(uid)}
      <circle cx="50" cy="50" r="48" fill="url(#bg_${uid})"/>
      <circle cx="50" cy="50" r="46.5" fill="none" stroke="url(#gold_${uid})" stroke-width="1.1" opacity="0.85"/>
      <circle cx="50" cy="50" r="43" fill="none" stroke="url(#gold_${uid})" stroke-width="0.4" opacity="0.4"/>
      ${content}
    </svg>`;
  }

  // Building blocks (all positioned on a 100×100 viewBox, face centered, profile facing right)
  // Base head silhouette (no hair, no beard) — used by everyone
  function baseHead() {
    return `<path d="M 30 58
                   C 30 45, 36 36, 47 33
                   C 58 31, 67 36, 70 46
                   L 71 58
                   L 73 62
                   L 70 64
                   L 68 70
                   C 67 76, 64 80, 58 81
                   L 56 86
                   L 52 90
                   L 44 90
                   L 40 84
                   L 36 78
                   C 32 74, 30 68, 30 58 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>`;
  }

  // Hair caps
  function hairYoungCurly() {
    return `<path d="M 30 50 C 32 38, 40 30, 52 30 C 64 30, 71 38, 72 48 L 70 46 C 67 38, 60 34, 52 35 C 44 36, 36 42, 33 50 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>
            <circle cx="38" cy="44" r="2.5" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.3"/>
            <circle cx="46" cy="38" r="2.8" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.3"/>
            <circle cx="55" cy="36" r="2.8" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.3"/>
            <circle cx="64" cy="40" r="2.5" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.3"/>`;
  }
  function hairStraight() {
    return `<path d="M 30 52 C 32 40, 40 32, 52 32 C 64 32, 72 40, 73 50 L 71 49 C 67 41, 60 38, 52 38 C 44 38, 36 44, 32 52 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>`;
  }
  function hairBalding() {
    return `<path d="M 30 56 C 31 50, 33 46, 36 44 C 39 44, 41 48, 42 52 L 38 56 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>
            <path d="M 60 35 C 64 36, 68 40, 70 46 L 65 44 C 62 40, 60 38, 60 35 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>`;
  }
  function hairBald() {
    return ``;
  }

  // Beards
  function beardFull() {
    return `<path d="M 36 78 C 36 82, 40 86, 44 88 L 52 90 L 58 88 C 62 86, 64 82, 64 78 L 62 76 C 58 80, 54 82, 50 82 C 46 82, 42 80, 38 76 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>
            <circle cx="42" cy="80" r="1.4" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.2"/>
            <circle cx="48" cy="84" r="1.4" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.2"/>
            <circle cx="55" cy="84" r="1.4" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.2"/>
            <circle cx="60" cy="80" r="1.2" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.2"/>`;
  }
  function beardShort() {
    return `<path d="M 40 80 C 42 84, 48 86, 52 86 L 56 84 C 58 82, 60 80, 60 78 L 58 77 C 55 80, 50 81, 46 80 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>`;
  }
  function beardNone() {
    return ``;
  }

  // Laurel wreath
  function laurel() {
    return `<g fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.3">
      <ellipse cx="30" cy="48" rx="4" ry="2" transform="rotate(-30 30 48)"/>
      <ellipse cx="33" cy="42" rx="4.5" ry="2.2" transform="rotate(-45 33 42)"/>
      <ellipse cx="38" cy="36" rx="5" ry="2.4" transform="rotate(-58 38 36)"/>
      <ellipse cx="45" cy="32" rx="5" ry="2.4" transform="rotate(-75 45 32)"/>
      <ellipse cx="52" cy="30" rx="5" ry="2.4" transform="rotate(-90 52 30)"/>
      <ellipse cx="60" cy="32" rx="5" ry="2.4" transform="rotate(75 60 32)"/>
      <ellipse cx="67" cy="36" rx="5" ry="2.4" transform="rotate(58 67 36)"/>
      <ellipse cx="72" cy="42" rx="4.5" ry="2.2" transform="rotate(45 72 42)"/>
      <circle cx="50" cy="28" r="1.8"/>
    </g>`;
  }

  // Helmet (Roman galea — for military emperors)
  function helmet() {
    return `<path d="M 28 50 C 28 36, 38 26, 52 26 C 66 26, 74 36, 74 50 L 74 54 L 70 54 L 70 50 C 70 38, 62 32, 52 32 C 42 32, 34 38, 34 50 L 34 54 L 30 54 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>
            <path d="M 50 24 L 54 24 L 60 14 L 56 14 L 52 22 L 48 22 L 44 14 L 40 14 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>
            <rect x="30" y="52" width="44" height="2" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.3"/>`;
  }

  // Diadem (Eastern-style for Diocletian, Constantine)
  function diadem() {
    return `<path d="M 28 38 L 76 38 L 74 42 L 30 42 Z" fill="url(#gold_HEAD)" stroke="${GOLD_DARK}" stroke-width="0.4"/>
            <circle cx="52" cy="40" r="2" fill="${GOLD_LIGHT}" stroke="${GOLD_DARK}" stroke-width="0.3"/>`;
  }

  // Eye + small details (always the same)
  function face() {
    return `<circle cx="60" cy="56" r="0.9" fill="${RED_DARK}"/>
            <path d="M 56 62 L 64 62 L 62 64 Z" fill="${GOLD_DARK}" opacity="0.5"/>`;
  }

  // Letter monogram at bottom of coin
  function monogram(letter) {
    return `<text x="50" y="98" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="6" fill="${GOLD_MID}" letter-spacing="2">${letter}</text>`;
  }

  // Build a portrait: hair/feature + base head + beard + face + (optional ornament) + monogram
  // Note: we replace gold_HEAD with gold_<uid> after composition.
  function compose({ uid, hair = '', beard = '', ornament = '', mono = '' }) {
    const inner = `
      ${baseHead()}
      ${beard}
      ${hair}
      ${ornament}
      ${face()}
      ${monogram(mono)}
    `.replace(/gold_HEAD/g, `gold_${uid}`);
    return coin(uid, inner);
  }

  const AVATARS = {
    augustus:       () => compose({ uid: 'aug', hair: hairYoungCurly(), beard: beardNone(),  ornament: laurel(),  mono: 'AVG' }),
    trajan:         () => compose({ uid: 'tra', hair: hairBalding(),    beard: beardNone(),  ornament: laurel(),  mono: 'TRA' }),
    marcus:         () => compose({ uid: 'mar', hair: hairYoungCurly(), beard: beardFull(),  ornament: '',        mono: 'MAR' }),
    hadrian:        () => compose({ uid: 'had', hair: hairYoungCurly(), beard: beardShort(), ornament: '',        mono: 'HAD' }),
    vespasian:      () => compose({ uid: 'ves', hair: hairBald(),       beard: beardNone(),  ornament: '',        mono: 'VES' }),
    lucius_verus:   () => compose({ uid: 'luc', hair: hairYoungCurly(), beard: beardFull(),  ornament: '',        mono: 'LVC' }),
    diocletian:     () => compose({ uid: 'dio', hair: hairStraight(),   beard: beardShort(), ornament: diadem(),  mono: 'DIO' }),
    caesar:         () => compose({ uid: 'cae', hair: hairBalding(),    beard: beardNone(),  ornament: laurel(),  mono: 'CSR' }),
    tiberius:       () => compose({ uid: 'tib', hair: hairStraight(),   beard: beardNone(),  ornament: '',        mono: 'TIB' }),
    claudius:       () => compose({ uid: 'cla', hair: hairBald(),       beard: beardNone(),  ornament: helmet(),  mono: 'CLA' }),
  };

  function getAvatarSVG(slug) {
    const fn = AVATARS[slug];
    return fn ? fn() : coin('unknown', `<text x="50" y="55" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="${GOLD_MID}">?</text>`);
  }

  function getAvatarDataUri(slug) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(getAvatarSVG(slug));
  }

  window.LegioAvatars = { getAvatarSVG, getAvatarDataUri, slugs: Object.keys(AVATARS) };
})();

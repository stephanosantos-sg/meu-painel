/* Orbita — Avatar Sprite Renderer (SVG, pixel silhouette style)
   Each sprite is a composition of "pixel blocks" — groups of rectangles
   forming a stylized 16-bit silhouette. Grid: 32w × 44h logical units.
*/
(function(){
  const W = 32, H = 44;
  const VB = `0 0 ${W} ${H}`;

  // Base character colors (shared across all sprites)
  const B = {
    skin: '#f4c9a0', skinS: '#c99068', skinD: '#8a5a3a',
    hair: '#5a3418', hairD: '#3a2010',
    eye:  '#3a9b4e', eyeL: '#8ee89a',
    mouth:'#7a3a28',
    outline: '#141016',
    white: '#ffffff', black: '#000000',
    leather:'#8b5a3c', leatherD:'#5a3a22',
  };

  // ── helpers ──────────────────────────────────────────────
  function rect(x,y,w,h,fill){ return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" shape-rendering="crispEdges"/>`; }
  function group(parts){ return parts.join(''); }

  // Canonical head — used for most sprites.
  // y=1..13. Face occupies cols 10..21 roughly.
  // Variants: plain, beardShort, beardMed, beardLong, shaved, hooded(color), masked(color), helmOpen(colors), wizHat(colors)
  function head(opts = {}) {
    const o = B.outline;
    const hair = opts.hair || B.hair;
    const hairD = opts.hairD || B.hairD;
    const skin = opts.skin || B.skin;
    const skinS = opts.skinS || B.skinS;
    const out = [];
    // ---- base head shape (rectangular chibi) ----
    // outline
    out.push(rect(11,1,10,1,o));
    out.push(rect(10,2,12,1,o));
    out.push(rect(9,3,1,9,o));  // left outline
    out.push(rect(22,3,1,9,o)); // right outline
    out.push(rect(10,12,2,1,o));
    out.push(rect(20,12,2,1,o));
    out.push(rect(12,13,8,1,o));

    // ---- hair top ----
    if (opts.variant === 'shaved') {
      // bald
      out.push(rect(10,3,12,2,skinS));
      out.push(rect(10,5,12,1,skin));
    } else if (opts.variant === 'hooded') {
      const hc = opts.hoodColor || '#2d5a2d';
      const hcD = opts.hoodColorD || '#1a3a1a';
      // hood drape
      out.push(rect(8,2,16,1,o));
      out.push(rect(7,3,1,10,o));
      out.push(rect(24,3,1,10,o));
      out.push(rect(8,3,16,2,hc));
      out.push(rect(9,5,14,1,hc));
      out.push(rect(8,6,2,7,hcD));
      out.push(rect(22,6,2,7,hcD));
      out.push(rect(10,5,1,1,hcD));
      out.push(rect(21,5,1,1,hcD));
    } else if (opts.variant === 'wizHat') {
      const hc = opts.hatColor || '#4a2074';
      const hcD = opts.hatColorD || '#2a0f54';
      const star = opts.hatStar || '#ffcf5c';
      // pointy hat
      out.push(rect(15,-2,2,1,o));
      out.push(rect(14,-1,4,1,hc));
      out.push(rect(13,0,6,1,hc));
      out.push(rect(12,1,8,1,hc));
      out.push(rect(11,2,10,1,hc));
      out.push(rect(10,3,12,1,hc));
      out.push(rect(9,4,14,1,hc));
      // hat band / brim
      out.push(rect(8,5,16,1,hcD));
      out.push(rect(8,6,16,1,hcD));
      // stars
      out.push(rect(14,2,1,1,star));
      out.push(rect(17,3,1,1,star));
      // hair under hat
      out.push(rect(10,7,12,1,hair));
    } else if (opts.variant === 'helm') {
      const hc = opts.helmColor || '#b8c4d4';
      const hcD = opts.helmColorD || '#6878a0';
      const trim = opts.helmTrim || '#d4a42a';
      // helmet shell
      out.push(rect(10,1,12,1,o));
      out.push(rect(9,2,14,1,o));
      out.push(rect(8,3,1,8,o));
      out.push(rect(23,3,1,8,o));
      out.push(rect(9,2,14,2,hc));
      out.push(rect(9,4,14,1,hcD));
      out.push(rect(9,5,14,1,hc));
      // trim band
      if (trim) { out.push(rect(10,3,12,1,trim)); out.push(rect(11,2,10,1,trim)); }
      // face opening
      out.push(rect(10,7,12,4,skin));
      out.push(rect(9,6,14,1,hc));
      out.push(rect(9,7,1,4,hcD));
      out.push(rect(22,7,1,4,hcD));
      out.push(rect(10,11,12,1,hc));
      // eyes
      out.push(rect(12,8,2,2,o));
      out.push(rect(18,8,2,2,o));
      out.push(rect(13,8,1,1,B.eye));
      out.push(rect(19,8,1,1,B.eye));
      // mouth
      out.push(rect(14,10,4,1,B.mouth));
      return group(out);
    } else {
      // plain / bearded — brown hair
      out.push(rect(10,3,12,1,hairD));
      out.push(rect(10,4,12,2,hair));
      out.push(rect(11,6,10,1,hair));
      out.push(rect(10,4,1,4,hairD));
      out.push(rect(21,4,1,4,hairD));
    }

    // ---- face skin (common) ----
    out.push(rect(10,6,12,6,skin));
    // side skin shadow
    out.push(rect(10,11,12,1,skinS));
    out.push(rect(21,7,1,4,skinS));

    // ---- eyes ----
    const eyeCol = opts.eyeGlow || B.eye;
    const eyeHL = opts.eyeGlowL || B.eyeL;
    out.push(rect(12,8,2,2,o));
    out.push(rect(18,8,2,2,o));
    out.push(rect(13,8,1,1,eyeCol));
    out.push(rect(19,8,1,1,eyeCol));
    if (opts.glowEyes) {
      out.push(rect(12,8,2,2,eyeCol));
      out.push(rect(13,8,1,1,eyeHL));
      out.push(rect(19,8,1,1,eyeHL));
    }

    // ---- mouth ----
    out.push(rect(14,11,4,1,B.mouth));

    // ---- beards ----
    if (opts.beard === 'short') {
      const bc = opts.beardColor || hair;
      out.push(rect(12,12,8,1,bc));
      out.push(rect(13,11,1,1,bc));
      out.push(rect(18,11,1,1,bc));
    } else if (opts.beard === 'med') {
      const bc = opts.beardColor || hair;
      out.push(rect(12,11,1,1,bc));
      out.push(rect(19,11,1,1,bc));
      out.push(rect(11,12,10,1,bc));
      out.push(rect(12,13,8,1,bc));
      out.push(rect(13,14,6,1,bc));
    } else if (opts.beard === 'long') {
      const bc = opts.beardColor || '#e8e8e8';
      const bcD = opts.beardColorD || '#b0b0b0';
      out.push(rect(11,12,10,1,bc));
      out.push(rect(10,13,12,1,bc));
      out.push(rect(10,14,12,1,bc));
      out.push(rect(11,15,10,1,bcD));
      out.push(rect(12,16,8,1,bcD));
      out.push(rect(13,17,6,1,bcD));
    }

    return group(out);
  }

  // ---- torso/body region (rows 14..33) ----
  // We'll compose body with modular pieces:
  //  - body base (shape)
  //  - armor/tunic
  //  - shoulder pads
  //  - cape
  //  - arms
  //  - legs
  //  - boots
  //  - belt
  //  - weapon(s)

  function cape(color, colorD, long=false){
    const out = [];
    // cape behind shoulders and trailing
    out.push(rect(7,15,2,15,color));
    out.push(rect(23,15,2,15,color));
    out.push(rect(6,17,1,13,colorD));
    out.push(rect(25,17,1,13,colorD));
    if (long) {
      out.push(rect(7,30,2,6,color));
      out.push(rect(23,30,2,6,color));
      out.push(rect(6,30,1,5,colorD));
      out.push(rect(25,30,1,5,colorD));
    }
    return group(out);
  }

  function arms(skin, skinS, sleeve, sleeveD, sleeveLen=4, cuff=null){
    const out = [];
    // upper arm
    out.push(rect(8,16,2,sleeveLen,sleeve));
    out.push(rect(22,16,2,sleeveLen,sleeve));
    out.push(rect(8,16+sleeveLen-1,2,1,sleeveD));
    out.push(rect(22,16+sleeveLen-1,2,1,sleeveD));
    if (cuff){
      out.push(rect(7,16+sleeveLen,3,1,cuff));
      out.push(rect(22,16+sleeveLen,3,1,cuff));
    }
    // forearm+hand (skin or armored)
    const handY = 17+sleeveLen;
    out.push(rect(8,handY,2,3,skin));
    out.push(rect(22,handY,2,3,skin));
    out.push(rect(8,handY+2,2,1,skinS));
    out.push(rect(22,handY+2,2,1,skinS));
    return group(out);
  }

  function legs(pants, pantsD, bootColor, bootD){
    const out = [];
    // pants
    out.push(rect(11,30,4,6,pants));
    out.push(rect(17,30,4,6,pants));
    out.push(rect(11,36,4,1,pantsD));
    out.push(rect(17,36,4,1,pantsD));
    // separation
    out.push(rect(15,30,2,6,pantsD));
    // boots
    out.push(rect(10,37,5,4,bootColor));
    out.push(rect(17,37,5,4,bootColor));
    out.push(rect(10,40,5,1,bootD));
    out.push(rect(17,40,5,1,bootD));
    // ground
    out.push(rect(9,41,6,1,B.outline));
    out.push(rect(17,41,6,1,B.outline));
    return group(out);
  }

  function belt(color, buckle){
    const out = [];
    out.push(rect(10,29,12,1,color));
    if (buckle) out.push(rect(15,29,2,1,buckle));
    return group(out);
  }

  function shoulderPads(color, colorD, spike=false){
    const out = [];
    out.push(rect(7,14,3,3,color));
    out.push(rect(22,14,3,3,color));
    out.push(rect(7,16,3,1,colorD));
    out.push(rect(22,16,3,1,colorD));
    if (spike) {
      out.push(rect(7,12,1,2,B.outline));
      out.push(rect(9,12,1,2,B.outline));
      out.push(rect(22,12,1,2,B.outline));
      out.push(rect(24,12,1,2,B.outline));
    }
    return group(out);
  }

  // ── Weapons ──────────────────────────────
  function swordShort(side='left', colorBlade='#d0d6e0', colorHilt='#8b5a3c'){
    const out = [];
    const x = side === 'left' ? 4 : 26;
    // blade
    out.push(rect(x,18,2,10,colorBlade));
    out.push(rect(x+1,18,1,10,'#f4f6fa'));
    // guard
    out.push(rect(x-1,28,4,1,'#ffd86a'));
    // hilt
    out.push(rect(x,29,2,3,colorHilt));
    // pommel
    out.push(rect(x,32,2,1,'#ffd86a'));
    return group(out);
  }
  function swordBig(color='#d0d6e0', glow=null){
    const out = [];
    // blade tall
    out.push(rect(3,15,2,15,color));
    if (glow) {
      out.push(rect(2,15,1,15,glow));
      out.push(rect(5,15,1,15,glow));
    }
    out.push(rect(4,15,1,15,'#ffffff'));
    out.push(rect(3,14,2,1,'#ffd86a'));
    // guard
    out.push(rect(1,30,6,1,'#ffd86a'));
    out.push(rect(2,31,4,1,'#b88a1a'));
    // hilt
    out.push(rect(3,32,2,3,'#5a3a22'));
    out.push(rect(3,35,2,1,'#ffd86a'));
    return group(out);
  }
  function shield(color='#7a2a2a', trim='#ffd86a', emblem=null){
    const out = [];
    // on left arm
    out.push(rect(4,18,5,10,color));
    out.push(rect(3,19,1,8,color));
    out.push(rect(9,19,1,8,color));
    // trim
    out.push(rect(4,18,5,1,trim));
    out.push(rect(4,27,5,1,trim));
    // emblem (simple cross)
    if (emblem === 'cross') {
      out.push(rect(6,20,1,6,trim));
      out.push(rect(4,22,5,1,trim));
    } else if (emblem === 'lion') {
      out.push(rect(5,21,3,4,'#ffd86a'));
      out.push(rect(6,20,1,1,'#ffd86a'));
    } else if (emblem === 'sun') {
      out.push(rect(6,22,1,2,trim));
      out.push(rect(5,23,3,1,trim));
      out.push(rect(5,21,1,1,trim));
      out.push(rect(7,21,1,1,trim));
      out.push(rect(5,25,1,1,trim));
      out.push(rect(7,25,1,1,trim));
    } else if (emblem === 'wing') {
      out.push(rect(4,22,5,1,'#f4efe7'));
      out.push(rect(5,21,3,1,'#f4efe7'));
      out.push(rect(5,23,3,1,'#f4efe7'));
    }
    return group(out);
  }
  function staff(color='#6b3d1f', orbColor='#6fd4ff', orbColorL='#d4f4ff'){
    const out = [];
    // staff shaft
    out.push(rect(26,16,1,18,color));
    out.push(rect(27,16,1,18,'#3a2010'));
    // orb
    out.push(rect(25,13,3,3,orbColor));
    out.push(rect(24,14,1,2,orbColor));
    out.push(rect(28,14,1,2,orbColor));
    out.push(rect(26,14,1,1,orbColorL));
    return group(out);
  }
  function bow(color='#6b3d1f', stringColor='#f4efe7'){
    const out = [];
    // bow shape (on left side)
    out.push(rect(4,14,1,1,color));
    out.push(rect(3,15,1,3,color));
    out.push(rect(2,18,1,8,color));
    out.push(rect(3,26,1,3,color));
    out.push(rect(4,29,1,1,color));
    // string
    out.push(rect(5,15,1,14,stringColor));
    // grip
    out.push(rect(3,20,2,4,'#3a2010'));
    return group(out);
  }
  function hammer(headColor='#d0d6e0', handleColor='#8b5a3c', glow=null){
    const out = [];
    // handle
    out.push(rect(25,16,2,16,handleColor));
    out.push(rect(26,16,1,16,'#5a3a22'));
    // head (cross-shaped)
    out.push(rect(23,14,6,4,headColor));
    out.push(rect(23,17,6,1,'#8a99b0'));
    if (glow) out.push(rect(22,14,1,4,glow));
    return group(out);
  }
  function daggerBelt(){
    const out = [];
    out.push(rect(20,29,1,4,'#d0d6e0'));
    out.push(rect(19,32,3,1,'#ffd86a'));
    out.push(rect(20,33,1,2,'#5a3a22'));
    return group(out);
  }
  function quiver(){
    const out = [];
    // on back
    out.push(rect(20,14,3,8,'#5a3a22'));
    out.push(rect(23,14,1,8,'#3a2010'));
    // arrows sticking out
    out.push(rect(20,12,1,3,'#f4efe7'));
    out.push(rect(21,11,1,3,'#f4efe7'));
    out.push(rect(22,12,1,3,'#f4efe7'));
    out.push(rect(20,11,3,1,'#e63946'));
    return group(out);
  }

  // ── Aura / FX overlays ─────────────────
  function auraRadial(color, intensity=1){
    return `<circle cx="16" cy="24" r="20" fill="url(#auraG-${color.replace('#','')})"/>`;
  }
  function gradientDef(id, color){
    return `<radialGradient id="${id}"><stop offset="0%" stop-color="${color}" stop-opacity="0.6"/><stop offset="60%" stop-color="${color}" stop-opacity="0.15"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
  }
  function halo(color){
    return `<circle cx="16" cy="7" r="8" fill="none" stroke="${color}" stroke-width="0.7" opacity="0.9"/>` +
           `<circle cx="16" cy="7" r="7" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.6"/>`;
  }
  function wings(color='#fff6c2', count=2){
    const out = [];
    for (let i = 0; i < count; i++){
      const off = i * 1.5;
      // left wing
      out.push(`<path d="M 8 15 Q ${1-off} ${17-off} ${3-off} 26 Q 7 22 9 22 Z" fill="${color}" opacity="${1 - i*0.2}"/>`);
      // right wing
      out.push(`<path d="M 24 15 Q ${31+off} ${17-off} ${29+off} 26 Q 25 22 23 22 Z" fill="${color}" opacity="${1 - i*0.2}"/>`);
    }
    return group(out);
  }

  // ── Orbiting orbs / runes (static pixel dots for print-style) ─
  function orbs(color, positions){
    return positions.map(([x,y])=>
      rect(x,y,1,1,color) +
      rect(x-1,y,1,1,color+'aa') +
      rect(x+1,y,1,1,color+'aa') +
      rect(x,y-1,1,1,color+'aa') +
      rect(x,y+1,1,1,color+'aa')
    ).join('');
  }
  function flamesFeet(){
    const out = [];
    out.push(rect(9,40,1,1,'#ffb84a'));
    out.push(rect(11,41,1,1,'#e63946'));
    out.push(rect(13,40,1,1,'#ffb84a'));
    out.push(rect(19,40,1,1,'#ffb84a'));
    out.push(rect(21,41,1,1,'#e63946'));
    out.push(rect(23,40,1,1,'#ffb84a'));
    return group(out);
  }

  // Flame sword (glowing blade)
  function flameBlade(){
    return `<rect x="3" y="15" width="2" height="15" fill="#e63946" shape-rendering="crispEdges"/>` +
           `<rect x="2" y="15" width="1" height="15" fill="#ff8a3d" shape-rendering="crispEdges"/>` +
           `<rect x="5" y="15" width="1" height="15" fill="#ffd86a" shape-rendering="crispEdges"/>` +
           `<rect x="3" y="14" width="2" height="1" fill="#ffd86a" shape-rendering="crispEdges"/>`;
  }

  // ── SPRITE DEFINITIONS ─────────────────────────
  // Each sprite: { id, name, level, classKey, body(), fx() }
  // Renderer composes: defs + fx (behind) + body parts + fx (front)

  const SPRITES = {};

  // ============================================
  // FASE 1 — PRÉ-CLASSE
  // ============================================
  SPRITES.avatar_1 = { name:'Novato', level:'1–3', tier:'BASE',
    build:()=>{
      const o = [];
      o.push(head());
      // simple tunic green
      const tunic='#6b8a4a', tunicD='#4e6636';
      o.push(rect(10,14,12,14,tunic));
      o.push(rect(10,14,1,14,tunicD));
      o.push(rect(21,14,1,14,tunicD));
      o.push(rect(10,27,12,1,tunicD));
      // neck
      o.push(rect(14,13,4,1,B.skinS));
      // sleeves
      o.push(arms(B.skin,B.skinS,tunic,tunicD,3));
      // belt
      o.push(belt('#8b5a3c','#d4a42a'));
      // pants + boots
      o.push(legs('#8b5a3c','#5a3a22','#3a2515','#241610'));
      return o.join('');
    }
  };

  SPRITES.avatar_4 = { name:'Explorador', level:'4–6', tier:'BASE',
    build:()=>{
      const o = [];
      o.push(head());
      // light leather
      const lea='#8b5a3c', leaD='#5a3a22';
      o.push(cape('#c9b078','#8a7048'));
      o.push(rect(10,14,12,14,lea));
      o.push(rect(10,14,1,14,leaD));
      o.push(rect(21,14,1,14,leaD));
      o.push(rect(11,17,10,1,leaD));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,lea,leaD,3));
      // belt with pouches
      o.push(belt('#3a2010','#d4a42a'));
      o.push(rect(12,30,2,2,'#5a3a22'));
      o.push(rect(18,30,2,2,'#5a3a22'));
      // dagger on belt
      o.push(daggerBelt());
      o.push(legs('#5a4028','#3a2818','#3a2515','#241610'));
      return o.join('');
    }
  };

  SPRITES.avatar_7 = { name:'Batalhador', level:'7–9', tier:'BASE',
    build:()=>{
      const o = [];
      // sword on back
      o.push(rect(14,3,2,12,'#c9ccd4'));
      o.push(rect(15,3,1,12,'#f4f6fa'));
      o.push(rect(13,2,4,1,'#ffd86a'));

      o.push(head());
      o.push(cape('#a02828','#6b1818'));
      // reinforced leather
      const lea='#6b4025', leaD='#3a2010';
      o.push(rect(10,14,12,14,lea));
      o.push(rect(10,14,1,14,leaD));
      o.push(rect(21,14,1,14,leaD));
      // metal shoulder pads
      o.push(shoulderPads('#9aa0b0','#5a6070'));
      // chest plate detail
      o.push(rect(12,17,8,1,leaD));
      o.push(rect(12,22,8,1,leaD));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,lea,leaD,3));
      o.push(belt('#3a2010','#d4a42a'));
      o.push(legs('#5a4028','#3a2818','#2a1a0a','#140a02'));
      return o.join('');
    }
  };

  SPRITES.avatar_10 = { name:'Desbravador', level:'10–14', tier:'BASE',
    build:()=>{
      const o = [];
      o.push(head());
      o.push(cape('#3556a8','#1e3478'));
      // chain mail
      const mail='#6878a0', mailD='#3e4a6e';
      o.push(rect(10,14,12,14,mail));
      // chain texture
      for (let y=15;y<28;y+=2){
        for (let x=11;x<22;x+=2){
          o.push(rect(x,y,1,1,mailD));
        }
      }
      o.push(rect(10,14,1,14,mailD));
      o.push(rect(21,14,1,14,mailD));
      o.push(rect(14,13,4,1,B.skinS));
      // blue trim
      o.push(rect(11,14,10,1,'#4e7ac7'));
      o.push(rect(14,17,4,1,'#4e7ac7'));
      o.push(arms(B.skin,B.skinS,mail,mailD,4,'#4e7ac7'));
      // small shield left
      o.push(shield('#2a4a8a','#8ba4d4','cross'));
      // sword right (in hand)
      o.push(rect(24,18,2,10,'#d0d6e0'));
      o.push(rect(25,18,1,10,'#f4f6fa'));
      o.push(rect(23,28,4,1,'#ffd86a'));
      o.push(rect(24,29,2,3,'#5a3a22'));
      o.push(belt('#3a2010','#d4a42a'));
      o.push(legs('#3e4a6e','#28324a','#2a1a0a','#140a02'));
      return o.join('');
    }
  };

  SPRITES.avatar_15 = { name:'Cavaleiro', level:'15–29', tier:'BASE',
    build:()=>{
      const o = [];
      o.push(head({variant:'helm', helmColor:'#d0d6e0', helmColorD:'#8a97b0', helmTrim:'#ffd86a'}));
      o.push(cape('#7a3aa8','#4e1a74'));
      // plate armor
      const plate='#d0d6e0', plateD='#8a97b0';
      o.push(rect(10,14,12,14,plate));
      o.push(rect(10,14,1,14,plateD));
      o.push(rect(21,14,1,14,plateD));
      // plate segments
      o.push(rect(10,18,12,1,plateD));
      o.push(rect(10,23,12,1,plateD));
      // golden trim
      o.push(rect(11,14,10,1,'#ffd86a'));
      o.push(rect(15,17,2,1,'#ffd86a'));
      o.push(rect(13,19,6,1,'#b88a1a'));
      // shoulders
      o.push(shoulderPads(plate,plateD));
      o.push(rect(7,14,3,1,'#ffd86a'));
      o.push(rect(22,14,3,1,'#ffd86a'));
      o.push(arms(B.skin,B.skinS,plate,plateD,4));
      // long sword right
      o.push(rect(24,12,2,18,'#d0d6e0'));
      o.push(rect(25,12,1,18,'#f4f6fa'));
      o.push(rect(23,30,4,1,'#ffd86a'));
      o.push(rect(24,31,2,3,'#5a3a22'));
      o.push(belt('#3a2010','#ffd86a'));
      o.push(legs('#8a97b0','#5a6878','#2a1a0a','#140a02'));
      return o.join('');
    }
  };

  // ============================================
  // GUERREIRO — red/black/gold
  // ============================================
  SPRITES.guerreiro_30 = { name:'Guerreiro', level:'30–49', tier:'T1', classKey:'guerreiro',
    build:()=>{
      const o = [];
      o.push(head());
      o.push(cape('#a02020','#6b1414'));
      const r1='#8a1a1a', r1D='#4e0a0a';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      o.push(rect(10,18,12,1,r1D));
      o.push(rect(10,23,12,1,r1D));
      o.push(rect(11,14,10,1,'#ffd86a'));
      o.push(shoulderPads('#4a0a0a','#2a0404',true));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      // big sword right
      o.push(swordBig('#d0d6e0'));
      // shield (lion emblem) left replaced by sword? put shield on left
      o.push(shield('#7a2a2a','#ffd86a','lion'));
      o.push(belt('#2a0a0a','#ffd86a'));
      o.push(legs('#4a0a0a','#2a0404','#1a0202','#000'));
      return o.join('');
    }
  };

  SPRITES.guerreiro_50 = { name:'Guerreiro', level:'50–69', tier:'T2', classKey:'guerreiro',
    build:()=>{
      const o = [];
      o.push(head());
      // scar
      o.push(rect(17,9,1,3,'#a03030'));
      o.push(cape('#6b0a0a','#3a0404'));
      const r1='#5a0a0a', r1D='#2a0202';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      o.push(rect(10,18,12,1,'#1a0000'));
      o.push(rect(10,23,12,1,'#1a0000'));
      // black accents
      o.push(rect(13,19,6,3,'#0a0000'));
      o.push(rect(15,20,2,1,'#ffd86a'));
      // spiked shoulders
      o.push(shoulderPads('#1a0000','#000',true));
      o.push(rect(6,11,1,3,'#000'));
      o.push(rect(8,11,1,3,'#000'));
      o.push(rect(23,11,1,3,'#000'));
      o.push(rect(25,11,1,3,'#000'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      // flaming sword
      o.push(flameBlade());
      // bigger shield
      o.push(shield('#3a0a0a','#ffd86a','lion'));
      o.push(rect(4,17,5,1,'#ffd86a'));
      o.push(rect(4,28,5,1,'#ffd86a'));
      o.push(belt('#1a0000','#ffd86a'));
      o.push(legs('#1a0000','#000','#000','#000'));
      return o.join('');
    }
  };

  SPRITES.guerreiro_70 = { name:'Guerreiro', level:'70–89', tier:'T3', classKey:'guerreiro',
    build:()=>{
      const o = [];
      o.push(head());
      o.push(rect(17,9,1,3,'#a03030'));
      o.push(cape('#4a0000','#1a0000',true));
      const r1='#0a0000', r1D='#050000';
      o.push(rect(10,14,12,14,r1));
      // glowing red runes
      o.push(rect(14,17,1,1,'#e63946'));
      o.push(rect(17,19,1,1,'#ff8080'));
      o.push(rect(13,21,1,1,'#e63946'));
      o.push(rect(18,22,1,1,'#ff8080'));
      o.push(rect(15,24,1,1,'#e63946'));
      o.push(shoulderPads('#1a0000','#000',true));
      o.push(rect(6,10,1,4,'#e63946'));
      o.push(rect(25,10,1,4,'#e63946'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4,'#e63946'));
      // two-handed sword
      o.push(swordBig('#c9ccd4','#e63946'));
      o.push(belt('#000','#e63946'));
      o.push(legs('#0a0000','#000','#000','#000'));
      // fire at feet
      o.push(flamesFeet());
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="42" r="10" fill="url(#auraFire)" opacity="0.7"/>`
  };

  SPRITES.guerreiro_90 = { name:'Guerreiro', level:'90–99', tier:'T4', classKey:'guerreiro',
    build:()=>{
      const o = [];
      o.push(head());
      o.push(rect(17,9,1,3,'#a03030'));
      o.push(rect(12,9,1,2,'#a03030'));
      o.push(rect(14,11,2,1,'#a03030'));
      // tattered cape
      o.push(rect(7,15,2,16,'#6b0a0a'));
      o.push(rect(23,15,2,16,'#6b0a0a'));
      o.push(rect(6,17,1,14,'#3a0404'));
      o.push(rect(25,17,1,14,'#3a0404'));
      o.push(rect(7,31,1,2,'#6b0a0a'));
      o.push(rect(9,31,1,1,'#6b0a0a'));
      o.push(rect(23,31,1,2,'#6b0a0a'));
      o.push(rect(25,31,1,1,'#6b0a0a'));
      // crimson + gold legendary
      const r1='#b8181a', r1D='#5a0a0a';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,'#5a0a0a'));
      o.push(rect(21,14,1,14,'#5a0a0a'));
      // gold inlays
      o.push(rect(11,14,10,1,'#ffd86a'));
      o.push(rect(10,18,12,1,'#ffd86a'));
      o.push(rect(10,23,12,1,'#ffd86a'));
      o.push(rect(14,17,4,1,'#ffd86a'));
      o.push(rect(15,20,2,2,'#ffd86a'));
      o.push(rect(13,25,6,1,'#ffd86a'));
      o.push(shoulderPads('#ffd86a','#b88a1a',true));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4,'#ffd86a'));
      // epic energy sword
      o.push(rect(3,12,2,18,'#e63946'));
      o.push(rect(2,12,1,18,'#ff8a3d'));
      o.push(rect(5,12,1,18,'#ffd86a'));
      o.push(rect(3,11,2,1,'#ffd86a'));
      o.push(rect(1,30,6,1,'#ffd86a'));
      o.push(rect(3,31,2,4,'#2a0000'));
      o.push(belt('#5a0a0a','#ffd86a'));
      o.push(legs('#5a0a0a','#2a0000','#000','#000'));
      o.push(flamesFeet());
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="24" r="22" fill="url(#auraFire)" opacity="0.5"/>`
  };

  SPRITES.guerreiro_100 = { name:'Guerreiro', level:'100', tier:'MAX', classKey:'guerreiro',
    build:()=>{
      const o = [];
      o.push(head({glowEyes:true, eyeGlow:'#ffb84a', eyeGlowL:'#ffe08a'}));
      o.push(rect(17,9,1,3,'#a03030'));
      // divine gold/red armor
      const r1='#ffd86a', r1D='#b88a1a', rA='#e63946';
      o.push(cape('#e63946','#8a1a1a',true));
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      o.push(rect(10,18,12,1,rA));
      o.push(rect(10,23,12,1,rA));
      o.push(rect(14,17,4,1,rA));
      o.push(rect(15,20,2,3,rA));
      o.push(rect(13,25,6,1,rA));
      o.push(shoulderPads(rA,'#8a1a1a',true));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4,rA));
      // celestial sword
      o.push(rect(3,10,2,20,'#ffd86a'));
      o.push(rect(2,10,1,20,'#ff8a3d'));
      o.push(rect(5,10,1,20,'#ffffff'));
      o.push(rect(3,9,2,1,'#ffffff'));
      o.push(rect(1,30,6,1,'#e63946'));
      o.push(rect(3,31,2,4,'#8a1a1a'));
      o.push(belt(r1D,'#ffffff'));
      o.push(legs(rA,'#8a1a1a','#5a0a0a','#2a0000'));
      // flames at feet — bigger
      for (let i=0;i<8;i++){
        o.push(rect(8+i*2,40-i%2,1,2,i%2?'#ffd86a':'#e63946'));
      }
      // small fire wings
      o.push(`<path d="M 6 18 Q 0 20 2 28 Q 6 24 8 24 Z" fill="#e63946" opacity="0.85"/>`);
      o.push(`<path d="M 26 18 Q 32 20 30 28 Q 26 24 24 24 Z" fill="#e63946" opacity="0.85"/>`);
      o.push(`<path d="M 7 19 Q 3 22 4 27 Q 7 24 9 24 Z" fill="#ffd86a" opacity="0.9"/>`);
      o.push(`<path d="M 25 19 Q 29 22 28 27 Q 25 24 23 24 Z" fill="#ffd86a" opacity="0.9"/>`);
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="7" r="9" fill="none" stroke="#ffd86a" stroke-width="1" opacity="0.95"/><circle cx="16" cy="24" r="26" fill="url(#auraFire)" opacity="0.6"/>`
  };

  // ============================================
  // MAGO — purple/cyan/white
  // ============================================
  SPRITES.mago_30 = { name:'Mago', level:'30–49', tier:'T1', classKey:'mago',
    build:()=>{
      const o = [];
      o.push(head({variant:'wizHat', hatColor:'#4a2074', hatColorD:'#2a0f54', hatStar:'#ffd86a', beard:'short', beardColor:'#5a3418'}));
      // robe purple
      const r1='#5a2b8a', r1D='#2a0f54';
      o.push(rect(9,14,14,22,r1));
      o.push(rect(9,14,1,22,r1D));
      o.push(rect(22,14,1,22,r1D));
      // stars embroidered
      o.push(rect(12,17,1,1,'#ffd86a'));
      o.push(rect(18,19,1,1,'#ffd86a'));
      o.push(rect(14,22,1,1,'#ffd86a'));
      o.push(rect(20,25,1,1,'#ffd86a'));
      o.push(rect(11,28,1,1,'#ffd86a'));
      // hem
      o.push(rect(9,35,14,1,'#ffd86a'));
      o.push(rect(14,13,4,1,B.skinS));
      // sleeves
      o.push(rect(8,16,2,10,r1));
      o.push(rect(22,16,2,10,r1));
      o.push(rect(8,25,2,1,r1D));
      o.push(rect(22,25,2,1,r1D));
      // hands
      o.push(rect(8,26,2,3,B.skin));
      o.push(rect(22,26,2,3,B.skin));
      // staff right
      o.push(staff('#6b3d1f','#6fd4ff','#d4f4ff'));
      // feet (barely visible below robe)
      o.push(rect(11,40,3,2,'#3a2515'));
      o.push(rect(18,40,3,2,'#3a2515'));
      return o.join('');
    }
  };

  SPRITES.mago_50 = { name:'Mago', level:'50–69', tier:'T2', classKey:'mago',
    build:()=>{
      const o = [];
      o.push(head({variant:'wizHat', hatColor:'#3a1a5a', hatColorD:'#1f0a3a', hatStar:'#6fd4ff', beard:'med', beardColor:'#5a3418'}));
      const r1='#3a1a5a', r1D='#1a0830';
      o.push(rect(9,14,14,22,r1));
      o.push(rect(9,14,1,22,r1D));
      o.push(rect(22,14,1,22,r1D));
      // rune border
      for (let x=10;x<22;x+=2) o.push(rect(x,34,1,1,'#6fd4ff'));
      o.push(rect(9,35,14,1,'#6fd4ff'));
      // glowing runes on chest
      o.push(rect(13,18,1,1,'#6fd4ff'));
      o.push(rect(18,18,1,1,'#6fd4ff'));
      o.push(rect(15,22,2,1,'#6fd4ff'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(rect(8,16,2,10,r1));
      o.push(rect(22,16,2,10,r1));
      o.push(rect(8,26,2,3,B.skin));
      o.push(rect(22,26,2,3,B.skin));
      // larger staff with bigger orb
      o.push(rect(26,16,1,18,'#6b3d1f'));
      o.push(rect(27,16,1,18,'#3a2010'));
      o.push(rect(24,12,5,4,'#6fd4ff'));
      o.push(rect(23,13,1,2,'#6fd4ff'));
      o.push(rect(29,13,1,2,'#6fd4ff'));
      o.push(rect(25,13,1,1,'#d4f4ff'));
      o.push(rect(26,13,1,1,'#ffffff'));
      // floating book (left)
      o.push(rect(2,20,5,4,'#8b5a3c'));
      o.push(rect(2,20,5,1,'#5a3a22'));
      o.push(rect(3,21,3,2,'#f4efe7'));
      o.push(rect(11,40,3,2,'#3a2515'));
      o.push(rect(18,40,3,2,'#3a2515'));
      return o.join('');
    }
  };

  SPRITES.mago_70 = { name:'Mago', level:'70–89', tier:'T3', classKey:'mago',
    build:()=>{
      const o = [];
      o.push(head({variant:'wizHat', hatColor:'#1a0030', hatColorD:'#000', hatStar:'#6fd4ff', beard:'long', beardColor:'#e8e8e8', beardColorD:'#c0c0c0'}));
      const r1='#0a0020', r1D='#000';
      o.push(rect(9,14,14,22,r1));
      // cyan energy borders
      o.push(rect(9,14,1,22,'#6fd4ff'));
      o.push(rect(22,14,1,22,'#6fd4ff'));
      o.push(rect(9,35,14,1,'#6fd4ff'));
      o.push(rect(9,14,14,1,'#6fd4ff'));
      // runes scattered
      o.push(rect(13,20,1,1,'#6fd4ff'));
      o.push(rect(18,22,1,1,'#6fd4ff'));
      o.push(rect(15,26,1,1,'#6fd4ff'));
      o.push(rect(19,28,1,1,'#d4f4ff'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(rect(8,16,2,10,r1));
      o.push(rect(22,16,2,10,r1));
      o.push(rect(8,16,1,10,'#6fd4ff'));
      o.push(rect(23,16,1,10,'#6fd4ff'));
      o.push(rect(8,26,2,3,B.skin));
      o.push(rect(22,26,2,3,B.skin));
      // crystal staff
      o.push(rect(26,14,1,20,'#d4f4ff'));
      o.push(rect(27,14,1,20,'#6fd4ff'));
      o.push(rect(24,10,5,4,'#d4f4ff'));
      o.push(rect(23,11,1,2,'#d4f4ff'));
      o.push(rect(29,11,1,2,'#d4f4ff'));
      o.push(rect(25,11,2,2,'#ffffff'));
      // orbiting orbs
      o.push(orbs('#6fd4ff',[[2,18],[5,30],[30,22],[4,10]]));
      o.push(rect(11,40,3,2,'#3a2515'));
      o.push(rect(18,40,3,2,'#3a2515'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="24" r="22" fill="url(#auraMagic)" opacity="0.55"/>`
  };

  SPRITES.mago_90 = { name:'Mago', level:'90–99', tier:'T4', classKey:'mago',
    build:()=>{
      const o = [];
      o.push(head({variant:'wizHat', hatColor:'#0a0030', hatColorD:'#000', hatStar:'#ffffff', beard:'long', beardColor:'#ffffff', beardColorD:'#c0c0c0', glowEyes:true, eyeGlow:'#6fd4ff', eyeGlowL:'#ffffff'}));
      // cosmic robe — stars pattern
      const r1='#1a0050', r1D='#0a0030';
      o.push(rect(9,14,14,22,r1));
      o.push(rect(9,14,1,22,r1D));
      o.push(rect(22,14,1,22,r1D));
      // nebula spots
      for (let i=0;i<20;i++){
        const rx = 10 + (i*7)%12;
        const ry = 15 + (i*5)%20;
        const col = i%3===0 ? '#ffffff' : i%3===1 ? '#a855f7' : '#6fd4ff';
        o.push(rect(rx,ry,1,1,col));
      }
      // galaxy swirl
      o.push(rect(14,23,4,1,'#a855f7'));
      o.push(rect(15,22,2,1,'#d4f4ff'));
      o.push(rect(15,24,2,1,'#d4f4ff'));
      o.push(rect(9,35,14,1,'#ffffff'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(rect(8,16,2,10,r1));
      o.push(rect(22,16,2,10,r1));
      o.push(rect(8,26,2,3,B.skin));
      o.push(rect(22,26,2,3,B.skin));
      // pulsing staff
      o.push(rect(26,12,1,22,'#6fd4ff'));
      o.push(rect(27,12,1,22,'#a855f7'));
      o.push(rect(23,8,7,5,'#a855f7'));
      o.push(rect(24,9,5,3,'#d4f4ff'));
      o.push(rect(25,10,3,1,'#ffffff'));
      // orbiting runes (pixel stars)
      o.push(orbs('#ffffff',[[2,14],[30,16],[1,26],[31,28],[4,34]]));
      o.push(rect(11,40,3,2,'#3a2515'));
      o.push(rect(18,40,3,2,'#3a2515'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="24" r="26" fill="url(#auraMagic)" opacity="0.6"/><circle cx="16" cy="24" r="14" fill="none" stroke="#6fd4ff" stroke-width="0.3" opacity="0.6" stroke-dasharray="1 1"/>`
  };

  SPRITES.mago_100 = { name:'Mago', level:'100', tier:'MAX', classKey:'mago',
    build:()=>{
      const o = [];
      o.push(head({variant:'wizHat', hatColor:'#d4f4ff', hatColorD:'#a8c4ff', hatStar:'#ffffff', beard:'long', beardColor:'#ffffff', beardColorD:'#d4f4ff', glowEyes:true, eyeGlow:'#a855f7', eyeGlowL:'#ffffff'}));
      // body of light
      const r1='#d4e4ff', r1D='#a8b4ff';
      o.push(`<g opacity="0.75">`);
      o.push(rect(9,14,14,22,r1));
      o.push(rect(9,14,1,22,r1D));
      o.push(rect(22,14,1,22,r1D));
      o.push(rect(8,16,2,10,r1));
      o.push(rect(22,16,2,10,r1));
      o.push(rect(8,26,2,3,r1));
      o.push(rect(22,26,2,3,r1));
      o.push(`</g>`);
      // galactic markings
      for (let i=0;i<12;i++){
        o.push(rect(10+(i*3)%12, 15+(i*4)%20, 1,1, i%2?'#a855f7':'#6fd4ff'));
      }
      // cosmic staff
      o.push(rect(26,10,1,24,'#ffffff'));
      o.push(rect(27,10,1,24,'#6fd4ff'));
      o.push(rect(23,6,7,6,'#ffffff'));
      o.push(rect(24,7,5,4,'#a855f7'));
      o.push(rect(25,8,3,2,'#6fd4ff'));
      // constellations orbiting — little plus signs
      const constellations = [[3,12],[1,22],[29,14],[30,26],[4,32],[1,5]];
      constellations.forEach(([x,y])=>{
        o.push(rect(x,y,1,1,'#ffffff'));
        o.push(rect(x-1,y,1,1,'#ffffff'));
        o.push(rect(x+1,y,1,1,'#ffffff'));
        o.push(rect(x,y-1,1,1,'#ffffff'));
        o.push(rect(x,y+1,1,1,'#ffffff'));
      });
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="24" r="30" fill="url(#auraMagic)" opacity="0.75"/><circle cx="16" cy="24" r="18" fill="none" stroke="#ffffff" stroke-width="0.4" opacity="0.7" stroke-dasharray="1 2"/><circle cx="16" cy="24" r="22" fill="none" stroke="#a855f7" stroke-width="0.3" opacity="0.5" stroke-dasharray="0.5 2"/>`
  };

  // ============================================
  // MONGE — orange/gold/white
  // ============================================
  SPRITES.monge_30 = { name:'Monge', level:'30–49', tier:'T1', classKey:'monge',
    build:()=>{
      const o = [];
      o.push(head({variant:'shaved'}));
      const r1='#e07a2a', r1D='#8a4a10';
      o.push(rect(10,14,12,16,r1));
      o.push(rect(10,14,1,16,r1D));
      o.push(rect(21,14,1,16,r1D));
      // shoulder drape (one side bare)
      o.push(rect(15,14,7,1,r1D));
      o.push(rect(10,15,5,1,B.skin));
      o.push(rect(14,13,4,1,B.skinS));
      // right shoulder bare skin
      o.push(rect(7,15,3,6,B.skin));
      o.push(rect(7,20,3,1,B.skinS));
      // left arm in robe
      o.push(rect(22,16,2,7,r1));
      o.push(rect(22,22,2,1,r1D));
      // hands (wrapped wrists)
      o.push(rect(7,21,3,2,'#e8e0c0'));
      o.push(rect(22,23,2,2,'#e8e0c0'));
      o.push(rect(7,23,3,3,B.skin));
      o.push(rect(22,25,2,3,B.skin));
      // belt (cloth)
      o.push(rect(10,28,12,2,'#8a4a10'));
      // legs — pants
      o.push(rect(11,30,4,8,r1));
      o.push(rect(17,30,4,8,r1));
      o.push(rect(15,30,2,8,r1D));
      // sandals
      o.push(rect(10,38,5,2,B.skin));
      o.push(rect(17,38,5,2,B.skin));
      o.push(rect(10,40,5,1,'#3a2515'));
      o.push(rect(17,40,5,1,'#3a2515'));
      o.push(rect(12,38,1,2,'#3a2515'));
      o.push(rect(19,38,1,2,'#3a2515'));
      return o.join('');
    }
  };

  SPRITES.monge_50 = { name:'Monge', level:'50–69', tier:'T2', classKey:'monge',
    build:()=>{
      const o = [];
      o.push(head({variant:'shaved'}));
      const r1='#e8952a', r1D='#a05010';
      o.push(rect(10,14,12,16,r1));
      o.push(rect(10,14,1,16,r1D));
      o.push(rect(21,14,1,16,r1D));
      o.push(rect(15,14,7,1,'#ffd86a'));
      o.push(rect(10,15,5,1,B.skin));
      // muscle definition on shoulder
      o.push(rect(7,15,3,7,B.skin));
      o.push(rect(7,18,3,1,B.skinS));
      o.push(rect(9,15,1,7,B.skinS));
      // mala beads around neck
      o.push(rect(12,13,8,1,'#8b5a3c'));
      o.push(rect(13,13,1,1,'#c9b078'));
      o.push(rect(15,13,1,1,'#c9b078'));
      o.push(rect(17,13,1,1,'#c9b078'));
      o.push(rect(19,13,1,1,'#c9b078'));
      // golden belt
      o.push(rect(10,28,12,2,'#ffd86a'));
      o.push(rect(10,30,12,1,'#b88a1a'));
      // arm wrappings
      o.push(rect(6,16,4,8,'#e8e0c0'));
      o.push(rect(22,16,4,8,'#e8e0c0'));
      o.push(rect(6,23,4,1,'#b8a478'));
      o.push(rect(22,23,4,1,'#b8a478'));
      o.push(rect(7,25,3,3,B.skin));
      o.push(rect(22,25,3,3,B.skin));
      o.push(rect(11,31,4,7,r1));
      o.push(rect(17,31,4,7,r1));
      o.push(rect(15,31,2,7,r1D));
      o.push(rect(10,38,5,2,B.skin));
      o.push(rect(17,38,5,2,B.skin));
      o.push(rect(10,40,5,1,'#3a2515'));
      o.push(rect(17,40,5,1,'#3a2515'));
      return o.join('');
    }
  };

  SPRITES.monge_70 = { name:'Monge', level:'70–89', tier:'T3', classKey:'monge',
    build:()=>{
      const o = [];
      o.push(head({variant:'shaved'}));
      const r1='#f4efe7', r1D='#c9c0a8';
      o.push(rect(10,14,12,16,r1));
      o.push(rect(10,14,1,16,r1D));
      o.push(rect(21,14,1,16,r1D));
      o.push(rect(15,14,7,1,'#ffd86a'));
      o.push(rect(10,15,5,1,B.skin));
      // gold border on robe
      o.push(rect(11,14,10,1,'#ffd86a'));
      o.push(rect(10,29,12,1,'#ffd86a'));
      // gold chi marks on chest
      o.push(rect(15,20,2,1,'#ffd86a'));
      o.push(rect(15,22,2,1,'#ffd86a'));
      // bare arms with gold chi glow on hands
      o.push(rect(7,15,3,10,B.skin));
      o.push(rect(22,15,3,10,B.skin));
      o.push(rect(9,20,1,5,B.skinS));
      o.push(rect(7,25,3,3,'#ffd86a'));
      o.push(rect(22,25,3,3,'#ffd86a'));
      // belt golden
      o.push(rect(10,28,12,2,'#ffd86a'));
      o.push(rect(10,30,12,1,'#b88a1a'));
      // pants
      o.push(rect(11,30,4,8,r1));
      o.push(rect(17,30,4,8,r1));
      o.push(rect(15,30,2,8,r1D));
      // barefoot
      o.push(rect(10,38,5,3,B.skin));
      o.push(rect(17,38,5,3,B.skin));
      o.push(rect(10,41,5,1,B.skinS));
      o.push(rect(17,41,5,1,B.skinS));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="7" r="8" fill="none" stroke="#ffd86a" stroke-width="0.6" opacity="0.9"/>`
  };

  SPRITES.monge_90 = { name:'Monge', level:'90–99', tier:'T4', classKey:'monge',
    build:()=>{
      const o = [];
      o.push(head({variant:'shaved', glowEyes:true, eyeGlow:'#ffd86a', eyeGlowL:'#ffffff'}));
      const r1='#ffffff', r1D='#d4d4d4';
      o.push(`<g opacity="0.9">`);
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // flowing robe trails
      o.push(rect(9,28,14,4,r1));
      o.push(rect(8,32,16,2,r1D));
      o.push(`</g>`);
      o.push(rect(15,14,7,1,'#ffd86a'));
      // gold chi markings everywhere
      o.push(rect(15,18,2,1,'#ffd86a'));
      o.push(rect(14,20,4,1,'#ffd86a'));
      o.push(rect(15,22,2,1,'#ffd86a'));
      o.push(rect(13,25,6,1,'#ffd86a'));
      // hands glowing
      o.push(rect(7,16,3,10,r1));
      o.push(rect(22,16,3,10,r1));
      o.push(rect(7,26,3,3,'#ffd86a'));
      o.push(rect(22,26,3,3,'#ffd86a'));
      // no legs visible — floating
      o.push(`<ellipse cx="16" cy="40" rx="8" ry="1.5" fill="#ffd86a" opacity="0.6"/>`);
      // trailing light below
      o.push(rect(13,34,6,1,'#ffd86a'));
      o.push(rect(14,36,4,1,'#ffd86a'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="24" r="24" fill="url(#auraLight)" opacity="0.7"/><circle cx="16" cy="7" r="9" fill="none" stroke="#ffd86a" stroke-width="0.8" opacity="1"/>`
  };

  SPRITES.monge_100 = { name:'Monge', level:'100', tier:'MAX', classKey:'monge',
    build:()=>{
      const o = [];
      o.push(head({variant:'shaved', glowEyes:true, eyeGlow:'#ffffff', eyeGlowL:'#ffd86a'}));
      // body of gold light — semi-translucent
      o.push(`<g opacity="0.8">`);
      o.push(rect(10,14,12,16,'#ffd86a'));
      o.push(rect(10,14,1,16,'#ffb84a'));
      o.push(rect(21,14,1,16,'#ffb84a'));
      o.push(rect(7,16,3,10,'#ffd86a'));
      o.push(rect(22,16,3,10,'#ffd86a'));
      o.push(rect(7,26,3,4,'#ffd86a'));
      o.push(rect(22,26,3,4,'#ffd86a'));
      o.push(`</g>`);
      // sacred markings in white
      o.push(rect(15,18,2,1,'#ffffff'));
      o.push(rect(14,20,4,1,'#ffffff'));
      o.push(rect(13,22,6,1,'#ffffff'));
      o.push(rect(15,24,2,1,'#ffffff'));
      // lotus flowers floating
      const lotusPositions = [[3,30],[28,28],[4,20],[28,18]];
      lotusPositions.forEach(([x,y])=>{
        o.push(rect(x,y,1,1,'#ffb6e1'));
        o.push(rect(x-1,y,1,1,'#ff9ad1'));
        o.push(rect(x+1,y,1,1,'#ff9ad1'));
        o.push(rect(x,y-1,1,1,'#ff9ad1'));
        o.push(rect(x,y+1,1,1,'#ff9ad1'));
        o.push(rect(x,y,1,1,'#ffffff'));
      });
      // buddha pose — legs crossed, floating above ground
      o.push(`<ellipse cx="16" cy="42" rx="10" ry="1.5" fill="#ffd86a" opacity="0.5"/>`);
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="24" r="30" fill="url(#auraLight)" opacity="0.9"/><circle cx="16" cy="7" r="10" fill="none" stroke="#ffffff" stroke-width="1" opacity="1"/><circle cx="16" cy="7" r="12" fill="none" stroke="#ffd86a" stroke-width="0.5" opacity="0.8"/>`
  };

  // ============================================
  // ARQUEIRO — green/silver/brown
  // ============================================
  SPRITES.arqueiro_30 = { name:'Arqueiro', level:'30–49', tier:'T1', classKey:'arqueiro',
    build:()=>{
      const o = [];
      o.push(head({variant:'hooded', hoodColor:'#2d5a2d', hoodColorD:'#1a3a1a'}));
      // green tunic
      const r1='#3a6b3a', r1D='#1f3f1f';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // leather belts crossing chest
      o.push(rect(11,17,10,1,'#5a3a22'));
      o.push(rect(11,22,10,1,'#5a3a22'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,3));
      // quiver on back
      o.push(quiver());
      // bow left
      o.push(bow('#6b3d1f','#f4efe7'));
      o.push(belt('#3a2010','#8b5a3c'));
      o.push(legs('#3a5828','#1a3010','#3a2515','#241610'));
      return o.join('');
    }
  };

  SPRITES.arqueiro_50 = { name:'Arqueiro', level:'50–69', tier:'T2', classKey:'arqueiro',
    build:()=>{
      const o = [];
      o.push(head({variant:'hooded', hoodColor:'#1e3a1e', hoodColorD:'#0f210f'}));
      // mask over nose/mouth (drawn over head's mouth area)
      o.push(rect(12,11,8,2,'#1e3a1e'));
      // armor
      const r1='#2a4a2a', r1D='#143014';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // silver trim
      o.push(rect(11,14,10,1,'#c9ccd4'));
      o.push(rect(15,18,2,3,'#c9ccd4'));
      o.push(rect(11,22,10,1,'#c9ccd4'));
      // cape hood flowing
      o.push(rect(7,15,2,10,'#1e3a1e'));
      o.push(rect(23,15,2,10,'#1e3a1e'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      o.push(quiver());
      // composite bow - more complex
      const bowOut = [];
      bowOut.push(rect(3,13,1,2,'#3a2010'));
      bowOut.push(rect(2,15,1,4,'#5a3a22'));
      bowOut.push(rect(1,19,1,6,'#5a3a22'));
      bowOut.push(rect(2,25,1,4,'#5a3a22'));
      bowOut.push(rect(3,29,1,2,'#3a2010'));
      bowOut.push(rect(4,14,1,16,'#c9ccd4')); // string
      bowOut.push(rect(2,21,2,2,'#3a2010'));
      o.push(bowOut.join(''));
      o.push(belt('#3a2010','#c9ccd4'));
      o.push(legs('#2a4a2a','#143014','#1a1008','#000'));
      return o.join('');
    }
  };

  SPRITES.arqueiro_70 = { name:'Arqueiro', level:'70–89', tier:'T3', classKey:'arqueiro',
    build:()=>{
      const o = [];
      o.push(head({variant:'hooded', hoodColor:'#a8c0a0', hoodColorD:'#5a7a50'}));
      // elven armor silver+green
      const r1='#c9d4c0', r1D='#7a8a70';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // filigree (green)
      o.push(rect(11,14,10,1,'#3a8a3a'));
      o.push(rect(14,17,4,1,'#3a8a3a'));
      o.push(rect(12,20,8,1,'#3a8a3a'));
      o.push(rect(15,23,2,3,'#3a8a3a'));
      o.push(rect(11,27,10,1,'#3a8a3a'));
      o.push(shoulderPads(r1,r1D));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      // ornate bow with glowing runes
      o.push(rect(3,12,1,3,'#8a5a2a'));
      o.push(rect(2,15,1,4,'#ad7a3a'));
      o.push(rect(1,19,1,6,'#ad7a3a'));
      o.push(rect(2,25,1,4,'#ad7a3a'));
      o.push(rect(3,29,1,3,'#8a5a2a'));
      o.push(rect(4,13,1,18,'#5dff8a'));
      o.push(rect(2,17,1,1,'#5dff8a'));
      o.push(rect(2,27,1,1,'#5dff8a'));
      o.push(rect(2,22,1,1,'#5dff8a'));
      // energy arrows in quiver
      o.push(quiver());
      o.push(rect(20,11,3,1,'#5dff8a'));
      o.push(belt('#3a2010','#3a8a3a'));
      o.push(legs('#3a5828','#1a3010','#3a2515','#241610'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="24" r="18" fill="url(#auraNature)" opacity="0.5"/>`
  };

  SPRITES.arqueiro_90 = { name:'Arqueiro', level:'90–99', tier:'T4', classKey:'arqueiro',
    build:()=>{
      const o = [];
      o.push(head({variant:'hooded', hoodColor:'#d4e4c0', hoodColorD:'#8aa878', glowEyes:true, eyeGlow:'#5dff8a'}));
      // mithril armor
      const r1='#d4e4d0', r1D='#8aa880';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // emerald detail
      o.push(rect(15,17,2,2,'#3aeb6a'));
      o.push(rect(11,14,10,1,'#3aeb6a'));
      o.push(rect(11,27,10,1,'#3aeb6a'));
      o.push(shoulderPads(r1,'#c4e8a8'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      // large bow — string of light
      o.push(rect(3,10,1,4,'#c9ccd4'));
      o.push(rect(2,14,1,6,'#c9ccd4'));
      o.push(rect(1,20,1,6,'#c9ccd4'));
      o.push(rect(2,26,1,6,'#c9ccd4'));
      o.push(rect(3,30,1,4,'#c9ccd4'));
      o.push(rect(4,11,1,22,'#d4f4ff'));
      // wind aura leaves
      o.push(orbs('#5dff8a',[[3,5],[28,8],[30,22],[2,30]]));
      o.push(rect(6,12,1,1,'#5dff8a'));
      o.push(rect(26,15,1,1,'#5dff8a'));
      o.push(rect(28,30,1,1,'#5dff8a'));
      o.push(quiver());
      o.push(belt('#3a2010','#3aeb6a'));
      o.push(legs('#3a5828','#1a3010','#3a2515','#241610'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="24" r="24" fill="url(#auraNature)" opacity="0.6"/>`
  };

  SPRITES.arqueiro_100 = { name:'Arqueiro', level:'100', tier:'MAX', classKey:'arqueiro',
    build:()=>{
      const o = [];
      o.push(head({variant:'hooded', hoodColor:'#3a8a3a', hoodColorD:'#1f5a1f', glowEyes:true, eyeGlow:'#8aff8a'}));
      // armor of living leaves
      const r1='#3a8a3a', r1D='#1f5a1f';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // leaf texture
      for (let i=0;i<14;i++){
        const lx = 10 + (i*5)%12;
        const ly = 14 + (i*3)%14;
        o.push(rect(lx,ly,1,1,i%2?'#5dff8a':'#2a6b2a'));
      }
      // roots/vines
      o.push(rect(12,27,1,3,'#8b5a3c'));
      o.push(rect(19,27,1,3,'#8b5a3c'));
      o.push(shoulderPads('#2a6b2a','#0f3a0f'));
      o.push(rect(7,12,1,2,'#5dff8a'));
      o.push(rect(9,13,1,1,'#5dff8a'));
      o.push(rect(22,12,1,2,'#5dff8a'));
      o.push(rect(24,13,1,1,'#5dff8a'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      // bow of pure light
      o.push(rect(3,8,1,4,'#5dff8a'));
      o.push(rect(2,12,1,6,'#5dff8a'));
      o.push(rect(1,18,1,10,'#5dff8a'));
      o.push(rect(2,28,1,6,'#5dff8a'));
      o.push(rect(3,34,1,3,'#5dff8a'));
      o.push(rect(4,10,1,26,'#ffffff'));
      // spirit animals
      o.push(`<g opacity="0.6">`);
      o.push(rect(26,18,2,2,'#8aff8a'));
      o.push(rect(28,18,1,1,'#8aff8a'));
      o.push(rect(28,20,1,2,'#8aff8a'));
      o.push(rect(26,17,1,1,'#8aff8a'));
      o.push(rect(27,16,1,1,'#8aff8a'));
      o.push(`</g>`);
      o.push(belt('#2a1a08','#5dff8a'));
      o.push(legs('#2a6b2a','#0f3a0f','#3a2515','#241610'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="24" r="26" fill="url(#auraNature)" opacity="0.7"/>`
  };

  // ============================================
  // PALADINO — white/gold/sky
  // ============================================
  SPRITES.paladino_30 = { name:'Paladino', level:'30–49', tier:'T1', classKey:'paladino',
    build:()=>{
      const o = [];
      o.push(head({variant:'helm', helmColor:'#d0d6e0', helmColorD:'#8a97b0', helmTrim:'#ffd86a'}));
      o.push(cape('#f4efe7','#c9c0a8'));
      const r1='#e4e8f0', r1D='#8a97b0';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // golden cross on chest
      o.push(rect(15,17,2,8,'#ffd86a'));
      o.push(rect(13,19,6,2,'#ffd86a'));
      o.push(shoulderPads(r1,r1D));
      o.push(rect(11,14,10,1,'#ffd86a'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      // short sword
      o.push(swordShort('right'));
      // big shield with sun emblem
      o.push(shield('#f4efe7','#ffd86a','sun'));
      o.push(belt('#8b5a3c','#ffd86a'));
      o.push(legs('#8a97b0','#5a6878','#3a2515','#241610'));
      return o.join('');
    }
  };

  SPRITES.paladino_50 = { name:'Paladino', level:'50–69', tier:'T2', classKey:'paladino',
    build:()=>{
      const o = [];
      o.push(head({variant:'helm', helmColor:'#ffd86a', helmColorD:'#b88a1a', helmTrim:'#ffffff'}));
      o.push(cape('#ffffff','#d4d4d4'));
      const r1='#ffffff', r1D='#b8b8b8';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // more ornate gold cross + wings embossed
      o.push(rect(15,17,2,10,'#ffd86a'));
      o.push(rect(12,19,8,2,'#ffd86a'));
      o.push(rect(13,21,6,1,'#b88a1a'));
      o.push(shoulderPads('#ffd86a','#b88a1a'));
      o.push(rect(11,14,10,1,'#ffd86a'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      // holy hammer
      o.push(hammer('#ffd86a','#8b5a3c'));
      // shield with wing
      o.push(shield('#ffffff','#ffd86a','wing'));
      o.push(belt('#8b5a3c','#ffd86a'));
      o.push(legs('#d4d4d4','#8a8a8a','#3a2515','#241610'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="7" r="8" fill="none" stroke="#ffd86a" stroke-width="0.5" opacity="0.7"/>`
  };

  SPRITES.paladino_70 = { name:'Paladino', level:'70–89', tier:'T3', classKey:'paladino',
    build:()=>{
      const o = [];
      o.push(head({variant:'helm', helmColor:'#ffd86a', helmColorD:'#b88a1a', helmTrim:'#ffffff'}));
      o.push(cape('#ffd86a','#b88a1a',true));
      const r1='#ffd86a', r1D='#b88a1a';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // cross glowing white
      o.push(rect(15,17,2,10,'#ffffff'));
      o.push(rect(12,20,8,2,'#ffffff'));
      // pauldron = winglets
      o.push(shoulderPads(r1,r1D));
      o.push(`<path d="M 6 14 Q 2 12 4 18 Q 7 16 9 16 Z" fill="#ffffff" opacity="0.9"/>`);
      o.push(`<path d="M 26 14 Q 30 12 28 18 Q 25 16 23 16 Z" fill="#ffffff" opacity="0.9"/>`);
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      // radiant hammer
      o.push(hammer('#ffffff','#b88a1a','#ffd86a'));
      // big shield with lion
      o.push(shield('#ffd86a','#ffffff','lion'));
      o.push(belt('#b88a1a','#ffffff'));
      o.push(legs('#b88a1a','#7a5a10','#3a2515','#241610'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="7" r="9" fill="none" stroke="#ffffff" stroke-width="0.7" opacity="1"/><circle cx="16" cy="24" r="20" fill="url(#auraHoly)" opacity="0.45"/>`
  };

  SPRITES.paladino_90 = { name:'Paladino', level:'90–99', tier:'T4', classKey:'paladino',
    build:()=>{
      const o = [];
      o.push(head({variant:'helm', helmColor:'#ffffff', helmColorD:'#d4d4d4', helmTrim:'#ffd86a', glowEyes:true, eyeGlow:'#ffd86a'}));
      // divine white/gold radiant
      const r1='#ffffff', r1D='#f4e4b0';
      o.push(cape('#ffd86a','#b88a1a',true));
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // cross radiating
      o.push(rect(15,17,2,10,'#ffd86a'));
      o.push(rect(12,20,8,2,'#ffd86a'));
      o.push(rect(14,18,4,1,'#ffd86a'));
      // angel wings large
      o.push(wings('#ffffff', 2));
      o.push(shoulderPads(r1,'#ffd86a'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      // light sword
      o.push(rect(3,11,2,19,'#ffffff'));
      o.push(rect(2,11,1,19,'#ffd86a'));
      o.push(rect(5,11,1,19,'#ffd86a'));
      o.push(rect(1,30,6,1,'#ffd86a'));
      o.push(rect(3,31,2,3,'#b88a1a'));
      // tower shield
      o.push(rect(24,16,5,14,'#ffffff'));
      o.push(rect(24,16,5,1,'#ffd86a'));
      o.push(rect(24,29,5,1,'#ffd86a'));
      o.push(rect(24,16,1,14,'#ffd86a'));
      o.push(rect(28,16,1,14,'#ffd86a'));
      o.push(rect(26,20,1,6,'#ffd86a'));
      o.push(rect(24,22,5,2,'#ffd86a'));
      o.push(belt('#b88a1a','#ffffff'));
      o.push(legs(r1,'#d4d4d4','#b88a1a','#7a5a10'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="7" r="10" fill="none" stroke="#ffd86a" stroke-width="0.8" opacity="1"/><circle cx="16" cy="24" r="26" fill="url(#auraHoly)" opacity="0.6"/>`
  };

  SPRITES.paladino_100 = { name:'Paladino', level:'100', tier:'MAX', classKey:'paladino',
    build:()=>{
      const o = [];
      o.push(head({variant:'helm', helmColor:'#ffffff', helmColorD:'#e0e8f0', helmTrim:'#ffd86a', glowEyes:true, eyeGlow:'#ffffff', eyeGlowL:'#ffd86a'}));
      o.push(wings('#ffffff', 3));
      o.push(wings('#ffd86a', 1));
      const r1='#ffffff', r1D='#d4e4ff';
      o.push(rect(10,14,12,14,r1));
      o.push(rect(10,14,1,14,r1D));
      o.push(rect(21,14,1,14,r1D));
      // radiant cross
      o.push(rect(15,17,2,10,'#ffd86a'));
      o.push(rect(12,20,8,2,'#ffd86a'));
      o.push(rect(14,18,4,1,'#ffffff'));
      o.push(rect(13,22,6,1,'#ffffff'));
      o.push(shoulderPads('#ffd86a','#ffffff'));
      o.push(rect(14,13,4,1,B.skinS));
      o.push(arms(B.skin,B.skinS,r1,r1D,4));
      o.push(belt('#ffd86a','#ffffff'));
      o.push(legs('#ffffff','#d4e4ff','#ffd86a','#b88a1a'));
      // beams of light emanating
      o.push(`<path d="M 16 24 L 0 0 M 16 24 L 32 0 M 16 24 L 0 44 M 16 24 L 32 44" stroke="#ffd86a" stroke-width="0.2" opacity="0.6"/>`);
      // floating sword + shield around
      o.push(rect(29,18,1,10,'#ffffff'));
      o.push(rect(28,18,1,10,'#ffd86a'));
      o.push(rect(27,28,3,1,'#ffd86a'));
      o.push(rect(1,20,3,8,'#ffd86a'));
      o.push(rect(1,19,3,1,'#ffffff'));
      o.push(rect(1,28,3,1,'#ffffff'));
      return o.join('');
    },
    fx:()=>`<circle cx="16" cy="7" r="11" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="1"/><circle cx="16" cy="7" r="13" fill="none" stroke="#ffd86a" stroke-width="0.5" opacity="0.8"/><circle cx="16" cy="24" r="30" fill="url(#auraHoly)" opacity="0.75"/>`
  };

  // ── SVG defs (auras) ──
  function svgDefs(){
    return `<defs>
      <radialGradient id="auraFire" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ff8a3d" stop-opacity="0.7"/>
        <stop offset="55%" stop-color="#e63946" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#e63946" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="auraMagic" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#6fd4ff" stop-opacity="0.7"/>
        <stop offset="55%" stop-color="#a855f7" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="auraLight" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffd86a" stop-opacity="0.85"/>
        <stop offset="55%" stop-color="#ff8a3d" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ffd86a" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="auraNature" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#5dff8a" stop-opacity="0.7"/>
        <stop offset="55%" stop-color="#3a8a3a" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#3a8a3a" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="auraHoly" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
        <stop offset="45%" stop-color="#ffd86a" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ffd86a" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
  }

  // ── Public render API ──
  function renderSVG(id, opts={}){
    const def = SPRITES[id];
    if (!def) return `<svg viewBox="${VB}"><text x="2" y="20" fill="#fff" font-size="4">${id}?</text></svg>`;
    const fx = def.fx ? def.fx() : '';
    const body = def.build();
    const tweaks = window.__orbitaTweaks || {};
    const intensity = tweaks.fxIntensity ?? 1;
    return `<svg viewBox="${VB}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
      ${svgDefs()}
      <g opacity="${intensity}">${fx}</g>
      ${body}
    </svg>`;
  }

  window.OrbitaSprites = { SPRITES, renderSVG, list: Object.keys(SPRITES) };
})();

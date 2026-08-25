/* ============================================================
   DECK — motor de la presentación.
   · Slides con beats internos (timelines GSAP con labels b0…bN)
   · El hilo (PULSE) y el tema se declaran por beat/slide y el
     motor los coreografía — avance en vivo o restore instantáneo.
   · Navegación: → / Espacio / AvPág · ← · F · B · Inicio/Fin · ?
   · Posición persistida en el hash (#s07b2): recarga = recuperación.
   ============================================================ */
(function(){
  'use strict';

  gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin);
  gsap.defaults({ overwrite:'auto' });

  /* ---- Temas por acto (variables CSS animadas en :root) ---- */
  const THEMES = {
    light:{ '--bg0':'#fdfeff', '--bg1':'#e7eff7', '--ink':'#082659', '--soft':'#5a708f',
            '--line':'#14b3d6', '--acc':'#2f6bd8',
            '--glass':'rgba(8,38,89,.05)', '--glass-br':'rgba(8,38,89,.14)' },
    mid:  { '--bg0':'#123055', '--bg1':'#0a1c33', '--ink':'#eaf2ff', '--soft':'#9fb6dc',
            '--line':'#22d3ee', '--acc':'#6fa5ff',
            '--glass':'rgba(234,242,255,.06)', '--glass-br':'rgba(234,242,255,.17)' },
    deep: { '--bg0':'#0f3161', '--bg1':'#081527', '--ink':'#f2f7ff', '--soft':'#a9bedf',
            '--line':'#2be0f7', '--acc':'#7fb2ff',
            '--glass':'rgba(242,247,255,.06)', '--glass-br':'rgba(242,247,255,.17)' },
    dark: { '--bg0':'#141318', '--bg1':'#050507', '--ink':'#f5f2ea', '--soft':'#98948a',
            '--line':'#d4a954', '--acc':'#d4a954',
            '--glass':'rgba(245,242,234,.05)', '--glass-br':'rgba(245,242,234,.15)' }
  };

  const defs = [];             /* definiciones en orden */
  const DECK = {
    s:0, b:0,
    appliedTheme:null,
    register(def){ defs.push(def); },
    defs
  };

  /* ---- contexto por slide (selectores + loops registrados) ---- */
  function makeCtx(def){
    const sec = document.getElementById(def.id);
    const ctx = {
      sec,
      q: gsap.utils.selector(sec),
      loops:{},
      startLoop(name, factory){
        if(ctx.loops[name]) ctx.loops[name].kill();
        ctx.loops[name] = factory();
      },
      killLoops(){
        for(const k in ctx.loops){ ctx.loops[k].kill(); delete ctx.loops[k]; }
      }
    };
    return ctx;
  }

  function maxBeat(def){
    let m = 0;
    for(const k in def._tl.labels){ const n = +k.slice(1); if(k[0]==='b' && n>m) m = n; }
    return m;
  }

  function pulseCfgAt(def, b){
    if(!def.pulse) return null;
    for(let i=b;i>=0;i--){ if(def.pulse['b'+i]) return def.pulse['b'+i]; }
    return null;
  }

  function applyTheme(name, dur, ease){
    if(DECK.appliedTheme === name) return;
    DECK.appliedTheme = name;
    const vars = Object.assign({}, THEMES[name]);
    if(dur === 0){ gsap.set(document.documentElement, vars); return; }
    vars.duration = dur == null ? 1.2 : dur;
    vars.ease = ease || 'power2.inOut';
    gsap.to(document.documentElement, vars);
  }

  /* ---- HUD ---- */
  /* Acto I: s01–s07 · Acto II: s08–s15 · Acto III: s16–s23 */
  const ACTS = [[0,6],[7,14],[15,22]];
  function updateHud(){
    const segs = document.querySelectorAll('.hud-progress .seg i');
    ACTS.forEach((a,i)=>{
      let f = 0;
      if(DECK.s > a[1]) f = 1;
      else if(DECK.s >= a[0]) f = (DECK.s - a[0] + 1) / (a[1] - a[0] + 1);
      segs[i].style.transform = 'scaleX(' + f + ')';
    });
    document.querySelector('.hud-count').textContent =
      String(DECK.s+1).padStart(2,'0') + ' / ' + defs.length;
  }

  function writeHash(){
    history.replaceState(null, '', '#s' + (DECK.s+1) + 'b' + DECK.b);
  }

  /* ---- limpieza de overlays y decoraciones compartidas ----
     Todo lo que vive en el SVG compartido se apaga Y se devuelve a su sitio:
     un latido o un viajero a medio camino no debe filtrarse a la slide siguiente. */
  function resetShared(){
    gsap.set(['#holdOverlay','#holdTag'], { autoAlpha:0 });
    gsap.killTweensOf(['#blipG','#orbitG','#particles circle']);
    gsap.set('#pulseSvg .deco', { autoAlpha:0 });
    gsap.set('#blipG', { autoAlpha:0, attr:{ transform:'translate(-200,640)' } });
    gsap.set('#orbitG', { rotation:0, svgOrigin:'960 600' });
    gsap.set('#particles circle', { autoAlpha:0, x:0, y:0 });
  }

  /* ---- entrada a una slide ---- */
  function enterSlide(idx, beat, instant){
    const def = defs[idx];
    const old = defs[DECK.s];

    /* salida de la anterior */
    if(old && old._ctx && old !== def){
      old._ctx.killLoops();
      if(old._tl) old._tl.kill();
      gsap.to(old._ctx.sec, { autoAlpha:0, duration: instant?0:.32, ease:'power1.in' });
    }
    resetShared();

    DECK.s = idx;

    /* tema */
    applyTheme(def.theme || 'light',
      instant ? 0 : (def.themeDur != null ? def.themeDur : 1.2),
      def.themeEase);

    /* construir timeline fresca (estado determinista) */
    def._ctx = makeCtx(def);
    def._tl = def.build(def._ctx);
    def._max = maxBeat(def);

    const target = Math.min(beat, def._max);
    DECK.b = target;
    gsap.set(def._ctx.sec, { autoAlpha:1 });

    const cfg = pulseCfgAt(def, target);
    if(instant){
      if(cfg) PULSE.jumpTo(cfg.state);
      def._tl.seek('b' + target, false);   /* dispara .call() → loops */
      def._tl.pause();
    } else {
      const c0 = def.pulse && def.pulse.b0;
      if(c0){
        if(c0.draw){ PULSE.jumpTo(c0.state); PULSE.draw(c0.dur, c0.ease); }
        else PULSE.morphTo(c0.state, c0.dur, c0.ease);
      }
      def._tl.tweenTo('b0');
      /* si se pide un beat mayor (raro en vivo), saltar el resto */
      if(target > 0){
        def._tl.pause(); def._tl.seek('b' + target, false);
        if(cfg && cfg !== c0) PULSE.jumpTo(cfg.state);
      }
    }
    updateHud(); writeHash();
  }

  /* ---- avance/retroceso de beat dentro de la slide ---- */
  function beatForward(){
    const def = defs[DECK.s];
    DECK.b++;
    const cfg = def.pulse && def.pulse['b' + DECK.b];
    if(cfg) PULSE.morphTo(cfg.state, cfg.dur, cfg.ease);
    def._tl.tweenTo('b' + DECK.b);
    writeHash();
  }

  function beatBack(){
    const def = defs[DECK.s];
    DECK.b--;
    def._ctx.killLoops();
    def._tl.kill();
    def._tl = def.build(def._ctx);          /* rebuild determinista */
    def._tl.seek('b' + DECK.b, false);
    def._tl.pause();
    const cfg = pulseCfgAt(def, DECK.b);
    if(cfg) PULSE.jumpTo(cfg.state);
    writeHash();
  }

  /* ---- navegación pública ---- */
  let lastNav = 0;
  function throttled(){ const n = performance.now(); if(n - lastNav < 160) return true; lastNav = n; return false; }

  function next(){
    if(throttled()) return;
    const def = defs[DECK.s];
    if(DECK.b < def._max) beatForward();
    else if(DECK.s < defs.length-1) enterSlide(DECK.s+1, 0, false);
  }
  function prev(){
    if(throttled()) return;
    if(DECK.b > 0) beatBack();
    else if(DECK.s > 0){
      const p = defs[DECK.s-1];
      /* entrar a la anterior en su estado final, instantáneo */
      enterSlide(DECK.s-1, 99, true);
      gsap.fromTo(p._ctx ? p._ctx.sec : '#'+p.id, {autoAlpha:0},{autoAlpha:1,duration:.28});
    }
  }

  /* ---- overlays globales ---- */
  let blackout = false, help = false;
  function toggleBlackout(){
    blackout = !blackout;
    gsap.to('.blackout', { autoAlpha: blackout?1:0, duration:.35, ease:'power1.inOut' });
  }
  function toggleHelp(force){
    help = force != null ? force : !help;
    gsap.to('.help', { autoAlpha: help?1:0, duration:.25 });
  }

  /* ---- escalado del stage ---- */
  function fit(){
    const sc = Math.min(innerWidth/1920, innerHeight/1080);
    document.querySelector('.stage').style.transform =
      'translate(-50%,-50%) scale(' + sc + ')';
  }

  /* ---- init ---- */
  function init(){
    fit(); addEventListener('resize', fit);

    addEventListener('keydown', (e)=>{
      if(help && e.key !== '?' && e.key !== 'Escape' && e.key.toLowerCase() !== 'h') return;
      switch(e.key){
        case 'ArrowRight': case ' ': case 'PageDown': case 'ArrowDown':
          e.preventDefault(); next(); break;
        case 'ArrowLeft': case 'PageUp': case 'ArrowUp':
          e.preventDefault(); prev(); break;
        case 'Home': e.preventDefault(); enterSlide(0, 0, true); break;
        case 'End':  e.preventDefault(); enterSlide(defs.length-1, 99, true); break;
        case 'f': case 'F':
          if(document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        case 'b': case 'B': toggleBlackout(); break;
        case '?': case 'h': case 'H': toggleHelp(); break;
        case 'Escape': if(help) toggleHelp(false); break;
      }
    });

    /* restaurar posición desde el hash (recuperación ante crash) */
    const m = location.hash.match(/^#s(\d+)b(\d+)$/);
    if(m){
      const s = Math.min(Math.max(+m[1]-1,0), defs.length-1);
      enterSlide(s, +m[2], true);
    } else {
      enterSlide(0, 0, false);
    }
  }

  DECK.next = next; DECK.prev = prev; DECK.init = init;
  DECK.enterSlide = enterSlide;
  window.DECK = DECK;

  addEventListener('DOMContentLoaded', init);
})();

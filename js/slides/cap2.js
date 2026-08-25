/* ============================================================
   ACTO II — Miracle (S08–S15) · azul profundo, producto
   ============================================================ */
(function(){
  'use strict';

  /* ---------- S08 · De analizar a actuar ---------- */
  DECK.register({
    id:'s08', theme:'mid', themeDur:1.4,
    pulse:{ b0:{ state:'timeline', dur:1.15, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1'), { y:44, autoAlpha:0 });
      gsap.set(q('.stn'), { autoAlpha:0, y:16 });
      gsap.set(q('.stn .ldot'), { scale:0 });
      const tl = gsap.timeline({ paused:true });
      const stn = i => q('.stn')[i];
      const on = (i, emph) => {
        const t = gsap.timeline();
        t.to(stn(i), { autoAlpha:1, y:0, duration:.5, ease:'power3.out' }, 0)
         .to(stn(i).querySelector('.ldot'),
             { scale: emph?1.45:1, duration:.5, ease:'back.out(2.2)' }, 0);
        if(emph) t.to(stn(i).querySelector('.lbl'), { color:'var(--line)', duration:.4 }, .1);
        return t;
      };
      tl.to(q('.l1'), { y:0, autoAlpha:1, duration:.85, ease:'power3.out' })
        .add(on(0), '-=.25')
        .addLabel('b0')
        .add(on(1)).addLabel('b1')
        .add(on(2)).addLabel('b2')
        .add(on(3, true)).addLabel('b3');
      return tl;
    }
  });

  /* ---------- S09 · Ahí nace Miracle ---------- */
  DECK.register({
    id:'s09', theme:'deep', themeDur:1.5,
    pulse:{
      b0:{ state:'separados', dur:.8, ease:'power2.inOut' },
      b1:{ state:'tejido',    dur:1.35, ease:'power3.inOut' }
    },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.node'),  { autoAlpha:0, scale:.9 });
      gsap.set(q('.layer'), { autoAlpha:0, scaleX:.55, transformOrigin:'center' });
      gsap.set(q('.intro'), { autoAlpha:0, y:28 });
      gsap.set(q('.kick'),  { autoAlpha:0, y:26 });
      gsap.set(q('.lw'),    { autoAlpha:0, y:26 });
      gsap.set(q('.ls'),    { autoAlpha:0 });
      gsap.set(q('.ls path'), { drawSVG:'50% 50%' });
      gsap.set(q('.sub'),   { autoAlpha:0, y:24 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.intro'), { autoAlpha:1, y:0, duration:.8, ease:'power3.out' })
        .to(q('.node'), { autoAlpha:1, scale:1, duration:.7,
                          stagger:.16, ease:'power3.out' }, '-=.35')
        .call(()=>ctx.startLoop('float', ()=>{
          const t = gsap.timeline({ repeat:-1, yoyo:true });
          q('.node').forEach((n,i)=>
            t.to(n, { y: i%2 ? 11 : -11, duration: 2.2 + i*.4, ease:'sine.inOut' }, 0));
          return t;
        }))
        .addLabel('b0')
        /* la frase cede el sitio exacto a la marca */
        .to(q('.intro'), { autoAlpha:0, y:-26, duration:.55, ease:'power2.in' })
        .to(q('.layer'), { autoAlpha:1, scaleX:1, duration:1.05, ease:'power3.inOut' }, '-=.25')
        .to(q('.kick'), { autoAlpha:1, y:0, duration:.6, ease:'power3.out' }, '-=.6')
        .to(q('.lw'),   { autoAlpha:1, y:0, duration:.75, ease:'power3.out' }, '-=.35')
        /* la sonrisa de la marca se dibuja desde el centro hacia afuera */
        .to(q('.ls'),      { autoAlpha:1, duration:.2 }, '-=.15')
        .to(q('.ls path'), { drawSVG:'0% 100%', duration:.7, ease:'power2.out' }, '<')
        .addLabel('b1')
        .to(q('.sub'), { autoAlpha:1, y:0, duration:.7, ease:'power3.out' })
        .addLabel('b2');
      return tl;
    }
  });

  /* ---------- S10 · IÜ opera ----------
     IÜ recorre la fila de tareas y las va cerrando: computer use en miniatura,
     no un gesto decorativo. Cada parada = una tarea real cerrada. */
  DECK.register({
    id:'s10', theme:'deep',
    pulse:{ b0:{ state:'senda', dur:1.1, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      const PARADAS = [422, 772, 1122, 1472];   // x de .iuwrap para centrarse en cada tarea
      gsap.set(q('.iuwrap'), { autoAlpha:0, x:120, y:0, scale:.85, transformOrigin:'center' });
      gsap.set(q('.iuglow'), { autoAlpha:.25 });
      gsap.set(q('.l1, .sub'), { autoAlpha:0, y:34 });
      gsap.set(q('.task'),  { autoAlpha:0, y:26 });
      gsap.set(q('.tbar i'), { scaleX:0 });
      gsap.set(q('.tchk'),  { autoAlpha:0, scale:.3 });

      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), { autoAlpha:1, y:0, duration:.8, ease:'power3.out' })
        .to(q('.task'), { autoAlpha:1, y:0, duration:.5, stagger:.1, ease:'power3.out' }, '-=.4')
        .to(q('.iuwrap'), { autoAlpha:1, x:190, scale:1, duration:.8, ease:'back.out(1.3)' }, '-=.35')
        .call(()=>ctx.startLoop('blink', ()=>{
          const t = gsap.timeline({ repeat:-1, repeatDelay:3.8 });
          t.to(q('.eye'), { scaleY:.1, transformOrigin:'center bottom', duration:.09 })
           .to(q('.eye'), { scaleY:1, duration:.11 });
          return t;
        }))
        .addLabel('b0');

      /* El recorrido: viaja, se asoma a la tarea, la ejecuta, sigue. */
      PARADAS.forEach((x, i) => {
        const tarea = q('.task')[i];
        tl.to(q('.iuwrap'), { x, duration:.62, ease:'power2.inOut' })
          .to(q('.iuwrap'), { y:-16, duration:.31, ease:'sine.inOut', yoyo:true, repeat:1 }, '<')
          /* se estira un poco al llegar: el "ahora hago esto" */
          .to(q('.iuwrap'), { scale:1.1, duration:.16, yoyo:true, repeat:1, ease:'power2.out' })
          .to(q('.iuglow'), { autoAlpha:.75, duration:.18, yoyo:true, repeat:1 }, '<')
          .to(tarea, { borderColor:'color-mix(in srgb, var(--line) 55%, transparent)',
                       background:'color-mix(in srgb, var(--line) 9%, transparent)',
                       duration:.25 }, '<')
          .to(tarea.querySelector('.tbar i'), { scaleX:1, duration:.42, ease:'power2.out' }, '<.05')
          .to(tarea.querySelector('.tchk'), { autoAlpha:1, scale:1,
                                              duration:.3, ease:'back.out(2.6)' }, '>-.08')
          .to({}, { duration:.12 });
      });

      /* Vuelve al centro y se acomoda: cierra el recorrido en un sitio
         estable para hablar, en vez de quedar cortada contra el borde. */
      tl.to(q('.iuwrap'), { x:896, duration:.8, ease:'power2.inOut' })
        .to(q('.iuwrap'), { y:-22, duration:.26, yoyo:true, repeat:1, ease:'power2.out' })
        .to(q('.sub'), { autoAlpha:1, y:0, duration:.7, ease:'power3.out' }, '-=.4')
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S11 · De la conversación a la acción ---------- */
  DECK.register({
    id:'s11', theme:'deep',
    pulse:{ b0:{ state:'pipeline', dur:1.2, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1, .sub'), { y:40, autoAlpha:0 });
      gsap.set(q('.pchip'), { autoAlpha:0, y:20 });
      gsap.set(q('.ldot'), { scale:0 });
      gsap.set('#particles', { autoAlpha:1 });
      gsap.set('#particles circle', { autoAlpha:0 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), { y:0, autoAlpha:1, duration:.85, ease:'power3.out' })
        .to(q('.ldot'),  { scale:1, duration:.45, stagger:.12, ease:'back.out(2)' }, '-=.3')
        .to(q('.pchip'), { autoAlpha:1, y:0, duration:.55, stagger:.12, ease:'power3.out' }, '<.08')
        .addLabel('b0')
        .to(q('.sub'), { y:0, autoAlpha:1, duration:.7, ease:'power3.out' })
        .call(()=>ctx.startLoop('flow', ()=>{
          const t = gsap.timeline({ repeat:-1 });
          document.querySelectorAll('#particles circle').forEach((c,i)=>{
            t.fromTo(c, { autoAlpha:0 },
              { autoAlpha:.9, duration:.4 }, i*1.7)
             .to(c, { motionPath:{ path:'#pulsePath', align:'#pulsePath',
                      alignOrigin:[.5,.5] }, duration:4.6, ease:'none' }, i*1.7)
             .to(c, { autoAlpha:0, duration:.4 }, i*1.7 + 4.2);
          });
          return t;
        }))
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S12 · El criterio clínico no se delega ---------- */
  DECK.register({
    id:'s12', theme:'deep',
    pulse:{ b0:{ state:'revision', dur:1.2, ease:'power3.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1, .l2, .sub'), { autoAlpha:0, y:38 });
      gsap.set(q('.gate'), { autoAlpha:0, scale:.7, transformOrigin:'center' });
      gsap.set(q('.gchk'), { drawSVG:'0% 0%' });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), { autoAlpha:1, y:0, duration:.8, ease:'power3.out' })
        .to(q('.gate'), { autoAlpha:1, scale:1, duration:.75, ease:'back.out(1.5)' }, '-=.35')
        .addLabel('b0')
        .to(q('.l2'), { autoAlpha:1, y:0, duration:.75, ease:'power3.out' })
        /* el visto se traza cuando aparece «decide»: la aprobación es humana */
        .to(q('.gchk'), { drawSVG:'0% 100%', duration:.5, ease:'power2.out' }, '-=.35')
        .to(q('.sub'), { autoAlpha:1, y:0, duration:.7, ease:'power3.out' }, '-=.15')
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S13 · Portal — Miracle Notes ---------- */
  DECK.register({
    id:'s13', theme:'deep',
    pulse:{ b0:{ state:'portalIn', dur:1.25, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      const wave = q('.wave')[0];
      if(!wave.children.length)
        for(let i=0;i<16;i++) wave.appendChild(document.createElement('i'));

      gsap.set(q('.wrap'), { y:40, autoAlpha:0 });
      gsap.set(q('.portal'), { autoAlpha:0, y:30, scale:.955, transformOrigin:'center' });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.wrap'),   { y:0, autoAlpha:1, duration:.85, ease:'power3.out' })
        .to(q('.portal'), { autoAlpha:1, y:0, scale:1, duration:1, ease:'power3.out' }, '-=.45')
        .call(()=>ctx.startLoop('wave', ()=>{
          const t = gsap.timeline({ repeat:-1, yoyo:true });
          wave.querySelectorAll('i').forEach((b,i)=>
            t.to(b, { scaleY: .35 + Math.abs(Math.sin(i*1.7))*1.5,
                      duration:.55 + (i%4)*.12, ease:'sine.inOut' }, (i%5)*.1));
          return t;
        }))
        .call(()=>ctx.startLoop('skel', ()=>
          gsap.to(q('.fields i'), { opacity:.45, duration:1.1, yoyo:true,
                                    repeat:-1, stagger:.2, ease:'sine.inOut' })))
        .addLabel('b0')
        .call(()=>{ document.querySelector('#holdTag .txt').textContent =
                      'Demo en vivo — Miracle Notes'; })
        .to('#holdOverlay', { autoAlpha:1, duration:.6, ease:'power1.inOut' })
        .fromTo('#holdTag', { autoAlpha:0, y:14 },
                            { autoAlpha:1, y:0, duration:.5, ease:'power3.out' }, '-=.2')
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S14 · Portal — de asistir a operar ---------- */
  DECK.register({
    id:'s14', theme:'deep',
    pulse:{ b0:{ state:'portalThrough', dur:1.15, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.wrap'), { y:40, autoAlpha:0 });
      gsap.set(q('.portal'), { autoAlpha:0, y:30, scale:.955, transformOrigin:'center' });
      gsap.set(q('.sysbox'), { autoAlpha:0, x:26 });
      gsap.set(q('.chk'), { background:'transparent', color:'transparent' });
      gsap.set(q('.oprow'), { borderColor:'rgba(255,255,255,.09)' });
      gsap.set(q('.iuwrap'), { autoAlpha:0, x:400, y:400, scale:.8, transformOrigin:'center' });
      gsap.set(q('.clickring'), { autoAlpha:0, scale:.3 });

      /* Puntos de clic en el stage. IÜ no se para encima del objetivo —lo
         taparía— sino al lado, como un cursor que señala: a la derecha de la
         pestaña, a la izquierda del check de la fila. El anillo sí marca el
         punto exacto. */
      const TAB  = [[620,411],[782,411],[944,411]];
      const FILA = [[1334,505],[1334,598],[1334,692],[1334,785]];
      const irA  = ([cx,cy], dur, dx, dy) =>
        ({ x:cx + (dx==null?18:dx), y:cy + (dy==null?6:dy), duration:dur||.6, ease:'power2.inOut' });

      const tl = gsap.timeline({ paused:true });
      tl.to(q('.wrap'),   { y:0, autoAlpha:1, duration:.85, ease:'power3.out' })
        .to(q('.portal'), { autoAlpha:1, y:0, scale:1, duration:1, ease:'power3.out' }, '-=.45')
        .to(q('.sysbox'), { autoAlpha:1, x:0, duration:.6, stagger:.14, ease:'power3.out' }, '-=.4')
        .to(q('.iuwrap'), { autoAlpha:1, scale:1, duration:.6, ease:'back.out(1.4)' }, '-=.3')
        .addLabel('b0')
        .call(()=>ctx.startLoop('nav', ()=>{
          const tabs = q('.optab'), rows = q('.oprow');
          const t = gsap.timeline({ repeat:-1, repeatDelay:.9 });

          /* un clic = IÜ se hunde un poco + anillo que se expande donde toca.
             Se encadena sobre `t` en vez de crear timelines sueltos. */
          const clic = ([cx,cy]) => {
            t.set(q('.clickring'), { x:cx-32, y:cy-32, scale:.3, autoAlpha:.9 })
             .to(q('.iuwrap'),   { scale:.86, duration:.12, ease:'power2.in' }, '<')
             .to(q('.clickring'),{ scale:1.5, autoAlpha:0, duration:.5, ease:'power2.out' }, '<')
             .to(q('.iuwrap'),   { scale:1, duration:.24, ease:'back.out(3)' }, '<.12');
          };

          tabs.forEach((tab, ti) => {
            t.to(q('.iuwrap'), irA(TAB[ti], .62));
            clic(TAB[ti]);
            t
             /* la pestaña se activa y las demás se apagan */
             .to(tab, { background:'rgba(43,224,247,.14)',
                        borderColor:'rgba(43,224,247,.5)',
                        color:'rgba(255,255,255,.92)', duration:.25 }, '<.08')
             .to(tabs.filter(o=>o!==tab), { background:'rgba(255,255,255,.04)',
                        borderColor:'rgba(255,255,255,.08)',
                        color:'rgba(255,255,255,.42)', duration:.25 }, '<')
             /* la lista se recarga al cambiar de pestaña */
             .to(rows, { autoAlpha:.15, duration:.16 }, '<.05')
             .to(rows, { borderColor:'rgba(255,255,255,.09)',
                         background:'rgba(255,255,255,.055)', duration:.01 }, '<')
             .set(q('.chk'), { background:'transparent', color:'transparent' }, '<')
             .to(rows, { autoAlpha:1, duration:.3, stagger:.05 });

            /* y en cada pestaña despacha un par de filas */
            [ti, ti+1].forEach(ri => {
              const row = rows[ri]; if(!row) return;
              t.to(q('.iuwrap'), irA(FILA[ri], .5, -64, 4));
              clic(FILA[ri]);
              t.to(row, { borderColor:'rgba(43,224,247,.55)',
                          background:'rgba(43,224,247,.07)', duration:.25 }, '<.06')
               .to(row.querySelector('.chk'), { background:'#2be0f7', color:'#06121f',
                          scale:1.15, duration:.26, ease:'back.out(2.5)' }, '<.04')
               .to(row.querySelector('.chk'), { scale:1, duration:.18 });
            });
          });
          return t;
        }))
        .call(()=>ctx.startLoop('sys', ()=>
          gsap.to(q('.sysbox .sq'), { opacity:.55, duration:1.3, yoyo:true,
                                      repeat:-1, stagger:.5, ease:'sine.inOut' })))
        .to({}, { duration:.3 })
        .addLabel('b1')
        .call(()=>{ document.querySelector('#holdTag .txt').textContent =
                      'Demo en vivo — Miracle Operations'; })
        .to('#holdOverlay', { autoAlpha:1, duration:.6, ease:'power1.inOut' })
        .fromTo('#holdTag', { autoAlpha:0, y:14 },
                            { autoAlpha:1, y:0, duration:.5, ease:'power3.out' }, '-=.2')
        .addLabel('b2');
      return tl;
    }
  });

  /* ---------- S15 · Lo que acabamos de ver ---------- */
  DECK.register({
    id:'s15', theme:'deep',
    pulse:{ b0:{ state:'estratos', dur:1.35, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      const pos = [0, 222, 444];                 /* interfaz, datos, intención */
      gsap.set(q('.l1, .l2'), { y:36, autoAlpha:0 });
      q('.band').forEach((b,i)=>gsap.set(b, { top:pos[i], autoAlpha:0, y:44 }));
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), { y:0, autoAlpha:1, duration:.85, ease:'power3.out' })
        .to(q('.band'), { autoAlpha:1, y:0, duration:.6, stagger:.14, ease:'power3.out' }, '-=.35')
        .addLabel('b0')
        .to(q('.band')[2], { top:0,   duration:.95, ease:'power3.inOut' })
        .to(q('.band')[0], { top:222, duration:.95, ease:'power3.inOut' }, '<')
        .to(q('.band')[1], { top:444, duration:.95, ease:'power3.inOut' }, '<')
        .to(q('.l2'), { y:0, autoAlpha:1, duration:.75, ease:'power3.out' }, '-=.3')
        .addLabel('b1');
      return tl;
    }
  });
})();

/* ============================================================
   ACTO I — Medicina (S01–S07) · mundo claro, azul clínico
   Cada build(): 1) resetea sus elementos, 2) devuelve un timeline
   pausado con labels b0…bN. El hilo se declara en def.pulse.
   ============================================================ */
(function(){
  'use strict';
  const UP = { y:44, autoAlpha:0 };
  const IN = { y:0, autoAlpha:1, ease:'power3.out' };

  /* ---------- S01 · Standby (pantalla de espera) ---------- */
  DECK.register({
    id:'s01', theme:'light',
    pulse:{ b0:{ state:'reposo', dur:.8 } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.aura'), { autoAlpha:0, scale:.94, transformOrigin:'center' });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.aura'), { autoAlpha:1, scale:1, duration:1.6, ease:'power2.out' })
        .call(()=>ctx.startLoop('breathe', ()=>
          gsap.to(q('.aura'), { scale:1.035, duration:4.5, yoyo:true,
                                repeat:-1, ease:'sine.inOut' })))
        .addLabel('b0');
      return tl;
    }
  });

  /* ---------- S02 · Apertura ---------- */
  DECK.register({
    id:'s02', theme:'light',
    pulse:{
      b0:{ state:'pulso',   draw:true, dur:1.7, ease:'power2.inOut' },
      b2:{ state:'trabado', dur:.65,  ease:'power3.inOut' }
    },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1, .l2'), UP);
      const tl = gsap.timeline({ paused:true });
      tl.to({}, { duration:.9 })                       /* aire para el dibujo de la línea */
        .addLabel('b0')
        .to(q('.l1'), Object.assign({ duration:.85 }, IN))
        .addLabel('b1')
        .to(q('.l2'), Object.assign({ duration:.8 }, IN))
        .addLabel('b2');
      return tl;
    }
  });

  /* ---------- S03 · Fricción ---------- */
  DECK.register({
    id:'s03', theme:'light',
    pulse:{
      b0:{ state:'tension', dur:1.1, ease:'power2.inOut' },
      b2:{ state:'nudo',    dur:1.0, ease:'power3.inOut' }
    },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1, .l2'), UP);
      gsap.set(q('.st'), { autoAlpha:0, y:18, scale:.92 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), Object.assign({ duration:.85 }, IN))
        .addLabel('b0')
        .to(q('.st'), { autoAlpha:1, y:0, scale:1, duration:.42,
                        stagger:.13, ease:'back.out(1.6)' })
        .addLabel('b1')
        .to(q('.l2'), Object.assign({ duration:.75 }, IN))
        .to(q('.st'), { autoAlpha:.55, duration:.8, ease:'power1.inOut' }, '<')
        .addLabel('b2');
      return tl;
    }
  });

  /* ---------- S04 · El costo humano ---------- */
  DECK.register({
    id:'s04', theme:'light',
    pulse:{ b0:{ state:'apagada', dur:1.25, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.human'), { autoAlpha:0 });
      gsap.set(q('.scr'),   { autoAlpha:0, y:34, scale:.96 });
      gsap.set(q('.wrap'),  UP);
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.human'), { autoAlpha:1, duration:.9, ease:'power2.out' })
        .addLabel('b0')
        .to(q('.scr'), { autoAlpha:1, y:0, scale:1, duration:.5,
                         stagger:.13, ease:'power3.out' })
        .to(q('.human'), { autoAlpha:.42, duration:1, ease:'power1.inOut' }, '<.2')
        .addLabel('b1')
        .to(q('.wrap'), Object.assign({ duration:.8 }, IN))
        .addLabel('b2');
      return tl;
    }
  });

  /* ---------- S05 · El costo se reparte ---------- */
  DECK.register({
    id:'s05', theme:'light',
    pulse:{ b0:{ state:'tronco', dur:1.1, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1'), UP);
      gsap.set(q('.cost'), { autoAlpha:0, x:-26 });
      gsap.set('#s05fan', { autoAlpha:1 });
      gsap.set('#s05fan path', { autoAlpha:0, drawSVG:'0% 0%' });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), Object.assign({ duration:.85 }, IN))
        .addLabel('b0')
        .to('#s05fan path', { autoAlpha:.5, drawSVG:'0% 100%', duration:.75,
                              stagger:.16, ease:'power2.out' })
        .to(q('.cost'), { autoAlpha:1, x:0, duration:.6,
                          stagger:.16, ease:'power3.out' }, '-=.6')
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S06 · La pregunta ---------- */
  DECK.register({
    id:'s06', theme:'light',
    pulse:{
      b0:{ state:'respira', dur:1.5, ease:'power2.inOut' },
      b1:{ state:{ d: PULSE.STATES.respira.d, o:.62 }, dur:.9, ease:'power2.out' }
    },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1, .l2'), { y:30, autoAlpha:0 });
      const tl = gsap.timeline({ paused:true });
      tl.call(()=>ctx.startLoop('breath', ()=>
          gsap.to('#pulseG', { y:-13, duration:2.7, ease:'sine.inOut', yoyo:true, repeat:-1 })))
        .to(q('.l1'), { y:0, autoAlpha:1, duration:1.05, ease:'power2.out' })
        .addLabel('b0')
        .to(q('.l2'), { y:0, autoAlpha:1, duration:.95, ease:'power2.out' })
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S07 · Reveal de la tesis ---------- */
  DECK.register({
    id:'s07', theme:'light',
    pulse:{ b0:{ state:'renace', draw:true, dur:1.5, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.row'), { y:64, autoAlpha:0 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.row'), { y:0, autoAlpha:1, duration:.85,
                         stagger:.24, ease:'power4.out' }, .35)
        .call(()=>PULSE.blip({ y:876, scale:.75, dur:2.3, delay:.15 }))
        .to({}, { duration:.2 })
        .addLabel('b0');
      return tl;
    }
  });
})();

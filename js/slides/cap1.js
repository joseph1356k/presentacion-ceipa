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
      /* El texto va horneado en la foto, así que la foto NUNCA rota —
         solo respira y flota. El movimiento real vive en el destello. */
      gsap.set(q('.aura'),  { autoAlpha:0, scale:.94, transformOrigin:'center' });
      gsap.set(q('.aurawrap'), { y:0 });
      gsap.set(q('.shine'), { autoAlpha:0, x:-160, y:-140, scale:.9 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.aura'), { autoAlpha:1, scale:1, duration:1.6, ease:'power2.out' })
        .call(()=>{
          /* respira: la esfera late muy lento */
          ctx.startLoop('breathe', ()=>
            gsap.to(q('.aura'), { scale:1.035, duration:4.5, yoyo:true,
                                  repeat:-1, ease:'sine.inOut' }));
          /* flota: un vaivén vertical apenas perceptible */
          ctx.startLoop('float', ()=>
            gsap.to(q('.aurawrap'), { y:-14, duration:6, yoyo:true,
                                      repeat:-1, ease:'sine.inOut' }));
          /* el destello recorre la esfera en un óvalo lento — la luz se
             mueve, la palabra Miracle nunca gira */
          ctx.startLoop('shine', ()=>{
            gsap.set(q('.shine'), { autoAlpha:.55 });
            return gsap.to(q('.shine'), {
              motionPath:{
                path:[{x:-160,y:-140},{x:210,y:-60},{x:120,y:220},{x:-190,y:110},{x:-160,y:-140}],
                curviness:1.4
              },
              duration:16, ease:'sine.inOut', repeat:-1
            });
          });
        })
        .addLabel('b0');
      return tl;
    }
  });

  /* ---------- S02 · El dato (49,2%) ----------
     La pila de ventanas invade el territorio derecho; el número cuenta
     hasta 49,2 mientras la interfaz se come la jornada.
     4 beats: b0 la interfaz · b1 el 49,2% · b2 el 27% · b3 la conclusión. */
  DECK.register({
    id:'s02', theme:'light',
    /* Primera slide con contenido: aquí nace el hilo. Se dibuja vivo y se
       va aplanando bajo las ventanas — el 49,2% hecho imagen. Sin nudo:
       eso pasa en la s03, y verlo antes rompería el orden de la historia. */
    pulse:{
      b0:{ state:'pulso',     draw:true, dur:1.7, ease:'power2.inOut' },
      b1:{ state:'enterrada', dur:1.3, ease:'power2.inOut' }
    },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.scr'),   { autoAlpha:0, x:240, y:24 });
      gsap.set(q('.stat49'), { autoAlpha:0, y:28 });
      gsap.set(q('.stat27'), { autoAlpha:0, y:22 });
      gsap.set(q('.concl'),  { autoAlpha:0, y:24 });
      gsap.set(q('.fuente'), { autoAlpha:0 });
      const n49 = q('.stat49 .n')[0], v = { p:0 };
      n49.textContent = '0%';
      const tl = gsap.timeline({ paused:true });
      /* la interfaz entra sola: es lo primero que se ve */
      tl.to(q('.scr'), { autoAlpha:1, x:0, y:0, duration:.55,
                         stagger:.09, ease:'power3.out' })
        .addLabel('b0')
        .to(q('.stat49'), { autoAlpha:1, y:0, duration:.7, ease:'power3.out' })
        .to(v, { p:49.2, duration:1.1, ease:'power2.out',
                 onUpdate:()=>{ n49.textContent = v.p.toFixed(1).replace('.', ',') + '%'; } }, '<')
        .addLabel('b1')
        .to(q('.stat27'), { autoAlpha:1, y:0, duration:.7, ease:'power3.out' })
        .addLabel('b2')
        .to(q('.concl'),  { autoAlpha:1, y:0, duration:.75, ease:'power3.out' })
        .to(q('.fuente'), { autoAlpha:.8, duration:.6 }, '<.25')
        .addLabel('b3');
      return tl;
    }
  });

  /* ---------- S03 · Una sola persona ----------
     Los cinco frentes de la consulta tiran de la línea hasta anudarla. */
  DECK.register({
    id:'s03', theme:'light',
    pulse:{
      b0:{ state:'tension', dur:1.15, ease:'power2.inOut' },
      b2:{ state:'nudo',    dur:1.0,  ease:'power3.inOut' }
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

  /* ---------- S04 · El costo se reparte ---------- */
  DECK.register({
    id:'s04', theme:'light',
    pulse:{ b0:{ state:'tronco', dur:1.1, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1'), UP);
      gsap.set(q('.cost'), { autoAlpha:0, x:-26 });
      gsap.set('#s04fan', { autoAlpha:1 });
      gsap.set('#s04fan path', { autoAlpha:0, drawSVG:'0% 0%' });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), Object.assign({ duration:.85 }, IN))
        .addLabel('b0')
        .to('#s04fan path', { autoAlpha:.5, drawSVG:'0% 100%', duration:.75,
                              stagger:.16, ease:'power2.out' })
        .to(q('.cost'), { autoAlpha:1, x:0, duration:.6,
                          stagger:.16, ease:'power3.out' }, '-=.6')
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S05 · La contradicción ----------
     Ya vimos el dato, la carga y el alcance: esto es el zoom out. La línea
     se rehace entera (la medicina avanza) y tartamudea a la derecha (el día
     a día del médico). Entrega directo a la pregunta de la s06: si la
     medicina avanza, entonces no es que falte tecnología. */
  DECK.register({
    id:'s05', theme:'light',
    pulse:{
      b0:{ state:'pulso',   dur:1.2, ease:'power2.inOut' },
      b1:{ state:'trabado', dur:.65, ease:'power3.inOut' }
    },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1, .l2'), UP);
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), Object.assign({ duration:.85 }, IN))
        .addLabel('b0')
        .to(q('.l2'), Object.assign({ duration:.8 }, IN))
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

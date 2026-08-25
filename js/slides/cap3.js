/* ============================================================
   ACTO III — Visión (S16–S23) · negro, dorado, cinematográfico
   ============================================================ */
(function(){
  'use strict';

  /* ---------- S16 · HIPERENFOCARSE ---------- */
  DECK.register({
    id:'s16', theme:'dark', themeDur:.5, themeEase:'power2.in',
    pulse:{ b0:{ state:'punto', dur:.95, ease:'power4.inOut' } },
    build(ctx){
      const q = ctx.q;
      const word = q('.word')[0];
      if(!word.dataset.split){
        word.innerHTML = word.textContent.trim().split('')
          .map(c=>'<span>'+c+'</span>').join('');
        word.dataset.split = '1';
      }
      const chars = word.querySelectorAll('span');
      const mid = (chars.length-1)/2;
      chars.forEach((c,i)=>gsap.set(c, { x:(i-mid)*46, autoAlpha:0 }));
      gsap.set(q('.glowpt'), { autoAlpha:0, scale:.55 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.glowpt'), { autoAlpha:1, scale:1, duration:1.3, ease:'power2.out' }, .15)
        .to(chars, { x:0, autoAlpha:1, duration:1.15, ease:'power4.out',
                     stagger:{ each:.024, from:'center' } }, .25)
        .call(()=>ctx.startLoop('glow', ()=>
          gsap.to(q('.glowpt'), { opacity:.72, duration:2.8, yoyo:true,
                                  repeat:-1, ease:'sine.inOut' })))
        .addLabel('b0');
      return tl;
    }
  });

  /* ---------- S17 · ¿Por qué medicina? ---------- */
  DECK.register({
    id:'s17', theme:'dark',
    pulse:{ b0:{ state:'puntoDer', dur:.95, ease:'power3.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1, .l2'), { y:40, autoAlpha:0 });
      gsap.set(q('.chip'), { autoAlpha:0, scale:.88 });
      gsap.set('#s13rays', { autoAlpha:1 });
      gsap.set('#s13rays line', { autoAlpha:0, drawSVG:'0% 0%' });
      const tl = gsap.timeline({ paused:true });
      tl.fromTo(q('.kick'),
          { scale:8.4, x:150, y:270, autoAlpha:0, transformOrigin:'left top' },
          { scale:1, x:0, y:0, autoAlpha:1, duration:1.1, ease:'power3.inOut' })
        .to(q('.l1'), { y:0, autoAlpha:1, duration:.85, ease:'power3.out' }, '-=.35')
        .addLabel('b0')
        .to(q('.l2'), { y:0, autoAlpha:1, duration:.8, ease:'power3.out' })
        .to('#s13rays line', { autoAlpha:.5, drawSVG:'0% 100%', duration:.6,
                               stagger:.1, ease:'power2.out' }, '-=.4')
        .to(q('.chip'), { autoAlpha:1, scale:1, duration:.5,
                          stagger:.11, ease:'back.out(1.7)' }, '-=.5')
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S18 · Ciclo de perfeccionamiento ---------- */
  DECK.register({
    id:'s18', theme:'dark',
    pulse:{ b0:{ state:'loop', dur:1.25, ease:'power3.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1'), { y:40, autoAlpha:0 });
      gsap.set(q('.lp'), { autoAlpha:0, scale:.9 });
      gsap.set('#orbitDot', { autoAlpha:0 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), { y:0, autoAlpha:1, duration:.85, ease:'power3.out' })
        .addLabel('b0')
        .to(q('.lp'), { autoAlpha:1, scale:1, duration:.5,
                        stagger:.13, ease:'power3.out' })
        .call(()=>ctx.startLoop('orbit', ()=>{
          gsap.set('#orbitDot', { autoAlpha:1 });
          return gsap.to('#orbitDot', {
            motionPath:{ path:'#pulsePath', align:'#pulsePath', alignOrigin:[.5,.5] },
            duration:8, ease:'none', repeat:-1 });
        }))
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S19 · Dónde estamos ---------- */
  DECK.register({
    id:'s19', theme:'dark',
    pulse:{ b0:{ state:'escalera', dur:1.3, ease:'power3.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.title'), { autoAlpha:0, y:36 });
      gsap.set(q('.stage3'), { autoAlpha:0, y:30 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.title'), { autoAlpha:1, y:0, duration:.85, ease:'power3.out' })
        .addLabel('b0')
        .to(q('.stage3'), { autoAlpha:1, y:0, duration:.65,
                            stagger:.18, ease:'power3.out' })
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S20 · De medicina a tecnología transversal ---------- */
  DECK.register({
    id:'s20', theme:'dark',
    pulse:{ b0:{ state:'ramas', dur:1.3, ease:'power3.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1'), { y:40, autoAlpha:0 });
      gsap.set(q('.origin'), { autoAlpha:0, scale:.9 });
      gsap.set(q('.bl'), { autoAlpha:0, x:-18 });
      gsap.set('#s15branches', { autoAlpha:1 });
      gsap.set('#s15branches path', { autoAlpha:0, drawSVG:'0% 0%' });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), { y:0, autoAlpha:1, duration:.85, ease:'power3.out' })
        .to(q('.origin'), { autoAlpha:1, scale:1, duration:.6, ease:'back.out(1.7)' }, '-=.3')
        .addLabel('b0')
        .to('#s15branches path', { autoAlpha:.55, drawSVG:'0% 100%', duration:.9,
                                   stagger:.16, ease:'power2.inOut' })
        .to(q('.bl'), { autoAlpha:1, x:0, duration:.55,
                        stagger:.12, ease:'power3.out' }, '-=.7')
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S21 · La interfaz cambia el mercado ---------- */
  DECK.register({
    id:'s21', theme:'dark',
    pulse:{ b0:{ state:'eras', dur:1.3, ease:'power3.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1, .l2'), { y:36, autoAlpha:0 });
      gsap.set(q('.era'), { autoAlpha:0, x:-44 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), { y:0, autoAlpha:1, duration:.85, ease:'power3.out' })
        .addLabel('b0')
        .to(q('.era'), { autoAlpha:1, x:0, duration:.6,
                         stagger:{ each:.16, from:'end' }, ease:'power3.out' })
        .addLabel('b1')
        .to(q('.l2'), { y:0, autoAlpha:1, duration:.75, ease:'power3.out' })
        .to(q('.era.next'), {
            borderColor:'rgba(212,169,84,.65)',
            boxShadow:'0 0 60px -12px rgba(212,169,84,.35)',
            duration:.7, ease:'power2.out' }, '-=.4')
        .fromTo(q('.era.next .yr'), { scale:1 },
            { scale:1.18, duration:.45, yoyo:true, repeat:1, ease:'power2.inOut' }, '<')
        .addLabel('b2');
      return tl;
    }
  });

  /* ---------- S22 · Cierre ---------- */
  DECK.register({
    id:'s22', theme:'dark',
    pulse:{ b0:{ state:'horizonte', dur:1.6, ease:'power2.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.l1, .l2'), { y:36, autoAlpha:0 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.l1'), { y:0, autoAlpha:1, duration:1, ease:'power2.out' }, .3)
        .addLabel('b0')
        .to(q('.l2'), { y:0, autoAlpha:1, duration:.9, ease:'power2.out' })
        .call(()=>ctx.startLoop('lat', ()=>{
          const t = gsap.timeline({ repeat:-1 });
          t.call(()=>PULSE.blip({ y:640, scale:1, dur:3, color:'var(--cyan)' }))
           .to({}, { duration:14 });
          return t;
        }))
        .addLabel('b1');
      return tl;
    }
  });

  /* ---------- S23 · Marca final ----------
     El pago de todo el hilo: la línea que abrió como signo vital
     se cierra convertida en la sonrisa de la marca.               */
  DECK.register({
    id:'s23', theme:'dark',
    pulse:{ b0:{ state:'sonrisa', dur:1.5, ease:'power3.inOut' } },
    build(ctx){
      const q = ctx.q;
      gsap.set(q('.endlogo'), { autoAlpha:0, y:26 });
      gsap.set(q('.endiu'),   { autoAlpha:0, y:22 });
      const tl = gsap.timeline({ paused:true });
      tl.to(q('.endlogo'), { autoAlpha:1, y:0, duration:1.1, ease:'power2.out' }, .9)
        .addLabel('b0')
        .to(q('.endiu'), { autoAlpha:1, y:0, duration:.9, ease:'power2.out' })
        .call(()=>ctx.startLoop('blink', ()=>{
          const t = gsap.timeline({ repeat:-1, repeatDelay:4.6 });
          t.to(q('.endiu line'), { scaleY:.1, transformOrigin:'center bottom', duration:.09 })
           .to(q('.endiu line'), { scaleY:1, duration:.11 });
          return t;
        }))
        .addLabel('b1');
      return tl;
    }
  });
})();

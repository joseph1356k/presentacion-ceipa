/* ============================================================
   PULSE — el hilo conductor de toda la presentación.
   Una sola línea lógica renderizada por 3 paths superpuestos
   (glow suave / glow medio / trazo núcleo) que morfan al unísono.
   API:
     PULSE.morphTo(name|{d,o}, dur, ease) → tween (avance en vivo)
     PULSE.jumpTo(name|{d,o})             → estado instantáneo (restore)
     PULSE.draw(dur, ease)                → dibuja el trazo actual 0→100%
     PULSE.blip(opts)                     → latido que cruza la pantalla
   Coordenadas: canvas fijo 1920×1080; la línea sangra ±60px.
   ============================================================ */
(function(){
  'use strict';

  /* Latido ECG clásico centrado en cx sobre la línea base y. */
  function beat(cx, y, s){
    return 'L' + (cx-75) + ',' + y +
      ' Q' + (cx-58) + ',' + (y-12*s) + ' ' + (cx-42) + ',' + y +
      ' L' + (cx-30) + ',' + (y+7*s) +
      ' L' + (cx-16) + ',' + (y-82*s) +
      ' L' + (cx-2)  + ',' + (y+32*s) +
      ' L' + (cx+8)  + ',' + y +
      ' Q' + (cx+30) + ',' + (y-17*s) + ' ' + (cx+52) + ',' + y +
      ' L' + (cx+75) + ',' + y;
  }

  const STATES = {

    /* s01 — standby: la línea espera, casi apagada */
    reposo: { o:.16, d:'M-60,690 L1980,690' },

    /* s04 — el tronco se detiene: el costo se reparte (abanico en #s04fan) */
    tronco: { o:1, d:
      'M-60,636 C180,636 380,634 560,632 C640,631 690,630 726,630'
    },

    /* s10 — la senda por la que IÜ recorre las tareas (a la altura de su centro) */
    senda: { o:1, d:
      'M-60,700 C240,700 420,694 700,696 C1000,698 1300,700 1560,698' +
      ' C1720,697 1860,700 1980,700'
    },

    /* s12 — la línea sube a un punto de revisión y continúa */
    revision: { o:1, d:
      'M-60,700 C240,700 460,698 690,696 C800,695 848,556 960,556' +
      ' C1072,556 1120,695 1230,696 C1460,698 1740,690 1980,684'
    },

    /* s19 — escalera: hoy → puliendo → visión */
    escalera: { o:1, d:
      'M-60,812 L540,812 C606,812 620,660 686,660 L1176,660' +
      ' C1242,660 1256,508 1322,508 L1980,508'
    },

    /* s23 — el pulso se convierte en la sonrisa de Miracle.
       Ancho y grosor calcados de la proporción del logo (≈24% de caída,
       trazo ≈6% del ancho) y asentados justo bajo el wordmark. */
    sonrisa: { o:1, w:5, d:'M830,610 Q960,734 1090,610' },

    /* s02·b0 y s05·b0 — pulso vital en calma */
    pulso: { o:1, d:
      'M-60,690 L420,690' + beat(520,690,1) +
      ' L900,690'  + beat(1000,690,1) +
      ' L1380,690' + beat(1480,690,1) +
      ' L1980,690'
    },

    /* s05·b1 — el pulso se traba: tartamudeo irregular a la derecha */
    trabado: { o:1, d:
      'M-60,690 L420,690' + beat(520,690,1) +
      ' L900,690'  + beat(1000,690,1.06) +
      ' L1330,690 L1352,676 L1374,700 L1396,682 L1418,694 L1440,688' +
      ' L1470,690 L1484,652 L1498,716 L1512,668 L1526,702 L1540,684 L1556,692' +
      ' L1620,690 L1980,690'
    },

    /* s03·b0 — tensión creciente de izquierda a derecha */
    tension: { o:1, d:
      'M-60,640 C160,640 300,634 440,640' +
      ' L520,626 L590,652 L660,630' +
      ' L740,656 L810,616 L880,660' +
      ' L950,608 L1020,668 L1090,600' +
      ' L1170,672 L1250,592 L1330,668' +
      ' C1480,652 1720,648 1980,650'
    },

    /* s03·b2 — el nudo se forma: primera vez que la línea se enreda */
    nudo: { o:1, d:
      'M-60,640 C180,640 380,636 560,646 C700,654 860,662 985,640' +
      ' L1075,575 L1350,715 L1175,520 L1135,730 L1385,600' +
      ' L1070,625 L1320,500 L1290,745 L1110,535 L1400,675 L1050,695' +
      ' L1230,485 L1340,705' +
      ' C1470,678 1600,656 1700,652 C1800,650 1880,650 1980,650'
    },

    /* s02·b1 — enterrada: el signo vital pierde amplitud y luz a medida que
       avanza hacia las ventanas. NO se enreda: el nudo todavía no existe,
       se forma una slide después con los cinco frentes de la consulta. */
    enterrada: { o:.32, d:
      'M-60,828 L360,828' + beat(460,828,.9) +
      ' L800,836' + beat(900,840,.38) +
      ' L1300,848 L1600,852 L1980,854'
    },

    /* s06 — una respiración: onda suave, sola en el centro */
    respira: { o:.42, d:
      'M-60,560 C160,560 260,542 480,542 C700,542 740,578 960,578' +
      ' C1180,578 1220,542 1440,542 C1660,542 1760,560 1980,560'
    },

    /* s07 — renace: pulso pleno y seguro bajo la tesis */
    renace: { o:1, d:
      'M-60,876 L400,876' + beat(500,876,1.12) +
      ' L860,876'  + beat(960,876,1.2) +
      ' L1320,876' + beat(1420,876,1.12) +
      ' L1980,876'
    },

    /* s08 — el pulso se endereza: línea de evolución */
    timeline: { o:1, d:
      'M-60,620 C300,620 500,618 760,618 C1100,618 1400,616 1980,614'
    },

    /* s09·b0 — separados: la línea espera abajo, todavía no conecta nada */
    separados: { o:.16, d:'M-60,832 L1980,832' },

    /* s09·b1 — canal: la línea sube y atraviesa la capa de lado a lado */
    canal: { o:1, d:'M-60,694 L1980,694' },

    /* (sin uso) — tejido: versión previa de la s09 */
    tejido: { o:1, d:
      'M-60,540 C220,540 380,432 520,432 C680,432 780,620 960,620' +
      ' C1140,620 1240,432 1400,432 C1540,432 1720,516 1980,516'
    },

    /* s11 — pipeline operativo */
    pipeline: { o:1, d:
      'M-60,640 C400,640 900,638 1980,636'
    },

    /* s13 — la línea entra al portal (termina dentro de la ventana) */
    portalIn: { o:1, d:
      'M-60,660 C220,660 360,646 470,630 C580,614 700,594 810,586 C870,582 910,580 942,580'
    },

    /* s14 — la línea atraviesa la ventana y sale hacia los sistemas */
    portalThrough: { o:1, d:
      'M-60,620 C260,620 400,606 540,600 L1380,596 C1560,594 1740,560 1980,540'
    },

    /* s15 — la línea trepa y se instala DENTRO de la banda superior (bajo su
       etiqueta). No se mueve: son las capas las que se reordenan a su
       alrededor, así que al final queda atravesando «intención». */
    capaAlta: { o:1, d:
      'M-60,720 C120,720 220,388 400,386 L1240,386 C1520,382 1740,360 1980,344'
    },

    /* s16 — convergencia total: el punto */
    punto: { o:1, d:
      'M948,540 C948,532 972,532 972,540 C972,548 948,548 948,540'
    },

    /* s17 — el punto, sostenido a la derecha del argumento */
    puntoDer: { o:1, d:
      'M1298,570 C1298,562 1322,562 1322,570 C1322,578 1298,578 1298,570'
    },

    /* s18 — el ciclo */
    loop: { o:1, d:
      'M960,380 C1082,380 1180,478 1180,600 C1180,722 1082,820 960,820 C838,820 740,722 740,600 C740,478 838,380 960,380'
    },

    /* s20 — el tronco que se ramifica desde medicina */
    ramas: { o:1, d:
      'M-60,620 C240,620 420,612 600,604 C760,597 860,570 950,540 C1060,503 1180,440 1330,392 C1490,341 1720,318 1980,308'
    },

    /* (sin uso) — la s21 esconde el hilo: se sostiene sola */
    eras: { o:1, d:
      'M-60,880 C280,880 380,864 520,856 C700,846 740,592 900,584 C1040,577 1080,364 1240,358 C1400,352 1620,320 1980,300'
    },

    /* s21·oculto y s22 — horizonte */
    horizonte: { o:1, d:'M-60,640 L1980,640' }
  };

  let _els = null;
  function els(){
    if(!_els){
      _els = {
        core:  document.getElementById('pulsePath'),
        layers:[...document.querySelectorAll('.pulse-l')],
        group: document.getElementById('pulseG')
      };
    }
    return _els;
  }
  function syncLayers(){
    const e = els(), d = e.core.getAttribute('d');
    for(const p of e.layers){ if(p !== e.core) p.setAttribute('d', d); }
  }
  function resolve(s){ return (typeof s === 'string') ? STATES[s] : s; }

  const PULSE = {
    STATES,
    current: null,

    /* Estado instantáneo — restores, retrocesos, recarga por hash */
    jumpTo(state){
      const st = resolve(state); if(!st) return;
      const e = els();
      gsap.killTweensOf([e.core, e.group, e.layers]);
      e.core.setAttribute('d', st.d);
      syncLayers();
      gsap.set(e.layers, { drawSVG:'0% 100%' });
      gsap.set(e.core,  { strokeWidth: 3.2 * (st.w || 1) });
      gsap.set(e.group, { opacity: st.o == null ? 1 : st.o, x:0, y:0 });
      PULSE.current = state;
    },

    /* Morph en vivo — avance normal de la charla */
    morphTo(state, dur, ease){
      const st = resolve(state); if(!st) return null;
      const e = els();
      gsap.killTweensOf(e.core);
      gsap.to(e.group, { opacity: st.o == null ? 1 : st.o, x:0, y:0,
                         duration:(dur||1)*.9, ease: ease||'power2.inOut', overwrite:'auto' });
      gsap.to(e.core, { strokeWidth: 3.2 * (st.w || 1),
                        duration:(dur||1), ease: ease||'power2.inOut' });
      PULSE.current = state;
      return gsap.to(e.core, {
        morphSVG:{ shape: st.d, shapeIndex:'auto' },
        duration: dur||1, ease: ease||'power2.inOut',
        onUpdate: syncLayers, onComplete: syncLayers
      });
    },

    /* Dibuja el trazo actual de 0 a 100% (apertura, renacimiento) */
    draw(dur, ease){
      const e = els();
      gsap.set(e.layers, { drawSVG:'0% 0%' });
      return gsap.to(e.layers, { drawSVG:'0% 100%', duration: dur||1.6, ease: ease||'power2.inOut' });
    },

    /* Un latido que cruza la pantalla sobre una línea base y. */
    blip(opts){
      const o = opts || {};
      const g = document.getElementById('blipG');
      const s = o.scale || 1;
      const d = 'M0,0 L28,0 Q36,' + (-7*s) + ' 44,0 L52,' + (5*s) + ' L62,' + (-56*s) +
                ' L72,' + (22*s) + ' L80,0 Q92,' + (-10*s) + ' 104,0 L130,0';
      g.querySelectorAll('path').forEach(p => {
        p.setAttribute('d', d);
        p.style.stroke = o.color || 'var(--cyan)';
      });
      gsap.set(g, { attr:{ transform:'translate(-160,' + (o.y||640) + ')' }, opacity:0 });
      const tl = gsap.timeline({ delay: o.delay || 0 });
      tl.to(g, { opacity:1, duration:.3, ease:'none' }, 0)
        .to(g, { attr:{ transform:'translate(2000,' + (o.y||640) + ')' }, duration: o.dur||2.6, ease:'power1.inOut' }, 0)
        .to(g, { opacity:0, duration:.4, ease:'none' }, (o.dur||2.6) - .4);
      return tl;
    }
  };

  window.PULSE = PULSE;
})();

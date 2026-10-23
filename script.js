// Vadevac Travel Pigüé
document.documentElement.classList.add('js');

const WA = '5492923487848';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- menú móvil ---------- */
const menuBtn = document.querySelector('.bar-menu');
const menu = document.getElementById('menu-movil');
if (menuBtn && menu) {
  const close = () => { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Menú'; };
  menuBtn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Cerrar' : 'Menú';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { close(); menuBtn.focus(); } });
}

/* ---------- hero: fotos que se funden (opacidad, corre también con movimiento reducido) ---------- */
const slides = [...document.querySelectorAll('.hero-photo')];
const heroPause = document.querySelector('.hero-pause');
let slide = 0, slideTimer = null;
const nextSlide = () => {
  slides[slide].classList.remove('is-on');
  slide = (slide + 1) % slides.length;
  const img = slides[slide].querySelector('img');
  img.loading = 'eager';
  slides[slide].classList.add('is-on');
};
const startSlides = () => { if (!slideTimer && slides.length > 1) slideTimer = setInterval(nextSlide, 6000); };
const stopSlides = () => { clearInterval(slideTimer); slideTimer = null; };
startSlides();
heroPause?.addEventListener('click', () => {
  const paused = heroPause.getAttribute('aria-pressed') === 'true';
  if (paused) { startSlides(); heroPause.textContent = 'Pausar fotos'; }
  else { stopSlides(); heroPause.textContent = 'Seguir fotos'; }
  heroPause.setAttribute('aria-pressed', String(!paused));
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopSlides();
  else if (heroPause?.getAttribute('aria-pressed') !== 'true') startSlides();
});

/* ---------- video de Ville de Rodez: se reproduce siempre, con botón Pausar ---------- */
const video = document.querySelector('.run-video');
const videoBtn = document.querySelector('.video-pause');
if (video) {
  video.muted = true;
  const tryPlay = () => video.play().catch(() => {});
  tryPlay();
  new IntersectionObserver(([e]) => {
    if (videoBtn.getAttribute('aria-pressed') === 'true') return;
    e.isIntersecting ? tryPlay() : video.pause();
  }, { threshold: 0.2 }).observe(video);
  videoBtn.addEventListener('click', () => {
    if (video.paused) { tryPlay(); videoBtn.textContent = 'Pausar video'; videoBtn.setAttribute('aria-pressed', 'false'); }
    else { video.pause(); videoBtn.textContent = 'Seguir video'; videoBtn.setAttribute('aria-pressed', 'true'); }
  });
}

/* ---------- Elegí tu cerro ---------- */
const SALIDAS = {
  rodez: {
    title: 'Ville de Rodez', lvl: 2, level: 'Media-baja',
    img: 'assets/img/ville-de-rodez-pileton.webp',
    alt: 'El piletón de Ville de Rodez al pie de la quebrada, con agua verde y rocas',
    lead: 'Una quebrada con una caída de agua, álamos que cortan el viento serrano y un piletón donde almorzamos. Se puede pasar por detrás de la cascada.',
    time: '10:00, Tenis Club Pigüé',
    back: '16:00 aprox., según el ritmo del grupo',
    incl: 'Entrada al campo, seguro de accidentes personales y snack de marcha',
    price: 'Lorem ipsum: consultá por WhatsApp',
    bag: ['Equipo de mate', '1,5 litros de agua', 'Almuerzo']
  },
  curamalal: {
    title: 'Cerro Cura Malal Grande', lvl: 3, level: 'Media-alta',
    img: 'assets/img/salida-cura-malal-grande.webp',
    alt: 'Grupo de Vadevac en la ladera del Cura Malal Grande, con el cerro detrás',
    lead: 'La cumbre más alta de las Sierras de Cura Malal, 1049 metros. Arriba se ven lagunas, campos y los pueblos de toda la zona; una vez nos cruzamos con un águila mora.',
    time: '07:45, Tenis Club Pigüé',
    back: '17:00 aprox. No incluye traslado',
    incl: 'Ingreso al establecimiento, snack de marcha, botiquín, seguro y coordinación',
    price: 'Lorem ipsum: consultá por WhatsApp. Cupos limitados',
    bag: ['2,5 litros de agua', 'Almuerzo', 'Calzado de trekking']
  },
  // A CONFIRMAR: horario, vuelta, qué incluye y mochila del Destierro Primero y del Hueco de la Paloma (no salen en sus posteos)
  destierro: {
    title: 'Cerro Destierro Primero', lvl: 4, level: 'Alta',
    img: 'assets/img/salida-destierro-primero.webp',
    alt: 'Cuatro caminantes en la cumbre rocosa del Destierro Primero, con el valle detrás',
    lead: 'Uno de los grandes desafíos de nuestras sierras: un ascenso largo y parejo, con vista a las grandes cumbres, lagunas y pueblos. Arriba, mates, comida y hasta una siesta.',
    time: 'Lorem ipsum, Tenis Club Pigüé',
    back: 'Lorem ipsum',
    incl: 'Lorem ipsum dolor sit amet',
    price: 'Lorem ipsum: consultá por WhatsApp',
    bag: ['Agua de sobra', 'Almuerzo', 'Calzado de trekking', 'Abrigo para la cumbre']
  },
  paloma: {
    title: 'Hueco de la Paloma', lvl: 0, level: 'Dificultad a confirmar',
    img: 'assets/img/salida-hueco-de-la-paloma.webp',
    alt: 'Arroyo con agua entre piedras y caminantes en el Hueco de la Paloma',
    lead: 'Arroyos llenos de agua, mucha vegetación y almuerzo a la orilla. Lo hicimos como segundo día del fin de semana, después de dormir en un alojamiento de la sierra.',
    time: 'Lorem ipsum',
    back: 'Después del mediodía',
    incl: 'Lorem ipsum dolor sit amet',
    price: 'Lorem ipsum: consultá por WhatsApp',
    bag: ['Agua', 'Almuerzo', 'Calzado que se pueda mojar']
  }
};

const picker = document.querySelector('[data-picker]');
if (picker) {
  const panel = picker.querySelector('.panel');
  const f = name => panel.querySelector(`[data-f="${name}"]`);
  const tabs = [...picker.querySelectorAll('.pick')];
  let current = 'rodez', people = 2;

  const updateBag = () => {
    const boxes = [...f('bag').querySelectorAll('input')];
    const missing = boxes.filter(b => !b.checked).length;
    f('bagnote').textContent = missing === 0 ? 'Mochila lista. Nos vemos en el Tenis Club.'
      : missing === 1 ? 'Te falta 1 cosa.' : `Te faltan ${missing} cosas.`;
  };
  const updateWa = () => {
    const s = SALIDAS[current];
    f('n').textContent = people;
    const quien = people === 1 ? '1 persona' : `${people} personas`;
    f('wa').textContent = `Reservar lugar para ${people}`;
    f('wa').href = `https://wa.me/${WA}?text=` + encodeURIComponent(`Hola Vadevac! Queremos reservar la salida a ${s.title} para ${quien}. ¿Cuándo es la próxima fecha y cuánto sale?`);
  };
  const render = id => {
    const s = SALIDAS[id];
    f('title').textContent = s.title;
    f('lead').textContent = s.lead;
    f('level').textContent = s.level;
    f('bar').setAttribute('style', `--lvl:${s.lvl}`);
    f('time').textContent = s.time;
    f('back').textContent = s.back;
    f('incl').textContent = s.incl;
    f('price').textContent = s.price;
    f('img').src = s.img; f('img').alt = s.alt;
    f('bag').innerHTML = s.bag.map(b => `<label><input type="checkbox"> ${b}</label>`).join('');
    updateBag(); updateWa();
  };
  const select = (id, focus) => {
    if (id === current) return;
    current = id;
    tabs.forEach(t => {
      const on = t.dataset.id === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) { panel.setAttribute('aria-labelledby', t.id); if (focus) t.focus(); }
    });
    panel.classList.add('is-swapping');
    setTimeout(() => { render(id); panel.classList.remove('is-swapping'); }, 260);
  };
  tabs.forEach((t, i) => {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', () => select(t.dataset.id));
    t.addEventListener('keydown', e => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      const n = tabs[(i + k + tabs.length) % tabs.length];
      select(n.dataset.id, true);
    });
  });
  panel.addEventListener('change', e => { if (e.target.matches('input[type=checkbox]')) updateBag(); });
  panel.querySelectorAll('.step').forEach(b => b.addEventListener('click', () => {
    people = Math.min(30, Math.max(1, people + Number(b.dataset.step)));
    updateWa();
  }));
  // precarga de las fotos de las otras salidas
  Object.values(SALIDAS).forEach(s => { const i = new Image(); i.src = s.img; });
  render('rodez');
}

/* ---------- perfil del terreno Pigüé → Cura Malal Grande (Copernicus DEM 90 m vía Open-Meteo) ---------- */
const ELE = [291,291,291,292,293,294,294,295,295,297,298,301,303,305,306,306,307,310,310,310,310,311,314,316,318,320,321,322,323,325,326,328,330,331,334,336,341,344,348,353,359,368,376,379,384,395,402,393,398,378,379,374,370,370,371,373,374,376,378,381,383,384,386,387,389,392,391,392,394,395,399,399,401,404,405,412,404,394,393,400,404,411,417,424,431,443,440,439,440,441,433,440,448,459,463,468,471,443,435,433,445,462,498,532,584,588,566,593,577,628,621,542,570,624,688,711,642,586,596,563,586,665,652,589,620,672,623,597,639,662,656,651,690,685,687,725,734,765,823,892,891,941,986,978,967,951,905,810,782,748,737,654,644,716,736,786,853,929,889,758];
const KM = 22.06, PEAK = 142;
const prof = document.querySelector('[data-profile]');
if (prof) {
  const W = 1000, H = 420, lo = 200, hi = 1050;
  const x = i => (i / (ELE.length - 1)) * W;
  const y = e => H - ((e - lo) / (hi - lo)) * H;
  const path = 'M0,' + H + ' ' + ELE.map((e, i) => `L${x(i).toFixed(1)},${y(e).toFixed(1)}`).join(' ') + ` L${W},${H} Z`;
  prof.querySelector('.profile-fill').setAttribute('d', path);
  const home = prof.querySelector('.profile-home');
  home.setAttribute('cx', 0); home.setAttribute('cy', y(ELE[0]));
  const cursor = prof.querySelector('.profile-cursor');
  const dot = prof.querySelector('.profile-dot');
  const range = prof.querySelector('.profile-range');
  const alt = prof.querySelector('[data-p="alt"]');
  const km = prof.querySelector('[data-p="km"]');
  const fmt = n => n.toLocaleString('es-AR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const show = i => {
    cursor.setAttribute('x1', x(i)); cursor.setAttribute('x2', x(i));
    dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(ELE[i]));
    alt.textContent = `${ELE[i]} m`;
    const d = (i / (ELE.length - 1)) * KM;
    km.textContent = i === 0 ? 'en Lavalle 56, Pigüé'
      : i === PEAK ? `cumbre del Cura Malal Grande, a ${fmt(d)} km`
      : i > PEAK ? `del otro lado de la cumbre, a ${fmt(d)} km` : `a ${fmt(d)} km de Lavalle 56`;
  };
  range.addEventListener('input', () => show(Number(range.value)));
  show(PEAK);
  // una pasada sola al entrar: del pueblo a la cumbre
  if (!reduce) {
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      let i = 0;
      const t = setInterval(() => { show(i); range.value = i; i += 2; if (i > PEAK) { clearInterval(t); show(PEAK); range.value = PEAK; } }, 22);
    }, { threshold: 0.6 }).observe(prof);
  }
}

/* ---------- hora en Pigüé ---------- */
const clock = document.querySelector('[data-clock]');
if (clock) {
  const tick = () => { clock.textContent = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date()); };
  tick(); setInterval(tick, 30000);
}

/* ---------- entradas escalonadas ---------- */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const sibs = [...e.target.parentElement.querySelectorAll(':scope > .reveal')];
      e.target.style.setProperty('--d', `${Math.max(0, sibs.indexOf(e.target)) * 80}ms`);
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(r => io.observe(r));
} else reveals.forEach(r => r.classList.add('is-in'));

/* ---------- compartir ---------- */
document.querySelector('.share')?.addEventListener('click', async e => {
  const data = { title: 'Vadevac Travel Pigüé', text: 'Viajes a medida y salidas a las Sierras de Cura Malal', url: location.href };
  if (navigator.share) { try { await navigator.share(data); } catch (_) {} return; }
  try { await navigator.clipboard.writeText(location.href); e.target.textContent = 'Link copiado'; } catch (_) {}
});

/* ---------- WhatsApp fijo en celular, aparece pasado el hero ---------- */
const wa = document.querySelector('.wa-fixed');
const hero = document.querySelector('.hero');
if (wa && hero) new IntersectionObserver(([e]) => wa.classList.toggle('is-on', !e.isIntersecting)).observe(hero);

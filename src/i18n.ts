import { ref, computed } from 'vue';

export type Lang = 'it' | 'en';

// telefono/tablet (dito) o computer (mouse): i suggerimenti cambiano parole
export const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
const dev = (touch: string, mouse: string): string => (isTouch ? touch : mouse);

const messages = {
  it: {
    nav: { work: 'Progetti', lab: 'Lab', services: 'Servizi', about: 'Chi sono', contacts: 'Contatti' },
    hero: {
      kicker: 'Full-Stack Developer',
      title1: 'Web app veloci,',
      title2: 'fatte per essere usate.',
      lead: 'Progetto e costruisco siti e web app: dal database al 3D, dal server al telefono.',
      cta: 'Guarda i progetti',
      cta2: 'Scrivimi',
      scroll: 'Scorri',
    },
    work: {
      label: 'Progetti',
      title: 'Cose vere, usate ogni giorno.',
      open: 'Apri il sito',
      private: 'Uso privato',
      items: [
        {
          name: 'RoyaleCalculator',
          tag: 'Web app pubblica',
          text: 'Ti dice il mazzo migliore di Clash Royale con le carte che hai, analizzando ogni giorno le partite dei top player.',
          metric: '~6.700',
          metricLabel: 'partite analizzate ogni giorno',
          stack: ['JavaScript', 'Vercel', 'GitHub Actions', 'API REST'],
          url: 'https://royalecalculator.com',
        },
        {
          name: 'Offerte Spesa',
          tag: 'PWA + Firebase',
          text: 'Ogni mattina legge i volantini dei supermercati, li trasforma in un catalogo cercabile e in una lista della spesa condivisa.',
          metric: '400+',
          metricLabel: 'offerte lette ogni mattina, in automatico',
          stack: ['Vue', 'Quasar', 'Firebase', 'Playwright'],
          url: '',
        },
        {
          name: 'Reel Studio',
          tag: 'Tool interno',
          text: 'Monta reel per Instagram partendo da foto e video su Google Drive: scrivi le istruzioni, lui monta, tu rivedi ed esporti.',
          metric: '1 clic',
          metricLabel: 'da cartella Drive a video pronto',
          stack: ['Quasar', 'FastAPI', 'Python', 'Google Drive API'],
          url: '',
        },
      ],
    },
    lab: {
      label: 'Lab',
      title: 'Demo dal vivo. Toccale.',
      lead: 'Piccoli esperimenti che girano qui, nel browser del tuo telefono.',
      tabs: { three: '3D', shader: 'Shader', realtime: 'Realtime' },
    },
    showcase: {
      drag: dev('Trascina col dito per ruotare', 'Clicca e trascina per ruotare'),
      explore: 'Esplora a schermo intero',
      close: 'Chiudi',
      pinch: dev('Un dito ruota, due dita ingrandiscono', 'Trascina per ruotare, rotella per ingrandire'),
      loading: 'Carico il modello…',
      finishes: 'Finitura',
      finish: { original: 'Originale', clay: 'Argilla', bronze: 'Bronzo', resin: 'Resina' },
      credit: 'Modelli: Smithsonian Open Access (CC0)',
    },
    shader: {
      hint: dev('Muovi il dito sopra', 'Muovi il mouse e clicca'),
      caption: 'Un fragment shader GLSL scritto a mano: ogni pixel calcolato dalla GPU, 60 volte al secondo.',
    },
    realtime: {
      title: 'Ordini oggi',
      live: 'Live',
      perMin: 'al minuto',
      latency: 'latenza',
      caption: 'Dashboard che si aggiorna da sola, come con Firestore. Dati simulati.',
      cities: ['Milano', 'Roma', 'Firenze', 'Torino', 'Bologna', 'Napoli', 'Pisa', 'Lucca'],
      order: 'Nuovo ordine',
    },
    services: {
      label: 'Cosa faccio',
      title: "Dall'idea al sito online.",
      items: [
        { icon: 'ri-layout-masonry-line', title: 'Siti e landing', text: 'Veloci, chiari, pensati prima per il telefono.' },
        { icon: 'ri-apps-2-line', title: 'Web app e gestionali', text: 'Login, dati in tempo reale, pannelli su misura.' },
        { icon: 'ri-robot-2-line', title: 'Automazioni', text: 'Script e job che lavorano da soli ogni giorno.' },
        { icon: 'ri-box-3-line', title: '3D e interattivo', text: 'Prodotti da girare col dito, esperienze che si ricordano.' },
      ],
    },
    skills: { label: 'Strumenti' },
    about: {
      label: 'Chi sono',
      title: 'Lorenzo Neri',
      text: 'Sviluppatore full-stack. Costruisco web app con Vue.js, Firebase e Three.js: interfacce veloci, dati in tempo reale, hosting incluso. Mi piace far sembrare semplici le cose complicate.',
    },
    contacts: {
      label: 'Contatti',
      title: 'Parliamo del tuo progetto.',
      lead: 'Una chiamata, un caffè, un messaggio: rispondo in giornata.',
      copied: 'Email copiata negli appunti',
      copyError: 'Copia non riuscita, scrivimi dal pulsante Email',
      tapCopy: dev('Tocca per copiare', 'Clicca per copiare'),
    },
    footer: 'Fatto a mano, pixel per pixel.',
  },
  en: {
    nav: { work: 'Work', lab: 'Lab', services: 'Services', about: 'About', contacts: 'Contact' },
    hero: {
      kicker: 'Full-Stack Developer',
      title1: 'Fast web apps,',
      title2: 'built to be used.',
      lead: 'I design and build websites and web apps: from database to 3D, from server to phone.',
      cta: 'See the work',
      cta2: 'Get in touch',
      scroll: 'Scroll',
    },
    work: {
      label: 'Work',
      title: 'Real things, used every day.',
      open: 'Open site',
      private: 'Private use',
      items: [
        {
          name: 'RoyaleCalculator',
          tag: 'Public web app',
          text: 'Finds your best Clash Royale deck with the cards you own, analysing top players’ matches every day.',
          metric: '~6,700',
          metricLabel: 'matches analysed every day',
          stack: ['JavaScript', 'Vercel', 'GitHub Actions', 'REST API'],
          url: 'https://royalecalculator.com',
        },
        {
          name: 'Offerte Spesa',
          tag: 'PWA + Firebase',
          text: 'Every morning it reads supermarket flyers and turns them into a searchable catalog and a shared shopping list.',
          metric: '400+',
          metricLabel: 'deals read every morning, automatically',
          stack: ['Vue', 'Quasar', 'Firebase', 'Playwright'],
          url: '',
        },
        {
          name: 'Reel Studio',
          tag: 'Internal tool',
          text: 'Edits Instagram reels from photos and videos on Google Drive: write instructions, it edits, you review and export.',
          metric: '1 click',
          metricLabel: 'from Drive folder to finished video',
          stack: ['Quasar', 'FastAPI', 'Python', 'Google Drive API'],
          url: '',
        },
      ],
    },
    lab: {
      label: 'Lab',
      title: 'Live demos. Touch them.',
      lead: 'Small experiments running right here, in your phone’s browser.',
      tabs: { three: '3D', shader: 'Shader', realtime: 'Realtime' },
    },
    showcase: {
      drag: dev('Drag with your finger to rotate', 'Click and drag to rotate'),
      explore: 'Explore full screen',
      close: 'Close',
      pinch: dev('One finger rotates, two fingers zoom', 'Drag to rotate, scroll to zoom'),
      loading: 'Loading model…',
      finishes: 'Finish',
      finish: { original: 'Original', clay: 'Clay', bronze: 'Bronze', resin: 'Resin' },
      credit: 'Models: Smithsonian Open Access (CC0)',
    },
    shader: {
      hint: dev('Move your finger over it', 'Move the mouse and click'),
      caption: 'A hand-written GLSL fragment shader: every pixel computed by the GPU, 60 times a second.',
    },
    realtime: {
      title: 'Orders today',
      live: 'Live',
      perMin: 'per minute',
      latency: 'latency',
      caption: 'A dashboard that updates itself, like with Firestore. Simulated data.',
      cities: ['Milan', 'Rome', 'Florence', 'Turin', 'Bologna', 'Naples', 'Pisa', 'Lucca'],
      order: 'New order',
    },
    services: {
      label: 'What I do',
      title: 'From idea to live site.',
      items: [
        { icon: 'ri-layout-masonry-line', title: 'Websites & landing pages', text: 'Fast, clear, phone-first.' },
        { icon: 'ri-apps-2-line', title: 'Web apps & dashboards', text: 'Login, real-time data, custom admin panels.' },
        { icon: 'ri-robot-2-line', title: 'Automations', text: 'Scripts and jobs that work on their own every day.' },
        { icon: 'ri-box-3-line', title: '3D & interactive', text: 'Products you spin with a finger, experiences people remember.' },
      ],
    },
    skills: { label: 'Tools' },
    about: {
      label: 'About',
      title: 'Lorenzo Neri',
      text: 'Full-stack developer. I build web apps with Vue.js, Firebase and Three.js: fast interfaces, real-time data, hosting included. I like making complicated things feel simple.',
    },
    contacts: {
      label: 'Contact',
      title: "Let's talk about your project.",
      lead: 'A call, a coffee, a message: I reply the same day.',
      copied: 'Email copied to clipboard',
      copyError: 'Copy failed, use the Email button',
      tapCopy: dev('Tap to copy', 'Click to copy'),
    },
    footer: 'Handmade, pixel by pixel.',
  },
} as const;

const initial = (): Lang => {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'it' || saved === 'en') return saved;
  } catch {
    /* storage blocked */
  }
  return navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
};

export const lang = ref<Lang>(initial());
export const t = computed(() => messages[lang.value]);

export const setLang = (l: Lang): void => {
  lang.value = l;
  document.documentElement.lang = l;
  try {
    localStorage.setItem('lang', l);
  } catch {
    /* storage blocked */
  }
};

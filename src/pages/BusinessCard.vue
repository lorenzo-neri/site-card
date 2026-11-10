<template>
    <q-page class="site">
        <BusinessCard3D />

        <div class="progress" :style="{ transform: `scaleX(${progress})` }" />

        <!-- Barra in alto -->
        <header class="topbar" :class="{ solid: scrolled }">
            <a href="#hero" class="logo" translate="no" @click.prevent="go('hero')">LN<span>.</span></a>
            <nav class="links">
                <a v-for="s in navSections" :key="s" :href="`#${s}`" :class="{ active: active === s }"
                    @click.prevent="go(s)">{{ t.nav[s] }}</a>
            </nav>
            <div class="lang" role="group" aria-label="Language" translate="no">
                <button :class="{ on: lang === 'it' }" @click="setLang('it')">IT</button>
                <button :class="{ on: lang === 'en' }" @click="setLang('en')">EN</button>
            </div>
        </header>

        <!-- Hero -->
        <section id="hero" class="hero">
            <div class="wrap">
                <p class="kicker reveal"><span class="dot" /> {{ t.hero.kicker }}</p>
                <h1 class="hero-title reveal">
                    {{ t.hero.title1 }}<br><em>{{ t.hero.title2 }}</em>
                </h1>
                <p class="lead reveal">{{ t.hero.lead }}</p>
                <div class="cta-row reveal">
                    <button class="btn btn-primary" @click="go('work')">
                        <i class="ri-arrow-down-line" /> {{ t.hero.cta }}
                    </button>
                    <button class="btn btn-ghost" @click="go('contacts')">{{ t.hero.cta2 }}</button>
                </div>
            </div>
            <button class="scroll-cue" :aria-label="t.hero.scroll" @click="go('work')">
                <span>{{ t.hero.scroll }}</span>
                <i class="ri-arrow-down-line" />
            </button>
        </section>

        <!-- Progetti -->
        <section id="work" class="section">
            <div class="wrap">
                <p class="label reveal">{{ t.work.label }}</p>
                <h2 class="title reveal">{{ t.work.title }}</h2>
                <div class="projects">
                    <article v-for="(p, i) in t.work.items" :key="p.name" class="project reveal"
                        :style="{ transitionDelay: `${i * 60}ms` }">
                        <div class="project-top">
                            <span class="project-index">0{{ i + 1 }}</span>
                            <span class="project-tag">{{ p.tag }}</span>
                        </div>
                        <h3 class="project-name">{{ p.name }}</h3>
                        <p class="project-text">{{ p.text }}</p>
                        <div class="metric">
                            <span class="metric-value">{{ p.metric }}</span>
                            <span class="metric-label">{{ p.metricLabel }}</span>
                        </div>
                        <ul class="stack" translate="no">
                            <li v-for="s in p.stack" :key="s">{{ s }}</li>
                        </ul>
                        <a v-if="p.url" class="project-link" :href="p.url" target="_blank" rel="noopener">
                            {{ t.work.open }} <i class="ri-arrow-right-up-line" />
                        </a>
                        <span v-else class="project-link muted"><i class="ri-lock-2-line" /> {{ t.work.private }}</span>
                    </article>
                </div>
            </div>
        </section>

        <!-- Lab: demo dal vivo -->
        <section id="lab" class="section">
            <div class="wrap">
                <p class="label reveal">{{ t.lab.label }}</p>
                <h2 class="title reveal">{{ t.lab.title }}</h2>
                <p class="lead reveal">{{ t.lab.lead }}</p>
                <div class="lab-tabs reveal" role="tablist">
                    <button v-for="d in demos" :key="d.id" role="tab" :aria-selected="demo === d.id"
                        :class="{ on: demo === d.id }" @click="demo = d.id">
                        <i :class="d.icon" /> {{ t.lab.tabs[d.id] }}
                    </button>
                </div>
                <div class="reveal">
                    <Showcase3D v-if="demo === 'three'" />
                    <ShaderDemo v-else-if="demo === 'shader'" />
                    <RealtimeDemo v-else />
                </div>
            </div>
        </section>

        <!-- Servizi -->
        <section id="services" class="section">
            <div class="wrap">
                <p class="label reveal">{{ t.services.label }}</p>
                <h2 class="title reveal">{{ t.services.title }}</h2>
                <div class="services">
                    <article v-for="(s, i) in t.services.items" :key="s.title" class="service reveal"
                        :style="{ transitionDelay: `${i * 60}ms` }">
                        <i :class="s.icon" class="service-icon" />
                        <h3>{{ s.title }}</h3>
                        <p>{{ s.text }}</p>
                    </article>
                </div>

                <p class="label small reveal">{{ t.skills.label }}</p>
                <ul class="skills reveal">
                    <li v-for="s in skills" :key="s.name"><i :class="s.icon" /> {{ s.name }}</li>
                </ul>
            </div>
        </section>

        <!-- Chi sono -->
        <section id="about" class="section">
            <div class="wrap about">
                <div class="about-photo reveal">
                    <PhotoAboutMe />
                </div>
                <div>
                    <p class="label reveal">{{ t.about.label }}</p>
                    <h2 class="title reveal">{{ t.about.title }}</h2>
                    <p class="lead reveal">{{ t.about.text }}</p>
                </div>
            </div>
        </section>

        <!-- Contatti -->
        <section id="contacts" class="section contacts">
            <div class="wrap">
                <p class="label reveal">{{ t.contacts.label }}</p>
                <h2 class="title big reveal">{{ t.contacts.title }}</h2>
                <p class="lead reveal">{{ t.contacts.lead }}</p>

                <button class="email reveal" @click="copyString(email)">
                    <span class="email-text" translate="no">{{ email }}</span>
                    <span class="email-hint"><i class="ri-file-copy-line" /> {{ t.contacts.tapCopy }}</span>
                </button>

                <div class="contact-row reveal">
                    <a class="btn btn-primary" :href="`mailto:${email}`"><i class="ri-mail-send-line" /> Email</a>
                    <a class="btn btn-ghost" href="https://linkedin.com/in/lorenzo-neri-dev" target="_blank"
                        rel="noopener"><i class="ri-linkedin-box-fill" /> LinkedIn</a>
                    <a class="btn btn-ghost" href="https://github.com/lorenzo-neri" target="_blank" rel="noopener"><i
                            class="ri-github-fill" /> GitHub</a>
                </div>
            </div>
        </section>

        <Transition name="toast">
            <div v-if="toast" :key="toast.key" class="toast" :class="{ error: !toast.ok }" role="status"
                aria-live="polite">
                <span class="toast-icon"><i :class="toast.ok ? 'ri-check-line' : 'ri-error-warning-line'" /></span>
                <span class="toast-text">{{ toast.text }}</span>
                <span v-if="toast.ok" class="toast-meta" translate="no">{{ email }}</span>
            </div>
        </Transition>

        <footer class="footer">
            <span>&copy; 2026 Lorenzo Neri</span>
            <span class="mono">{{ t.footer }}</span>
        </footer>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { copyToClipboard } from 'quasar';
import BusinessCard3D from 'components/BusinessCard3D.vue';
import Showcase3D from 'components/Showcase3D.vue';
import ShaderDemo from 'components/ShaderDemo.vue';
import RealtimeDemo from 'components/RealtimeDemo.vue';
import PhotoAboutMe from 'src/components/PhotoAboutMe.vue';
import { t, lang, setLang } from 'src/i18n';

const email = 'ciao@lorenzoneri.dev';

type DemoId = 'three' | 'shader' | 'realtime';
const demos: { id: DemoId; icon: string }[] = [
    { id: 'three', icon: 'ri-box-3-line' },
    { id: 'shader', icon: 'ri-contrast-drop-2-line' },
    { id: 'realtime', icon: 'ri-pulse-line' },
];
const demo = ref<DemoId>('three');

const navSections = ['work', 'lab', 'services', 'about', 'contacts'] as const;
type SectionId = 'hero' | (typeof navSections)[number];

const skills = [
    { name: 'Vue.js', icon: 'ri-vuejs-fill' },
    { name: 'Quasar', icon: 'ri-code-box-line' },
    { name: 'TypeScript', icon: 'ri-file-code-line' },
    { name: 'Three.js', icon: 'ri-box-3-line' },
    { name: 'Firebase', icon: 'ri-firebase-fill' },
    { name: 'Node.js', icon: 'ri-nodejs-line' },
    { name: 'Spring Boot', icon: 'ri-leaf-line' },
    { name: 'Database', icon: 'ri-database-2-line' },
    { name: 'Git', icon: 'ri-git-branch-line' },
];

const progress = ref(0);
const scrolled = ref(false);
const active = ref<SectionId>('hero');

const go = (id: SectionId): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const toast = ref<{ ok: boolean; text: string; key: number } | null>(null);
let toastTimer = 0;
const showToast = (ok: boolean, text: string): void => {
    clearTimeout(toastTimer);
    toast.value = { ok, text, key: Date.now() };
    toastTimer = window.setTimeout(() => (toast.value = null), 2200);
};

const copyString = async (text: string): Promise<void> => {
    try {
        await copyToClipboard(text);
        showToast(true, t.value.contacts.copied);
    } catch {
        showToast(false, t.value.contacts.copyError);
    }
};

const onScroll = (): void => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.value = max > 0 ? window.scrollY / max : 0;
    scrolled.value = window.scrollY > 24;
};

let revealObs: IntersectionObserver | null = null;
let sectionObs: IntersectionObserver | null = null;

onMounted(() => {
    document.documentElement.lang = lang.value;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    revealObs = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                revealObs?.unobserve(e.target);
            }
        }
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => revealObs?.observe(el));

    sectionObs = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) active.value = e.target.id as SectionId;
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach((el) => sectionObs?.observe(el));
});

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
    revealObs?.disconnect();
    sectionObs?.disconnect();
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

$accent: #a78bfa;
$accent-strong: #7c3aed;
$text: #fafafa;
$muted: #a1a1aa;
$line: rgba(255, 255, 255, 0.08);

.site {
    background: #0a0a0c;
    color: $text;
    font-family: 'Inter', system-ui, sans-serif;
    overflow-x: clip;
    -webkit-font-smoothing: antialiased;
}

.wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 1.25rem;
}

// Barra di avanzamento scroll
.progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 3000;
    background: linear-gradient(90deg, $accent-strong, $accent);
    transform-origin: 0 50%;
}

// Barra in alto
.topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: calc(0.75rem + env(safe-area-inset-top)) 1.25rem 0.75rem;
    transition: background 0.3s ease, border-color 0.3s ease;
    border-bottom: 1px solid transparent;

    &.solid {
        background: rgba(10, 10, 12, 0.72);
        backdrop-filter: blur(14px) saturate(1.4);
        border-bottom-color: $line;
    }
}

.logo {
    font-weight: 700;
    font-size: 1.125rem;
    letter-spacing: -0.02em;
    color: $text;
    text-decoration: none;

    span {
        color: $accent;
    }
}

.links {
    display: none;
    gap: 1.5rem;
    margin-left: auto;

    a {
        color: $muted;
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s ease;

        &.active,
        &:hover {
            color: $text;
        }
    }

    @media (min-width: 768px) {
        display: flex;
    }
}

.lang {
    margin-left: auto;
    display: flex;
    padding: 3px;
    border-radius: 999px;
    border: 1px solid $line;
    background: rgba(255, 255, 255, 0.03);

    @media (min-width: 768px) {
        margin-left: 0;
    }

    button {
        min-width: 40px;
        min-height: 32px;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: $muted;
        font: 600 0.75rem 'Inter', sans-serif;
        cursor: pointer;
        transition: background 0.2s ease, color 0.2s ease;

        &.on {
            background: $text;
            color: #0a0a0c;
        }
    }
}

// Hero
.hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: center;
    padding: 6rem 0 5rem;
}

.kicker {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1.5rem;
    padding: 0.35rem 0.8rem;
    border: 1px solid $line;
    border-radius: 999px;
    font-size: 0.8125rem;
    color: $muted;

    .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #4ade80;
        box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.18);
    }
}

.hero-title {
    margin: 0;
    font-size: clamp(2.75rem, 11vw, 6.5rem);
    line-height: 0.98;
    font-weight: 600;
    letter-spacing: -0.045em;

    em {
        font-family: 'Instrument Serif', Georgia, serif;
        font-style: italic;
        font-weight: 400;
        letter-spacing: -0.02em;
        color: $accent;
    }
}

.lead {
    max-width: 34rem;
    margin: 1.25rem 0 0;
    font-size: clamp(1rem, 2.6vw, 1.1875rem);
    line-height: 1.55;
    color: $muted;
}

.cta-row,
.contact-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 48px;
    padding: 0 1.25rem;
    border-radius: 999px;
    font: 500 0.9375rem 'Inter', sans-serif;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;

    &:active {
        transform: scale(0.97);
    }

    i {
        font-size: 1.125rem;
    }
}

.btn-primary {
    border: 0;
    background: $text;
    color: #0a0a0c;

    &:hover {
        background: #e4e4e7;
    }
}

.btn-ghost {
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.02);
    color: $text;

    &:hover {
        border-color: rgba(255, 255, 255, 0.35);
    }
}

.scroll-cue {
    position: absolute;
    left: 50%;
    bottom: calc(1.5rem + env(safe-area-inset-bottom));
    transform: translateX(-50%);
    z-index: 1;
    display: grid;
    justify-items: center;
    gap: 0.25rem;
    border: 0;
    background: none;
    color: #71717a;
    font-size: 0.6875rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;

    i {
        font-size: 1.125rem;
        animation: bob 1.8s ease-in-out infinite;
    }
}

@keyframes bob {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(5px);
    }
}

// Sezioni
.section {
    position: relative;
    padding: 5rem 0;
    scroll-margin-top: 3.5rem;

    @media (min-width: 768px) {
        padding: 7rem 0;
    }
}

.label {
    margin: 0 0 0.75rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $accent;

    &.small {
        margin-top: 3rem;
    }
}

.title {
    margin: 0;
    max-width: 22ch;
    font-size: clamp(1.875rem, 6vw, 3.25rem);
    line-height: 1.05;
    font-weight: 600;
    letter-spacing: -0.035em;

    &.big {
        font-size: clamp(2.25rem, 8vw, 4.5rem);
    }
}

#lab .lead {
    margin-bottom: 1.5rem;
}

// Progetti
.projects {
    display: grid;
    gap: 1rem;
    margin-top: 2.5rem;

    @media (min-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
    }
}

.project {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    border: 1px solid $line;
    border-radius: 20px;
    background:
        radial-gradient(120% 60% at 100% 0%, rgba(124, 58, 237, 0.1), transparent 60%),
        #0d0d10;
    transition: border-color 0.25s ease, transform 0.25s ease;

    &:hover {
        border-color: rgba(167, 139, 250, 0.35);
    }
}

.project-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.project-index {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: $accent;
}

.project-tag {
    padding: 0.2rem 0.6rem;
    border: 1px solid $line;
    border-radius: 999px;
    font-size: 0.6875rem;
    color: $muted;
}

.project-name {
    margin: 1.25rem 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1.1;
}

.project-text {
    margin: 0;
    color: $muted;
    font-size: 0.9375rem;
    line-height: 1.55;
}

.metric {
    display: grid;
    gap: 0.15rem;
    margin: 1.5rem 0 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid $line;
}

.metric-value {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-size: 2.5rem;
    line-height: 1;
    color: $accent;
}

.metric-label {
    font-size: 0.8125rem;
    color: $muted;
}

.stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin: 0 0 1.25rem;
    padding: 0;
    list-style: none;

    li {
        padding: 0.25rem 0.55rem;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.04);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.6875rem;
        color: #d4d4d8;
    }
}

.project-link {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-height: 44px;
    font-size: 0.875rem;
    font-weight: 500;
    color: $text;
    text-decoration: none;

    &.muted {
        color: #71717a;
    }

    i {
        transition: transform 0.2s ease;
    }

    &:hover i {
        transform: translate(2px, -2px);
    }
}

// Lab
.lab-tabs {
    display: inline-flex;
    gap: 0.25rem;
    margin-bottom: 1rem;
    padding: 4px;
    border: 1px solid $line;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.03);

    button {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        min-height: 40px;
        padding: 0 1rem;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: $muted;
        font: 500 0.875rem 'Inter', sans-serif;
        cursor: pointer;
        transition: background 0.2s ease, color 0.2s ease;

        &.on {
            background: $text;
            color: #0a0a0c;
        }
    }
}

// Servizi
.services {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1px;
    margin-top: 2.5rem;
    border: 1px solid $line;
    border-radius: 20px;
    overflow: hidden;
    background: $line;

    @media (min-width: 640px) {
        grid-template-columns: 1fr 1fr;
    }
}

.service {
    padding: 1.5rem;
    background: #0d0d10;

    h3 {
        margin: 0.875rem 0 0.375rem;
        font-size: 1.0625rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        line-height: 1.3;
    }

    p {
        margin: 0;
        color: $muted;
        font-size: 0.9375rem;
        line-height: 1.5;
    }
}

.service-icon {
    font-size: 1.5rem;
    color: $accent;
}

.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.45rem 0.8rem;
        border: 1px solid $line;
        border-radius: 999px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8125rem;
        color: #d4d4d8;

        i {
            color: $accent;
        }
    }
}

// Chi sono
.about {
    display: grid;
    gap: 2.5rem;
    align-items: center;

    @media (min-width: 768px) {
        grid-template-columns: 0.8fr 1fr;
        gap: 4rem;
    }
}

.about-photo {
    max-width: 360px;
    width: 100%;
}

// Contatti
.contacts {
    padding-bottom: 6rem;
}

.email {
    display: grid;
    gap: 0.35rem;
    width: 100%;
    max-width: 34rem;
    margin-top: 2rem;
    padding: 1.25rem;
    border: 1px solid $line;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.02);
    color: $text;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:hover {
        border-color: rgba(167, 139, 250, 0.5);
    }
}

.email-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(1rem, 4.4vw, 1.375rem);
    word-break: break-all;
}

.email-hint {
    font-size: 0.75rem;
    color: #71717a;
}

.contact-row .btn {
    flex: 1 1 140px;

    @media (min-width: 640px) {
        flex: 0 0 auto;
    }
}

.footer {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem;
    max-width: 1080px;
    margin: 0 auto;
    padding: 1.5rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;
    color: #71717a;
    font-size: 0.8125rem;
}

.mono {
    font-family: 'JetBrains Mono', monospace;
}

// Avviso "email copiata"
.toast {
    position: fixed;
    left: 50%;
    bottom: calc(1.25rem + env(safe-area-inset-bottom));
    z-index: 3000;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 0.75rem;
    align-items: center;
    width: max-content;
    max-width: calc(100vw - 2rem);
    padding: 0.75rem 1.1rem 0.75rem 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    background: rgba(18, 18, 22, 0.82);
    backdrop-filter: blur(16px) saturate(1.4);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
    transform: translateX(-50%);
}

.toast-icon {
    grid-row: span 2;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: rgba(74, 222, 128, 0.12);
    color: #4ade80;
    font-size: 1.125rem;

    .error & {
        background: rgba(248, 113, 113, 0.12);
        color: #f87171;
    }
}

.toast-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: $text;
}

.toast-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: #71717a;
}

.toast-enter-active,
.toast-leave-active {
    transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translate(-50%, 12px) scale(0.97);
}

// Comparsa allo scroll
.reveal {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);

    &.in {
        opacity: 1;
        transform: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .reveal {
        opacity: 1;
        transform: none;
        transition: none;
    }

    .scroll-cue i {
        animation: none;
    }
}
</style>

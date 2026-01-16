<template>
    <q-page class="business-card-page">
        <BusinessCard3D />

        <!-- Hero Section -->
        <section id="hero" class="hero-section">
            <div class="container">
                <div class="avatar-wrapper">
                    <div class="avatar-circle" @click="triggerSparkles" :class="{ 'sparkling': isSparkling }">
                        <i class="ri-code-s-slash-line remix-icon-large"></i>
                        <!-- Particelle di scintille -->
                        <template v-if="isSparkling">
                            <div v-for="n in sparkleCount" :key="n" class="sparkle" :style="getSparkleStyle(n)"></div>
                        </template>
                        <!-- Flash di luce -->
                        <div class="light-flash" v-if="isSparkling"></div>
                    </div>
                </div>
                <h1 class="name">Lorenzo Neri</h1>
                <p class="subtitle">Full-Stack Developer | Vue.js & Firebase lover</p>
                <p class="bio">
                    Web App, API, Database, Hosting
                </p>
            </div>
        </section>

        <!-- Skills Section -->
        <section id="skills" class="skills-section">
            <div class="container">
                <h2 class="section-title text-primary q-mt-none">SKILLS</h2>
                <div class="skills-grid">
                    <div v-for="skill in skills" :key="skill.name" class="skill-item"
                        @mouseenter="hoveredSkill = skill.name" @mouseleave="hoveredSkill = null">
                        <div class="skill-icon" :class="{ 'hovered': hoveredSkill === skill.name }">
                            <i v-if="skill.icon && skill.icon.startsWith('ri-')" :class="skill.icon"
                                class="remix-icon"></i>
                            <q-icon v-else-if="skill.icon" :name="skill.icon" size="2.5rem" />
                            <q-icon v-else name="code" size="2.5rem" />
                        </div>
                        <span class="skill-name">{{ skill.name }}</span>
                        <div class="skill-bar">
                            <div class="skill-progress" :style="{ width: skill.proficiency + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contacts Section -->
        <section id="contacts" class="contacts-section">
            <div class="container">
                <h2 class="section-title text-primary q-mt-none">CONTATTI</h2>
                <div class="contacts-content">
                    <div class="contact-buttons">
                        <q-btn no-caps unelevated rounded outline color="primary" size="lg" class="contact-btn"
                            href="https://github.com/lorenzo-neri" target="_blank">
                            <i class="ri-github-fill remix-icon-btn"></i>
                            GitHub
                        </q-btn>
                        <q-btn no-caps unelevated rounded outline color="primary" size="lg" class="contact-btn"
                            href="https://linkedin.com/in/lorenzo-neri-dev" target="_blank">
                            <i class="ri-linkedin-box-fill remix-icon-btn"></i>
                            LinkedIn
                        </q-btn>

                        <q-btn no-caps unelevated rounded outline color="primary" size="lg" class="contact-btn"
                            href="mailto:ciao@lorenzoneri.dev">
                            <i class="ri-mail-fill remix-icon-btn"></i>
                            Email
                        </q-btn>
                    </div>
                    <div class="email-display qr-placeholder">
                        <code>ciao@lorenzoneri.dev</code>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer id="footer" class="footer">
            <div class="container">
                <p>&copy; 2026 Lorenzo Neri</p>
                <p class="made-with">Made with ❤️ e code</p>
            </div>
        </footer>

        <!-- Frecce di navigazione in basso -->
        <div class="bottom-nav">
            <button v-if="currentIndex > 0" @click="navigateTo(currentIndex - 1)" class="bottom-nav-btn bottom-nav-left"
                aria-label="Sezione precedente">
                <i class="ri-arrow-left-line remix-icon-nav"></i>
            </button>

            <div class="bottom-nav-indicators">
                <button v-for="(section, index) in sections" :key="section" @click="navigateTo(index)" class="nav-dot"
                    :class="{ active: currentIndex === index }" :aria-label="`Vai a ${section}`" />
            </div>

            <button v-if="currentIndex < 3" @click="navigateTo(currentIndex + 1)"
                class="bottom-nav-btn bottom-nav-right" aria-label="Sezione successiva">
                <i class="ri-arrow-right-line remix-icon-nav"></i>
            </button>

            <button v-if="currentIndex === 3" class="bottom-nav-btn bottom-nav-right bottom-nav-heart" disabled
                aria-label="Fine">
                <i class="ri-heart-fill remix-icon-nav heart-icon"></i>
            </button>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BusinessCard3D from 'components/BusinessCard3D.vue';

interface Skill {
    name: string;
    icon: string;
    proficiency: number;
}

const hoveredSkill = ref<string | null>(null);
const currentIndex = ref<number>(0);
const isSparkling = ref<boolean>(false);
const sparkleCount = 20;
let pageElement: HTMLElement | null = null;

const triggerSparkles = (): void => {
    isSparkling.value = true;
    setTimeout(() => {
        isSparkling.value = false;
    }, 1000);
};

const getSparkleStyle = (index: number): Record<string, string> => {
    const angle = (360 / sparkleCount) * index;
    const distance = 80 + Math.random() * 40;
    const delay = Math.random() * 0.3;
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians) * distance;
    const y = Math.sin(radians) * distance;

    return {
        '--x': `${x}px`,
        '--y': `${y}px`,
        '--delay': `${delay}s`,
    };
};

const skills: Skill[] = [
    { name: 'Vue.js', icon: 'ri-vuejs-fill', proficiency: 88 },
    { name: 'Quasar', icon: 'ri-code-box-line', proficiency: 95 },
    { name: 'TypeScript', icon: 'ri-file-code-line', proficiency: 90 },
    { name: 'Firebase', icon: 'ri-firebase-fill', proficiency: 85 },
    { name: 'Database', icon: 'ri-database-line', proficiency: 90 },
    { name: 'Node.js', icon: 'ri-nodejs-line', proficiency: 80 },
    { name: 'Spring Boot', icon: 'ri-leaf-line', proficiency: 80 },
    { name: 'Git', icon: 'ri-git-branch-line', proficiency: 90 },
];

const sections = ['hero', 'skills', 'contacts', 'footer'] as const;
const totalSections = sections.length;

const navigateTo = (index: number): void => {
    if (index < 0 || index >= totalSections) return;
    currentIndex.value = index;

    const sectionId = sections[index];
    if (!sectionId) return;

    const element = document.getElementById(sectionId);
    if (element && pageElement) {
        const scrollPosition = index * window.innerWidth;
        pageElement.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
};

const checkScrollPosition = (): void => {
    if (!pageElement) return;
    const scrollLeft = pageElement.scrollLeft;
    const clientWidth = pageElement.clientWidth;
    const sectionIndex = Math.round(scrollLeft / clientWidth);
    currentIndex.value = Math.max(0, Math.min(totalSections - 1, sectionIndex));
};

onMounted(() => {
    pageElement = document.querySelector('.business-card-page') as HTMLElement;
    if (pageElement) {
        pageElement.addEventListener('scroll', checkScrollPosition);
        window.addEventListener('resize', checkScrollPosition);
        checkScrollPosition();
    }
});

onUnmounted(() => {
    if (pageElement) {
        pageElement.removeEventListener('scroll', checkScrollPosition);
    }
    window.removeEventListener('resize', checkScrollPosition);
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.business-card-page {
    background: #0a0a0a;
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
    height: 100vh;
    height: -webkit-fill-available; // Per iOS Safari
    width: 100vw;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    display: flex;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    // Gestione safe areas iOS Safari
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
}

// Assicura che il contenuto sia sopra il background 3D
.hero-section,
.skills-section,
.contacts-section,
.footer {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    scroll-snap-align: start;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 0 1rem;
    }
}

// Hero Section
.hero-section {
    min-width: 100vw;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
    animation: fadeInUp 0.8s ease-out;
    flex-shrink: 0;
    position: relative;
}


.avatar-wrapper {
    margin-bottom: 2rem;
}

.avatar-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 10px 40px rgba(124, 58, 237, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: visible;
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        animation: rotate 10s linear infinite;
    }

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 15px 50px rgba(124, 58, 237, 0.5);
    }

    &.sparkling {
        animation: pulse-glow 0.5s ease-out;
        box-shadow: 0 0 60px rgba(124, 58, 237, 0.8), 0 0 100px rgba(167, 139, 250, 0.6);
    }
}

// Flash di luce
.light-flash {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(124, 58, 237, 0.6) 30%, transparent 70%);
    transform: translate(-50%, -50%);
    animation: flash-light 0.3s ease-out;
    pointer-events: none;
    z-index: 1;
}

// Particelle di scintille
.sparkle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(124, 58, 237, 0.6);
    transform: translate(-50%, -50%);
    animation: sparkle-move 0.8s ease-out forwards;
    animation-delay: var(--delay);
    pointer-events: none;
    z-index: 2;
}

@keyframes pulse-glow {
    0% {
        transform: scale(1);
        box-shadow: 0 10px 40px rgba(124, 58, 237, 0.3);
    }

    50% {
        transform: scale(1.1);
        box-shadow: 0 0 80px rgba(124, 58, 237, 1), 0 0 120px rgba(167, 139, 250, 0.8);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 10px 40px rgba(124, 58, 237, 0.3);
    }
}

@keyframes flash-light {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
    }

    50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1.5);
    }
}

@keyframes sparkle-move {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) translateX(0) translateY(0) scale(1);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) translateX(var(--x)) translateY(var(--y)) scale(0);
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.name {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 1rem 0;
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
}

.subtitle {
    font-size: 1.25rem;
    color: #7c3aed;
    margin: 0.5rem 0;
    font-weight: 500;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
}

.bio {
    font-size: 1rem;
    color: #94a3b8;
    max-width: 600px;
    margin: 1.5rem auto 0;
    line-height: 1.6;
}

.skills-section {
    min-width: 100vw;
    width: 100vw;
    min-height: 100vh;
    height: 100vh; // Min, non fisso
    padding: 4rem 2rem 12rem; // Extra bottom per nav
    display: flex;
    flex-direction: column;
    align-items: center; // Solo orizzontale
    overflow-y: auto; // Scroll sempre
    overflow-x: hidden;
    box-sizing: border-box;
    animation: fadeInUp 0.8s ease-out 0.2s both;
    flex-shrink: 0;
    position: relative;
    // Scrollbar custom

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(124, 58, 237, 0.4);
        border-radius: 3px;
    }

    @media (max-width: 768px) {
        padding: 2rem 1rem 14rem; // Mobile extra
        align-items: stretch; // Full width mobile
    }

    &::before,
    &::after {
        content: '';
        flex: none; // Non crescono
    }

    &::before {
        margin-top: auto;
    }

    // Pusha contenuto giù
    &::after {
        margin-bottom: auto;
    }
}


.section-title {
    font-size: 2.5rem !important;
    font-weight: 600;
    text-align: center;
    margin-bottom: 3rem;
    margin-top: 0;

    @media (max-width: 768px) {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 0;
    margin-bottom: 0;
    justify-content: center;
    align-items: flex-start;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;

    @media (max-width: 768px) {
        gap: 1.5rem;
        max-width: 100%;
        margin-bottom: 2rem; // Spazio extra in basso per evitare che la nav copra le card
    }
}

.skill-item {
    text-align: center;
    padding: 1.5rem;
    border-radius: 12px;
    background: rgba(124, 58, 237, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    flex: 0 0 200px;
    max-width: 200px;

    &:hover {
        background: rgba(124, 58, 237, 0.1);
        border-color: rgba(124, 58, 237, 0.3);
        transform: translateY(-5px);
    }

    @media (max-width: 768px) {
        flex: 0 0 calc(50% - 0.75rem);
        max-width: calc(50% - 0.75rem);
    }
}

.skill-icon {
    margin-bottom: 1rem;
    color: #7c3aed;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &.hovered {
        transform: scale(1.2);
        filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.5));
    }

    .remix-icon {
        font-size: 2.5rem;
        color: inherit;
        line-height: 1;
    }
}

// Stili per icone RemixIcon in diverse parti del componente
.remix-icon-large {
    font-size: 4rem;
    color: inherit;
    line-height: 1;
    display: inline-block;
}

.remix-icon-btn {
    font-size: 1.25rem;
    margin-right: 0.5rem;
    line-height: 1;
}

.remix-icon-nav {
    font-size: 1.5rem;
    color: inherit;
    line-height: 1;
}

.skill-name {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: #e2e8f0;
    font-family: 'JetBrains Mono', monospace;
}

.skill-bar {
    width: 100%;
    height: 4px;
    background: rgba(124, 58, 237, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.skill-progress {
    height: 100%;
    background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%);
    border-radius: 2px;
    transition: width 0.6s ease;
}

// Contacts Section
.contacts-section {
    min-width: 100vw;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    animation: fadeInUp 0.8s ease-out 0.4s both;
    flex-shrink: 0;
    overflow-y: auto;
}

.contacts-content {
    max-width: 600px;
    margin: 0 auto;
}

.contact-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.contact-btn {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
    }
}

.email-display {
    margin: 2rem 0;
    padding: 1rem;
    background: rgba(124, 58, 237, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(124, 58, 237, 0.1);

    code {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1rem;
        color: #7c3aed;
    }
}

.qr-section {
    margin: 2rem 0;
}

.qr-placeholder {
    padding: 1.5rem;
    background: rgba(124, 58, 237, 0.05);
    border-radius: 12px;
    border: 2px dashed rgba(124, 58, 237, 0.3);

    p {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #94a3b8;
    }
}

// Footer
.footer {
    min-width: 100vw;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    border-top: 1px solid rgba(124, 58, 237, 0.1);
    color: #94a3b8;
    font-size: 0.9rem;
    flex-shrink: 0;
}

.made-with {
    margin-top: 0.5rem;
    font-family: 'JetBrains Mono', monospace;
}

// Navigazione in basso
.bottom-nav {
    position: fixed;
    bottom: 2rem;
    bottom: calc(2rem + env(safe-area-inset-bottom)); // Tiene conto delle safe areas iOS
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: rgba(10, 10, 10, 0.8);
    backdrop-filter: blur(10px);
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    border: 1px solid rgba(124, 58, 237, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
        bottom: 1rem;
        bottom: calc(1rem + env(safe-area-inset-bottom)); // Tiene conto delle safe areas iOS su mobile
        gap: 1rem;
        padding: 0.5rem 1rem;
    }
}

.bottom-nav-btn {
    background: transparent;
    border: none;
    color: #7c3aed;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 0.8;

    &:hover:not(:disabled) {
        opacity: 1;
        transform: scale(1.2);
        color: #a78bfa;
    }

    &:disabled {
        cursor: default;
        opacity: 0.5;
    }

    @media (max-width: 768px) {
        padding: 0.25rem;
    }
}

.bottom-nav-heart {
    .heart-icon {
        color: #ef4444;
        animation: heartbeat 1s ease-in-out infinite;
    }
}

.bottom-nav-indicators {
    display: flex;
    gap: 0.75rem;
    align-items: center;

    @media (max-width: 768px) {
        gap: 0.5rem;
    }
}

.nav-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: rgba(124, 58, 237, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;

    &:hover {
        background: rgba(124, 58, 237, 0.6);
        transform: scale(1.3);
    }

    &.active {
        background: #7c3aed;
        width: 12px;
        height: 12px;
        box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
    }

    @media (max-width: 768px) {
        width: 8px;
        height: 8px;

        &.active {
            width: 10px;
            height: 10px;
        }
    }
}

// Animations
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// Responsive
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }

    .hero-section,
    .contacts-section,
    .footer {
        padding: 2rem 1rem;
    }

    .contact-buttons {
        flex-direction: column;
        align-items: stretch;
    }

    .contact-btn {
        width: 100%;
    }
}

// Per schermi molto piccoli (telefoni piccoli)
@media (max-width: 480px) {
    .skills-section {
        padding: 1rem 0.5rem 7rem 0.5rem; // Padding-bottom aumentato per evitare che la nav copra le card
        min-height: 100vh;
        height: auto;
    }

    .section-title {
        font-size: 1.25rem !important;
        margin-bottom: 1rem;
        margin-top: 0;
    }

    .skills-grid {
        gap: 1rem;
        margin-top: 0;
    }

    .skill-item {
        padding: 1rem;
        flex: 0 0 calc(50% - 0.5rem);
        max-width: calc(50% - 0.5rem);
    }

    .container {
        padding: 0 0.5rem;
    }

    .bottom-nav {
        bottom: 0.75rem;
        bottom: calc(0.75rem + env(safe-area-inset-bottom));
        padding: 0.4rem 0.8rem;
        gap: 0.75rem;
    }
}
</style>

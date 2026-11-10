<template>
    <div class="demo-box realtime">
        <div class="head">
            <span class="title">{{ t.realtime.title }}</span>
            <span class="live"><span class="pulse" /> {{ t.realtime.live }}</span>
        </div>

        <div class="big">{{ shown.toLocaleString(lang) }}</div>
        <div class="stats">
            <span><b>+{{ rate }}</b> {{ t.realtime.perMin }}</span>
            <span><b>{{ latency }} ms</b> {{ t.realtime.latency }}</span>
        </div>

        <svg class="chart" viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <linearGradient id="rt-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.45" />
                    <stop offset="100%" stop-color="#a78bfa" stop-opacity="0" />
                </linearGradient>
            </defs>
            <path :d="area" fill="url(#rt-fill)" />
            <path :d="line" fill="none" stroke="#a78bfa" stroke-width="2" vector-effect="non-scaling-stroke" />
        </svg>

        <TransitionGroup name="feed" tag="ul" class="feed">
            <li v-for="e in events" :key="e.id">
                <span class="dot" />
                <span class="what">{{ t.realtime.order }} #{{ e.id }}</span>
                <span class="where">{{ t.realtime.cities[e.city] }}</span>
                <span class="amount">€{{ e.amount }}</span>
            </li>
        </TransitionGroup>
    </div>
    <p class="caption">{{ t.realtime.caption }}</p>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { t, lang } from 'src/i18n';

interface Ev { id: number; city: number; amount: number }

const total = ref(1284);
const shown = ref(1284);
const rate = ref(14);
const latency = ref(18);
const points = ref<number[]>(Array.from({ length: 30 }, (_, i) => 30 + Math.sin(i / 3) * 10 + Math.random() * 12));
const events = ref<Ev[]>([]);
let nextId = 1043;
let timer = 0;
let raf = 0;

const toPath = (closed: boolean) => {
    const max = Math.max(...points.value) * 1.15;
    const step = 300 / (points.value.length - 1);
    const pts = points.value.map((v, i) => `${(i * step).toFixed(1)},${(90 - (v / max) * 85).toFixed(1)}`);
    const d = `M${pts.join(' L')}`;
    return closed ? `${d} L300,90 L0,90 Z` : d;
};
const line = computed(() => toPath(false));
const area = computed(() => toPath(true));

const push = () => {
    if (document.hidden) return;
    const n = 1 + Math.floor(Math.random() * 3);
    total.value += n;
    rate.value = Math.max(6, Math.min(32, rate.value + Math.round((Math.random() - 0.5) * 6)));
    latency.value = 12 + Math.floor(Math.random() * 14);
    points.value = [...points.value.slice(1), rate.value + Math.random() * 10 + 20];
    events.value = [
        { id: nextId++, city: Math.floor(Math.random() * 8), amount: 19 + Math.floor(Math.random() * 180) },
        ...events.value,
    ].slice(0, 4);
};

// il numero grande "conta" fino al valore vero
const count = () => {
    raf = requestAnimationFrame(count);
    if (shown.value < total.value) shown.value += Math.max(1, Math.round((total.value - shown.value) * 0.15));
};

onMounted(() => {
    push();
    push();
    timer = window.setInterval(push, 1400);
    count();
});

onUnmounted(() => {
    clearInterval(timer);
    cancelAnimationFrame(raf);
});
</script>

<style scoped lang="scss">
.demo-box {
    position: relative;
    height: min(68vh, 560px);
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background:
        radial-gradient(70% 50% at 80% 0%, rgba(124, 58, 237, 0.18), transparent 70%),
        #0d0d10;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
}

.head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8125rem;
    color: #a1a1aa;
}

.live {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: rgba(74, 222, 128, 0.1);
    color: #4ade80;
    font-size: 0.75rem;
    font-weight: 500;
}

.pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4ade80;
    animation: ping 1.4s ease-out infinite;
}

@keyframes ping {
    0% {
        box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6);
    }

    100% {
        box-shadow: 0 0 0 8px rgba(74, 222, 128, 0);
    }
}

.big {
    margin-top: 0.75rem;
    font-size: clamp(2.75rem, 12vw, 4.5rem);
    font-weight: 600;
    letter-spacing: -0.04em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
}

.stats {
    display: flex;
    gap: 1.25rem;
    margin-top: 0.6rem;
    font-size: 0.8125rem;
    color: #a1a1aa;

    b {
        color: #fafafa;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }
}

.chart {
    width: 100%;
    height: 90px;
    margin: 1.25rem 0 1rem;
    flex-shrink: 0;
}

.feed {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.5rem;
    overflow: hidden;

    li {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        align-items: center;
        gap: 0.6rem;
        padding: 0.65rem 0.8rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.025);
        font-size: 0.8125rem;
    }

    .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #a78bfa;
    }

    .what {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .where {
        color: #71717a;
    }

    .amount {
        font-family: 'JetBrains Mono', monospace;
        color: #fafafa;
    }
}

.feed-enter-active,
.feed-move {
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease;
}

.feed-leave-active {
    display: none;
}

.feed-enter-from {
    opacity: 0;
    transform: translateY(-12px);
}

.caption {
    margin: 1rem 0 0;
    font-size: 0.875rem;
    color: #a1a1aa;
    line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {

    .pulse,
    .feed-enter-active,
    .feed-move {
        animation: none;
        transition: none;
    }
}
</style>

<template>
    <div class="showcase" :class="{ 'is-full': isFull }">
        <Teleport to="body" :disabled="!isFull">
        <div ref="stageRef" class="stage" :class="{ 'is-full': isFull }">
            <div v-if="loading" class="loading">
                <span class="spinner" />
                {{ t.showcase.loading }}
            </div>
            <div v-if="!isFull && !loading" class="hint">
                <i class="ri-drag-move-2-line" /> {{ t.showcase.drag }}
            </div>
            <div v-if="isFull" class="full-bar">
                <div class="finishes">
                    <button v-for="f in finishes" :key="f" class="finish" :class="{ active: finish === f }"
                        @click="setFinish(f)">
                        <span class="swatch" :class="`swatch-${f}`" />
                        {{ t.showcase.finish[f] }}
                    </button>
                </div>
                <span class="full-hint">{{ t.showcase.pinch }}</span>
            </div>

            <button class="icon-btn full-btn" :aria-label="isFull ? t.showcase.close : t.showcase.explore"
                @click="toggleFull">
                <i :class="isFull ? 'ri-close-line' : 'ri-fullscreen-line'" />
            </button>
        </div>
        </Teleport>

        <div class="controls">
            <div class="model-tabs" role="tablist">
                <button v-for="(m, i) in models" :key="m.file" role="tab" class="model-tab"
                    :class="{ active: i === current }" :aria-selected="i === current" @click="select(i)">
                    <span class="model-num">0{{ i + 1 }}</span>
                    <span class="model-name">{{ m.name }}</span>
                </button>
            </div>

            <div class="finishes">
                <span class="finish-label">{{ t.showcase.finishes }}</span>
                <button v-for="f in finishes" :key="f" class="finish" :class="{ active: finish === f }"
                    @click="setFinish(f)">
                    <span class="swatch" :class="`swatch-${f}`" />
                    {{ t.showcase.finish[f] }}
                </button>
            </div>

            <p class="credit">{{ models[current]?.credit }} · {{ t.showcase.credit }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { t } from 'src/i18n';

type Finish = 'original' | 'clay' | 'bronze' | 'resin';

const models = [
    { file: 'models/girl-skating.glb', name: 'Girl Skating', credit: 'Abastenia St. Léger Eberle, 1906' },
    { file: 'models/arrow-maker.glb', name: 'Arrow Maker', credit: 'Edmonia Lewis, 1872' },
    { file: 'models/winged-monster.glb', name: 'Winged Monster', credit: 'Northern Qi, China, 550-577' },
];
const finishes: Finish[] = ['original', 'clay', 'bronze', 'resin'];

const stageRef = ref<HTMLElement | null>(null);
const current = ref(0);
const finish = ref<Finish>('original');
const loading = ref(true);
const isFull = ref(false);

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let pivot: THREE.Group;
let loader: GLTFLoader;
let frame = 0;
let visible = false;
let observer: IntersectionObserver | null = null;
let fitSize = new THREE.Vector3(1, 2, 1);

// rotazione: trascinamento orizzontale + rotazione lenta + legata allo scroll
let spin = 0;
let velocity = 0;
let dragging = false;
let lastX = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cache = new Map<string, THREE.Object3D>();
const originals = new WeakMap<THREE.Mesh, THREE.Material | THREE.Material[]>();

const finishMaterial = (f: Exclude<Finish, 'original'>, src: THREE.MeshStandardMaterial | null) => {
    const normalMap = src?.normalMap ?? null;
    if (f === 'clay') {
        return new THREE.MeshStandardMaterial({ color: 0xb9b2aa, roughness: 0.92, metalness: 0, normalMap });
    }
    if (f === 'bronze') {
        return new THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: 0.32, metalness: 1, normalMap });
    }
    return new THREE.MeshPhysicalMaterial({
        color: 0x8a8f98, roughness: 0.45, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.15, normalMap,
    });
};

const finishCache = new WeakMap<THREE.Mesh, Partial<Record<Finish, THREE.Material>>>();

const applyFinish = (root: THREE.Object3D, f: Finish) => {
    root.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        if (!originals.has(mesh)) originals.set(mesh, mesh.material);
        if (f === 'original') {
            mesh.material = originals.get(mesh)!;
            return;
        }
        const per = finishCache.get(mesh) ?? {};
        if (!per[f]) {
            const orig = originals.get(mesh);
            const src = (Array.isArray(orig) ? orig[0] : orig) as THREE.MeshStandardMaterial | undefined;
            per[f] = finishMaterial(f, src ?? null);
            finishCache.set(mesh, per);
        }
        mesh.material = per[f];
    });
};

const normalize = (root: THREE.Object3D) => {
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const scale = 2 / Math.max(size.y, size.x, size.z);
    root.scale.setScalar(scale);
    const box2 = new THREE.Box3().setFromObject(root);
    const center = box2.getCenter(new THREE.Vector3());
    root.position.sub(center);
    fitSize = box2.getSize(new THREE.Vector3());
};

const frameCamera = () => {
    const el = stageRef.value;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    camera.aspect = w / h;
    // larghezza massima che il modello può occupare girando
    const radius = Math.hypot(fitSize.x, fitSize.z) / 2;
    const needH = Math.max(fitSize.y, (radius * 2) / camera.aspect) * 1.08;
    const dist = needH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) + radius * 0.4;
    camera.position.set(0, fitSize.y * 0.08, dist);
    camera.near = 0.05;
    camera.far = dist * 10;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.minDistance = dist * 0.35;
    controls.maxDistance = dist * 1.6;
    controls.update();
    controls.saveState();
    renderer.setSize(w, h, false);
};

const load = async (i: number) => {
    const m = models[i];
    if (!m) return;
    loading.value = !cache.has(m.file);
    let root = cache.get(m.file);
    if (!root) {
        const gltf = await loader.loadAsync(m.file);
        root = gltf.scene;
        normalize(root);
        cache.set(m.file, root);
    } else {
        const box = new THREE.Box3().setFromObject(root);
        fitSize = box.getSize(new THREE.Vector3());
    }
    if (i !== current.value) return; // l'utente ha già cambiato modello
    pivot.clear();
    pivot.add(root);
    applyFinish(root, finish.value);
    frameCamera();
    loading.value = false;
    // precarica il successivo in background
    const next = models[(i + 1) % models.length];
    if (next && !cache.has(next.file)) {
        loader.loadAsync(next.file).then((g) => {
            normalize(g.scene);
            cache.set(next.file, g.scene);
        }).catch(() => { /* riproverà al clic */ });
    }
};

const select = (i: number) => {
    if (i === current.value) return;
    current.value = i;
    void load(i);
};

const setFinish = (f: Finish) => {
    finish.value = f;
    const root = pivot.children[0];
    if (root) applyFinish(root, f);
};

const toggleFull = async () => {
    isFull.value = !isFull.value;
    document.body.style.overflow = isFull.value ? 'hidden' : '';
    controls.enabled = isFull.value;
    renderer.domElement.style.touchAction = isFull.value ? 'none' : 'pan-y';
    await nextTick();
    if (!isFull.value) controls.reset();
    frameCamera();
};

const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFull.value) void toggleFull();
};

const onDown = (e: PointerEvent) => {
    if (isFull.value) return;
    dragging = true;
    lastX = e.clientX;
    velocity = 0;
};
const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    spin += dx * 0.012;
    velocity = dx * 0.012;
};
const onUp = () => {
    dragging = false;
};

const tick = () => {
    frame = requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    if (!dragging && !isFull.value) {
        velocity *= 0.94;
        spin += velocity + (reducedMotion ? 0 : 0.0035);
    }
    const scrollTurn = reducedMotion ? 0 : window.scrollY * 0.0025;
    pivot.rotation.y = isFull.value ? pivot.rotation.y : spin + scrollTurn;
    if (isFull.value) controls.update();
    renderer.render(scene, camera);
};

const onResize = () => frameCamera();

onMounted(() => {
    const el = stageRef.value;
    if (!el) return;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.prepend(renderer.domElement);

    scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2, 3, 2);
    const rim = new THREE.DirectionalLight(0x9f7aea, 2.2);
    rim.position.set(-3, 1.5, -2.5);
    scene.add(key, rim);

    camera = new THREE.PerspectiveCamera(32, 1, 0.05, 100);
    pivot = new THREE.Group();
    scene.add(pivot);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enabled = false;
    renderer.domElement.style.touchAction = 'pan-y';

    const draco = new DRACOLoader();
    draco.setDecoderPath('draco/');
    loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);

    observer = new IntersectionObserver(([entry]) => {
        visible = !!entry?.isIntersecting;
    }, { rootMargin: '100px' });
    observer.observe(el);

    frameCamera();
    void load(0);
    tick();
});

onUnmounted(() => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
    controls?.dispose();
    renderer?.dispose();
});
</script>

<style scoped lang="scss">
.showcase {
    display: grid;
    gap: 1rem;
}

.stage {
    position: relative;
    height: min(68vh, 560px);
    border-radius: 20px;
    overflow: hidden;
    background:
        radial-gradient(60% 50% at 50% 55%, rgba(124, 58, 237, 0.22), transparent 70%),
        linear-gradient(180deg, #121018 0%, #0b0a0f 100%);
    border: 1px solid rgba(255, 255, 255, 0.06);
    cursor: grab;

    &:active {
        cursor: grabbing;
    }

    :deep(canvas) {
        display: block;
        width: 100% !important;
        height: 100% !important;
    }

    // pavimento: ombra morbida sotto il pezzo
    &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 9%;
        width: 55%;
        height: 8%;
        transform: translateX(-50%);
        background: radial-gradient(closest-side, rgba(0, 0, 0, 0.7), transparent);
        pointer-events: none;
    }
}

.stage.is-full {
    position: fixed;
    inset: 0;
    z-index: 10000;
    height: 100dvh;
    border-radius: 0;
    border: 0;
}

.loading {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 0.75rem;
    color: #a1a1aa;
    font-size: 0.875rem;
    z-index: 1;
}

.spinner {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-top-color: #a78bfa;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.hint {
    position: absolute;
    left: 50%;
    bottom: 1rem;
    transform: translateX(-50%);
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    background: rgba(10, 10, 12, 0.6);
    backdrop-filter: blur(8px);
    color: #d4d4d8;
    font-size: 0.75rem;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2;

    .is-full & {
        bottom: calc(1.25rem + env(safe-area-inset-bottom));
    }
}

.icon-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 2;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(10, 10, 12, 0.6);
    backdrop-filter: blur(8px);
    color: #fafafa;
    font-size: 1.25rem;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: transform 0.15s ease, background 0.15s ease;

    &:active {
        transform: scale(0.94);
    }

    .is-full & {
        top: calc(0.75rem + env(safe-area-inset-top));
    }
}

.full-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    display: grid;
    justify-items: center;
    gap: 0.6rem;
    padding: 1rem 1rem calc(1rem + env(safe-area-inset-bottom));
    background: linear-gradient(transparent, rgba(10, 10, 12, 0.85));

    .finishes {
        justify-content: center;
    }

    .finish {
        background: rgba(10, 10, 12, 0.6);
        backdrop-filter: blur(8px);
    }
}

.full-hint {
    font-size: 0.75rem;
    color: #a1a1aa;
}

.controls {
    display: grid;
    gap: 0.875rem;
}

.model-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
}

.model-tab {
    text-align: left;
    padding: 0.625rem 0.75rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    color: #a1a1aa;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
    min-height: 44px;

    &.active {
        border-color: rgba(167, 139, 250, 0.6);
        background: rgba(124, 58, 237, 0.12);
        color: #fafafa;
    }
}

.model-num {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6875rem;
    color: #a78bfa;
}

.model-name {
    display: block;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.2;
}

.finishes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
}

.finish-label {
    font-size: 0.75rem;
    color: #71717a;
    margin-right: 0.25rem;
}

.finish {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 36px;
    padding: 0.35rem 0.75rem 0.35rem 0.4rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: transparent;
    color: #a1a1aa;
    font-size: 0.8125rem;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;

    &.active {
        border-color: rgba(255, 255, 255, 0.4);
        color: #fafafa;
    }
}

.swatch {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.swatch-original {
    background: conic-gradient(#8b7355, #c9b79c, #6b5a45, #8b7355);
}

.swatch-clay {
    background: #b9b2aa;
}

.swatch-bronze {
    background: radial-gradient(circle at 30% 30%, #f0d39a, #b08d57 50%, #5c4524);
}

.swatch-resin {
    background: radial-gradient(circle at 30% 30%, #e4e7eb, #8a8f98 55%, #4b4f57);
}

.credit {
    margin: 0;
    font-size: 0.6875rem;
    color: #52525b;
}
</style>

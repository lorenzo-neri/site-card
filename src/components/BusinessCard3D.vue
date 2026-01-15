<template>
    <div ref="containerRef" class="three-background"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const containerRef = ref<HTMLElement | null>(null);

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let animationId: number | null = null;
let particles: THREE.Points | null = null;
let geometricShapes: THREE.Group | null = null;
let resizeHandler: (() => void) | null = null;

const initThree = () => {
    if (!containerRef.value) return;

    // Scene
    scene = new THREE.Scene();
    scene.background = null; // Trasparente

    // Camera
    const width = containerRef.value.clientWidth || window.innerWidth;
    const height = containerRef.value.clientHeight || window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.value.appendChild(renderer.domElement);

    // Particelle subtle di sfondo
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;

        // Colore viola accent molto subtle
        const color = new THREE.Color();
        color.setHSL(0.75, 0.5, 0.4 + Math.random() * 0.2);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Forme geometriche fluttuanti (discrete)
    geometricShapes = new THREE.Group();

    // Tetraedro
    const tetraGeometry = new THREE.TetrahedronGeometry(0.3, 0);
    const tetraMaterial = new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
    });
    const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);
    tetra.position.set(-2, 1, -2);
    geometricShapes.add(tetra);

    // Ottaedro
    const octaGeometry = new THREE.OctahedronGeometry(0.25, 0);
    const octaMaterial = new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
    });
    const octa = new THREE.Mesh(octaGeometry, octaMaterial);
    octa.position.set(2, -1, -2);
    geometricShapes.add(octa);

    // Icosaedro
    const icoGeometry = new THREE.IcosahedronGeometry(0.2, 0);
    const icoMaterial = new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
    });
    const ico = new THREE.Mesh(icoGeometry, icoMaterial);
    ico.position.set(0, -2, -3);
    geometricShapes.add(ico);

    scene.add(geometricShapes);

    // Luce ambientale molto soft
    const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.1);
    scene.add(ambientLight);

    // Point light subtle
    const pointLight = new THREE.PointLight(0x7c3aed, 0.3, 10);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Handle resize
    resizeHandler = () => {
        if (!containerRef.value || !camera || !renderer) return;
        const width = containerRef.value.clientWidth || window.innerWidth;
        const height = containerRef.value.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };

    window.addEventListener('resize', resizeHandler);

    // Animation loop
    const animate = () => {
        if (!scene || !camera || !renderer) return;

        animationId = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Rotazione lenta delle particelle
        if (particles) {
            particles.rotation.x += 0.0005;
            particles.rotation.y += 0.001;
        }

        // Rotazione e fluttuazione delle forme geometriche
        if (geometricShapes) {
            geometricShapes.children.forEach((child, index) => {
                child.rotation.x += 0.002 * (index + 1);
                child.rotation.y += 0.003 * (index + 1);
                child.position.y += Math.sin(time + index) * 0.001;
            });
        }

        renderer.render(scene, camera);
    };

    animate();
};

const cleanup = () => {
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }

    if (renderer && containerRef.value && renderer.domElement.parentNode === containerRef.value) {
        containerRef.value.removeChild(renderer.domElement);
        renderer.dispose();
        renderer = null;
    }

    if (particles) {
        particles.geometry.dispose();
        if (particles.material instanceof THREE.Material) {
            particles.material.dispose();
        }
        particles = null;
    }

    if (geometricShapes) {
        geometricShapes.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (child.material instanceof THREE.Material) {
                    child.material.dispose();
                }
            }
        });
        geometricShapes = null;
    }

    scene = null;
    camera = null;
};

onMounted(() => {
    setTimeout(() => {
        initThree();
    }, 100);
});

onUnmounted(() => {
    cleanup();
});
</script>

<style scoped>
.three-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    opacity: 0.6;
}
</style>

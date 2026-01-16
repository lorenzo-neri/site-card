<template>
  <div ref="container" class="fullscreen-404">
    <!-- Overlay UI -->
    <div class="ui-overlay">
      <div class="title-container">
        <div class="number-404">404</div>
        <div class="oops-text">Oops!</div>
        <div class="subtitle">Page not found</div>
        <q-btn class="home-btn q-pa-lg q-mt-xl" rounded unelevated color="primary" text-color="white" to="/"
          label="Back" no-caps size="lg" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const container = ref<HTMLElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let particles: THREE.Points
const clock = new THREE.Clock()

onMounted(() => {
  init()
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  renderer.dispose()
})

const init = () => {
  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0a0a0a, 1, 1000)

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  // Renderer
  const canvas = document.createElement('canvas')
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x0a0a0a, 1)
  container.value!.appendChild(renderer.domElement)

  // Particles
  createParticles()

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5

  // Lights
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x7c3aed, 2, 100)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  // Events
  window.addEventListener('resize', onWindowResize)
}

const createParticles = () => {
  const particleCount = 20000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    // Position
    positions[i * 3] = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200

    // Color gradient viola/neon
    const hue = Math.random() * 0.2 + 0.75 // Viola-blu
    colors[i * 3] = hue
    colors[i * 3 + 1] = 0.3 + Math.random() * 0.3
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

const animate = () => {
  requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()
  console.log(elapsed)

  // Rotazione particelle
  particles.rotation.y += 0.0005
  particles.rotation.x += 0.0003

  // Mouse parallax
  const mouseX = (window.innerWidth / 2 - window.innerWidth * 0.5) / window.innerWidth * 0.1
  const mouseY = (window.innerHeight / 2 - window.innerHeight * 0.5) / window.innerHeight * 0.1
  camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX, 0.05)
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouseY, 0.05)

  controls.update()
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
</script>

<style scoped lang="scss">
.fullscreen-404 {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a0a 70%);
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: none;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

.title-container {
  text-align: center;
  backdrop-filter: blur(20px);
  background: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 24px;
  padding: 3rem 4rem;
  margin-bottom: 3rem;
  pointer-events: auto;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin-bottom: 2rem;
  }
}

.number-404 {
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 900;
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 40px rgba(124, 58, 237, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
  margin-bottom: 0.5rem;
}

.oops-text {
  font-size: clamp(1.5rem, 5vw, 3rem);
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 0.25rem;
  opacity: 0.8;
}

.subtitle {
  font-size: 1.25rem;
  color: #64748b;
  font-weight: 400;
}

.home-btn {
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
  pointer-events: auto !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  }
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.5));
  }

  to {
    filter: drop-shadow(0 0 40px rgba(124, 58, 237, 0.8));
  }
}
</style>

<template>
    <div ref="boxRef" class="demo-box shader">
        <canvas ref="canvasRef" />
        <div class="hint"><i :class="isTouch ? 'ri-hand' : 'ri-cursor-line'" /> {{ t.shader.hint }}</div>
    </div>
    <p class="caption">{{ t.shader.caption }}</p>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { t, isTouch } from 'src/i18n';

const boxRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// rumore frattale deformato (domain warping) + bagliore che segue il dito
const frag = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTime;
uniform float uPress;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.02 + 3.1; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 m = (uMouse - 0.5 * uRes) / min(uRes.x, uRes.y);
  float d = length(p - m);
  p += (p - m) * 0.35 * exp(-d * 3.0) * (0.6 + uPress);
  float t = uTime * 0.12;
  vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t + 4.0));
  float f = fbm(p * 1.4 + 2.2 * q + vec2(t, -t));
  vec3 deep = vec3(0.04, 0.03, 0.07);
  vec3 violet = vec3(0.49, 0.23, 0.93);
  vec3 lilac = vec3(0.65, 0.55, 0.98);
  vec3 warm = vec3(0.98, 0.62, 0.42);
  vec3 col = mix(deep, violet, smoothstep(0.25, 0.75, f));
  col = mix(col, lilac, smoothstep(0.55, 0.95, f * q.x * 1.6));
  col = mix(col, warm, smoothstep(0.7, 1.0, q.y * f * 1.5) * 0.55);
  col += lilac * 0.35 * exp(-d * 5.0) * (0.5 + uPress);
  col *= 0.85 + 0.15 * smoothstep(1.2, 0.2, length(uv - 0.5));
  gl_FragColor = vec4(col, 1.0);
}`;

let gl: WebGLRenderingContext | null = null;
let raf = 0;
let visible = false;
let observer: IntersectionObserver | null = null;
let uRes: WebGLUniformLocation | null = null;
let uMouse: WebGLUniformLocation | null = null;
let uTime: WebGLUniformLocation | null = null;
let uPress: WebGLUniformLocation | null = null;
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
let press = 0;
let pressTarget = 0;
const start = performance.now();

const compile = (type: number, src: string) => {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    return s;
};

const resize = () => {
    const c = canvasRef.value;
    if (!c || !gl) return;
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    c.width = Math.round(c.clientWidth * dpr);
    c.height = Math.round(c.clientHeight * dpr);
    gl.viewport(0, 0, c.width, c.height);
    if (!mouse.tx) {
        mouse.tx = mouse.x = c.width * 0.62;
        mouse.ty = mouse.y = c.height * 0.55;
    }
};

const onMove = (e: PointerEvent) => {
    const c = canvasRef.value;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width;
    mouse.tx = (e.clientX - r.left) * sx;
    mouse.ty = (r.bottom - e.clientY) * sx;
};

const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible || !gl || document.hidden) return;
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    press += (pressTarget - press) * 0.1;
    gl.uniform2f(uRes, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uTime, (performance.now() - start) / 1000);
    gl.uniform1f(uPress, press);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

const down = () => (pressTarget = 1);
const up = () => (pressTarget = 0);

onMounted(() => {
    const c = canvasRef.value;
    if (!c) return;
    gl = c.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // un solo triangolo che copre tutto lo schermo
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    uRes = gl.getUniformLocation(prog, 'uRes');
    uMouse = gl.getUniformLocation(prog, 'uMouse');
    uTime = gl.getUniformLocation(prog, 'uTime');
    uPress = gl.getUniformLocation(prog, 'uPress');

    c.addEventListener('pointermove', onMove);
    c.addEventListener('pointerdown', (e) => { onMove(e); down(); });
    window.addEventListener('pointerup', up);
    window.addEventListener('resize', resize);
    observer = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    observer.observe(c);
    resize();
    loop();
});

onUnmounted(() => {
    cancelAnimationFrame(raf);
    observer?.disconnect();
    window.removeEventListener('pointerup', up);
    window.removeEventListener('resize', resize);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    gl = null;
});
</script>

<style scoped lang="scss">
.demo-box {
    position: relative;
    height: min(68vh, 560px);
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: #0b0a0f;

    canvas {
        display: block;
        width: 100%;
        height: 100%;
        touch-action: pan-y;
        cursor: crosshair;
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
}

.caption {
    margin: 1rem 0 0;
    font-size: 0.875rem;
    color: #a1a1aa;
    line-height: 1.5;
}
</style>

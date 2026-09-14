<template>
  <div class="atmos" :class="{ 'atmos--fallback': isFallback }" aria-hidden="true">
    <canvas v-if="!isFallback" ref="canvasRef" class="atmos__canvas" />
    <div class="grid-dots" />
    <div class="vignette" />
  </div>
</template>

<script setup lang="ts">
// Atmosphère en dégradé fluide animé (Flow WebGL Shader inspiré de gurade.netlify.app).
// Rendu WebGL 60fps accéléré, déformation fbm organique, zero interaction souris,
// respect strict de prefers-reduced-motion: reduce et extinction en arrière-plan.
import { onBeforeUnmount, onMounted, ref } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isFallback = ref(false);

const VS = `
attribute vec2 a;
void main() {
  gl_Position = vec4(a, 0.0, 1.0);
}
`;

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_res;
uniform float u_time;
uniform float u_angle;
uniform vec3 u_spotCol[2];
uniform vec2 u_spotPos[2];
uniform float u_freq;
uniform float u_warp;
uniform float u_seed;

#define PI 3.141592653589793

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v * 0.5 + 0.5;
}

float lum(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = vec2(uv.x, 1.0 - uv.y);
  float aspect = u_res.x / u_res.y;
  vec2 dir = vec2(sin(u_angle), -cos(u_angle));
  float t = u_time;

  vec2 pa = vec2(p.x * aspect, p.y);
  vec2 q = pa;
  vec2 np = (q + dir * t * 0.03) * u_freq * 0.75 + u_seed;
  vec2 w1 = vec2(fbm(np + t * 0.05), fbm(np + vec2(5.2, 1.3) - t * 0.04));
  q += (w1 - 0.5) * u_warp;

  // Flow deformation (u_type == 7)
  vec2 w2 = vec2(fbm(q * u_freq * 1.15 + 3.1 + t * 0.03), fbm(q * u_freq * 1.15 + 7.7 - t * 0.02));
  q += (w2 - 0.5) * u_warp * 0.55;

  float pw = 2.0;
  float eps = 0.012;
  vec3 acc = vec3(0.0);
  float ws = 0.0;
  for (int i = 0; i < 2; i++) {
    vec2 s = vec2(u_spotPos[i].x * aspect, u_spotPos[i].y);
    float d = distance(q, s);
    float w = 1.0 / (pow(d, pw) + eps);
    acc += u_spotCol[i] * w;
    ws += w;
  }
  vec3 col = acc / max(ws, 1e-6);

  // Chrome genre finish (u_genre == 1)
  float n = fbm(pa * u_freq * 0.8 + u_seed * 0.37 + t * 0.02);
  float s = dot(pa - vec2(aspect * 0.5, 0.5), dir);
  col = mix(vec3(lum(col)), col, 0.6);
  float band = sin((s * 1.8 + n * 0.8) * PI);
  col *= 0.76 + 0.24 * band;
  col += pow(max(band, 0.0), 4.0) * 0.10;
  col *= 0.85;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;
let quadBuffer: WebGLBuffer | null = null;
let animId: number | null = null;
let isVisible = true;
let isReducedMotion = false;
let motionMq: MediaQueryList | null = null;

interface UniformMap {
  u_res?: WebGLUniformLocation | null;
  u_time?: WebGLUniformLocation | null;
  u_angle?: WebGLUniformLocation | null;
  u_spotCol?: WebGLUniformLocation | null;
  u_spotPos?: WebGLUniformLocation | null;
  u_freq?: WebGLUniformLocation | null;
  u_warp?: WebGLUniformLocation | null;
  u_seed?: WebGLUniformLocation | null;
}
let uniforms: UniformMap = {};

function compileShader(type: number, source: string): WebGLShader | null {
  if (!gl) {
    return null;
  }
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initWebGL(canvas: HTMLCanvasElement): boolean {
  try {
    gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
      }) || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
  } catch {
    gl = null;
  }
  if (!gl) {
    return false;
  }

  const vs = compileShader(gl.VERTEX_SHADER, VS);
  const fs = compileShader(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) {
    return false;
  }

  program = gl.createProgram();
  if (!program) {
    return false;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return false;
  }

  gl.useProgram(program);

  quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  uniforms = {
    u_res: gl.getUniformLocation(program, "u_res"),
    u_time: gl.getUniformLocation(program, "u_time"),
    u_angle: gl.getUniformLocation(program, "u_angle"),
    u_spotCol: gl.getUniformLocation(program, "u_spotCol"),
    u_spotPos: gl.getUniformLocation(program, "u_spotPos"),
    u_freq: gl.getUniformLocation(program, "u_freq"),
    u_warp: gl.getUniformLocation(program, "u_warp"),
    u_seed: gl.getUniformLocation(program, "u_seed"),
  };

  // Configuration exacte demandée :
  // Scale 50% -> u_freq = 3.2 + (0.7 - 3.2) * 0.5 = 1.95
  // Distortion 55% -> u_warp = 0.55 * 1.1 = 0.605
  // Couleurs : #F87116 (spot 0: 80% 30%) et #7A1F5D (spot 1: 21% 68%)
  gl.uniform1f(uniforms.u_freq ?? null, 1.95);
  gl.uniform1f(uniforms.u_warp ?? null, 0.605);
  gl.uniform1f(uniforms.u_seed ?? null, 7.3);
  gl.uniform1f(uniforms.u_angle ?? null, (135 * Math.PI) / 180);

  // Spot 0 : #F87116 -> rgb(248, 113, 22)
  // Spot 1 : #7A1F5D -> rgb(122, 31, 93)
  const colBuf = new Float32Array([248 / 255, 113 / 255, 22 / 255, 122 / 255, 31 / 255, 93 / 255]);
  gl.uniform3fv(uniforms.u_spotCol ?? null, colBuf);

  const posBuf = new Float32Array([0.8, 0.3, 0.21, 0.68]);
  gl.uniform2fv(uniforms.u_spotPos ?? null, posBuf);

  return true;
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  if (!gl) {
    return;
  }
  // Rendu à échelle optimisée (0.6x de la résolution physique)
  // pour un 60fps constant et une diffusion fluide sans aucun aliasing.
  const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
  const w = Math.max(320, Math.round(window.innerWidth * scale));
  const h = Math.max(240, Math.round(window.innerHeight * scale));

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uniforms.u_res ?? null, w, h);
  }
}

function onVisibilityChange() {
  isVisible = !document.hidden;
}

function onMotionChange(e: MediaQueryListEvent) {
  isReducedMotion = e.matches;
  if (isReducedMotion && animId !== null) {
    cancelAnimationFrame(animId);
    animId = null;
  }
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) {
    return;
  }

  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  isReducedMotion = motionMq.matches;
  motionMq.addEventListener("change", onMotionChange);
  document.addEventListener("visibilitychange", onVisibilityChange);

  const success = initWebGL(canvas);
  if (!success) {
    isFallback.value = true;
    return;
  }

  resizeCanvas(canvas);
  window.addEventListener("resize", () => resizeCanvas(canvas), { passive: true });

  const startT = performance.now();

  function loop(now: number) {
    if (!gl) {
      return;
    }
    if (isVisible) {
      // Vitesse très douce et vaporeuse (0.35x de la vitesse par défaut)
      const elapsed = (now - startT) * 0.00035;
      gl.uniform1f(uniforms.u_time ?? null, elapsed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    if (!isReducedMotion) {
      animId = requestAnimationFrame(loop);
    }
  }

  if (isReducedMotion) {
    // Un seul rendu statique pour les préférences d'accessibilité
    if (gl) {
      gl.uniform1f(uniforms.u_time ?? null, 1.2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  } else {
    animId = requestAnimationFrame(loop);
  }
});

onBeforeUnmount(() => {
  if (animId !== null) {
    cancelAnimationFrame(animId);
    animId = null;
  }
  document.removeEventListener("visibilitychange", onVisibilityChange);
  motionMq?.removeEventListener("change", onMotionChange);
  if (gl && program) {
    if (quadBuffer) {
      gl.deleteBuffer(quadBuffer);
    }
    gl.deleteProgram(program);
  }
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.atmos {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background-color: var(--surface-0);
}

.atmos--fallback {
  background-color: #7a1f5d;
  background-image:
    radial-gradient(at 80% 30%, #f87116 0, transparent 62%), radial-gradient(at 21% 68%, #7a1f5d 0, transparent 62%);
}

.atmos__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.52;
}

.grid-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 8%, transparent) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, var(--surface-0) 30%, transparent 78%);
}

.vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--surface-0) 70%, transparent) 0%, transparent 130px),
    radial-gradient(ellipse 120% 88% at 50% 12%, transparent 30%, var(--surface-0) 90%);
}

@media (prefers-reduced-motion: reduce) {
  .atmos__canvas {
    animation: none;
  }
}
</style>

import{e as E,R as q,W as S,o as y,c as b,B as I,a as C,v as T,I as L}from"./4UZRhnQx.js";import{_ as B}from"./DlAUqK2U.js";const M=`
attribute vec2 a;
void main() {
  gl_Position = vec4(a, 0.0, 1.0);
}
`,z=`
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
`,U=E({__name:"HomeAtmosComponent",setup(N){const c=L(null),f=L(!1);let e=null,o=null,m=null,n=null,s=!0,l=!1,v=null,i={};function _(t,a){if(!e)return null;const r=e.createShader(t);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null}function P(t){try{e=t.getContext("webgl",{alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1})||t.getContext("experimental-webgl")}catch{e=null}if(!e)return!1;const a=_(e.VERTEX_SHADER,M),r=_(e.FRAGMENT_SHADER,z);if(!a||!r||(o=e.createProgram(),!o)||(e.attachShader(o,a),e.attachShader(o,r),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS)))return!1;e.useProgram(o),m=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,m),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const u=e.getAttribLocation(o,"a");e.enableVertexAttribArray(u),e.vertexAttribPointer(u,2,e.FLOAT,!1,0,0),i={u_res:e.getUniformLocation(o,"u_res"),u_time:e.getUniformLocation(o,"u_time"),u_angle:e.getUniformLocation(o,"u_angle"),u_spotCol:e.getUniformLocation(o,"u_spotCol"),u_spotPos:e.getUniformLocation(o,"u_spotPos"),u_freq:e.getUniformLocation(o,"u_freq"),u_warp:e.getUniformLocation(o,"u_warp"),u_seed:e.getUniformLocation(o,"u_seed")},e.uniform1f(i.u_freq??null,1.95),e.uniform1f(i.u_warp??null,.605),e.uniform1f(i.u_seed??null,7.3),e.uniform1f(i.u_angle??null,135*Math.PI/180);const R=new Float32Array([248/255,113/255,22/255,122/255,31/255,93/255]);e.uniform3fv(i.u_spotCol??null,R);const F=new Float32Array([.8,.3,.21,.68]);return e.uniform2fv(i.u_spotPos??null,F),!0}function p(t){if(!e)return;const a=Math.min(window.devicePixelRatio||1,1.5)*.6,r=Math.max(320,Math.round(window.innerWidth*a)),u=Math.max(240,Math.round(window.innerHeight*a));(t.width!==r||t.height!==u)&&(t.width=r,t.height=u,e.viewport(0,0,r,u),e.uniform2f(i.u_res??null,r,u))}let x=0;function d(t){if(e){if(s){const a=(t-x)*35e-5;e.uniform1f(i.u_time??null,a),e.drawArrays(e.TRIANGLE_STRIP,0,4)}!l&&s?n=requestAnimationFrame(d):n=null}}function g(){const t=c.value;t&&p(t)}function w(t){t.preventDefault(),n!==null&&(cancelAnimationFrame(n),n=null),f.value=!0}function h(){s=!document.hidden,!s&&n!==null?(cancelAnimationFrame(n),n=null):s&&n===null&&!l&&e&&(n=requestAnimationFrame(d))}function A(t){l=t.matches,l&&n!==null?(cancelAnimationFrame(n),n=null,e&&(e.uniform1f(i.u_time??null,1.2),e.drawArrays(e.TRIANGLE_STRIP,0,4))):!l&&n===null&&s&&e&&(n=requestAnimationFrame(d))}return q(()=>{const t=c.value;if(!t)return;if(v=window.matchMedia("(prefers-reduced-motion: reduce)"),l=v.matches,v.addEventListener("change",A),document.addEventListener("visibilitychange",h),t.addEventListener("webglcontextlost",w),!P(t)){f.value=!0;return}p(t),window.addEventListener("resize",g,{passive:!0}),x=performance.now(),l?e&&(e.uniform1f(i.u_time??null,1.2),e.drawArrays(e.TRIANGLE_STRIP,0,4)):n=requestAnimationFrame(d)}),S(()=>{n!==null&&(cancelAnimationFrame(n),n=null),document.removeEventListener("visibilitychange",h),v?.removeEventListener("change",A),window.removeEventListener("resize",g),c.value?.removeEventListener("webglcontextlost",w),e&&o&&(m&&e.deleteBuffer(m),e.deleteProgram(o))}),(t,a)=>(y(),b("div",{class:T(["atmos",{"atmos--fallback":f.value}]),"aria-hidden":"true"},[f.value?I("",!0):(y(),b("canvas",{key:0,ref_key:"canvasRef",ref:c,class:"atmos__canvas"},null,512)),a[0]||(a[0]=C("div",{class:"grid-dots"},null,-1)),a[1]||(a[1]=C("div",{class:"vignette"},null,-1))],2))}}),H=Object.assign(B(U,[["__scopeId","data-v-5dc262d1"]]),{__name:"HomeAtmosComponent"});export{H as _};

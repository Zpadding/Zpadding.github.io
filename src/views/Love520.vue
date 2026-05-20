<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const TOTAL = 5
const currentScene = ref(0)
const revealed = ref(false)
const hintText = ref('轻触屏幕')

const gradients = [
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fdfcfb 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)',
]

interface Particle {
  scene: number
  css: string
}

interface SceneData {
  icon: string
  title: string
  subtitle: string
  secret: string
  revealType: 'secret' | 'heart-rate' | 'final-message'
  heartRate?: boolean
}

const scenes: SceneData[] = [
  { icon: '🌹', title: '世间所有相遇', subtitle: '都是久别重逢', secret: '直到遇见你，我才相信这句话', revealType: 'secret' },
  { icon: '💖', title: '你是我', subtitle: '心跳的唯一理由', secret: '', revealType: 'heart-rate', heartRate: true },
  { icon: '✨', title: '你是银河', subtitle: '赠予我的糖', secret: '比漫天星辰更耀眼的是你', revealType: 'secret' },
  { icon: '🌸', title: '最好的爱', subtitle: '是长久的陪伴', secret: '愿岁岁年年，身边都有你', revealType: 'secret' },
  { icon: '💍', title: '往后余生', subtitle: '全都是你', secret: '', revealType: 'final-message' },
]

const shapes = [
  ['#ff6b6b', '#ee5a24', '#ff9ff3', '#f368e0'],
  ['#ff4757', '#ff6b81', '#f368e0', '#ff7f50'],
  ['#ffd700', '#fff200', '#ffec8b', '#ffe066'],
  ['#ffb7c5', '#ff9eb5', '#f8a5c2', '#f78fb3'],
  ['#ffd700', '#ffec8b', '#fffacd', '#ffe259'],
]

function rand(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function buildParticles(): Particle[] {
  const all: Particle[] = []
  for (let s = 0; s < TOTAL; s++) {
    const colors = shapes[s]
    for (let i = 0; i < 24; i++) {
      const isHeart = s === 1
      all.push({
        scene: s,
        css: `left:${rand(0, 100)}%;width:${rand(8, 24)}px;height:${rand(8, 24)}px;background:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${rand(4, 10)}s;animation-delay:${rand(0, 8)}s;opacity:${rand(0.2, 0.6)};border-radius:${isHeart ? '50% 50% 0 50%' : '50%'};`,
      })
    }
  }
  return all
}

const particles = buildParticles()
const activeParticles = ref<Particle[]>([])

function renderParticles(index: number) {
  activeParticles.value = particles.filter(p => p.scene === index)
}

function showScene(index: number) {
  currentScene.value = index
  revealed.value = false
  hintText.value = '轻触屏幕'
  renderParticles(index)
}

function goTo(index: number) {
  if (index < 0 || index >= TOTAL) return
  showScene(index)
}

function handleClick() {
  if (!revealed.value) {
    revealed.value = true
    if (currentScene.value === TOTAL - 1) {
      hintText.value = '❤️ 520'
    } else {
      hintText.value = '继续 →'
    }
  } else if (currentScene.value < TOTAL - 1) {
    showScene(currentScene.value + 1)
  } else {
    triggerConfetti()
  }
}

function triggerConfetti() {
  const emojis = ['🎉', '💖', '✨', '🌟', '🎊', '❤️']
  const body = document.body
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div')
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    el.style.cssText =
      `position:fixed;left:${rand(0, 100)}vw;top:-30px;font-size:${rand(16, 40)}px;pointer-events:none;z-index:999;animation:lv-confetti-fall ${rand(2, 5)}s ease-out forwards;animation-delay:${rand(0, 0.6)}s;`
    body.appendChild(el)
    setTimeout(() => el.remove(), 6000)
  }
}

onMounted(() => {
  showScene(0)
})
</script>

<template>
  <div
    id="love-app"
    :style="{ background: gradients[currentScene] }"
    @click="handleClick"
  >
    <!-- Particles -->
    <div id="particles">
      <div
        v-for="(p, i) in activeParticles"
        :key="i"
        class="particle"
        :class="'t' + currentScene"
        :style="p.css"
      />
    </div>

    <!-- Scene -->
    <div id="scene-wrap">
      <div
        v-for="(scene, i) in scenes"
        :key="i"
        class="scene"
        :class="{ active: currentScene === i }"
      >
        <div class="icon" :class="{ heartbeat: i === 1, glow: i === 4 }">{{ scene.icon }}</div>
        <h1 class="title">{{ scene.title }}</h1>
        <p class="sub">{{ scene.subtitle }}</p>

        <div v-if="scene.revealType === 'secret'" class="secret" :class="{ show: revealed && currentScene === i }">
          {{ scene.secret }}
        </div>

        <div v-if="scene.revealType === 'heart-rate'" class="heart-rate" :class="{ show: revealed && currentScene === i }">
          <span>❤</span><span>❤</span><span>❤</span>
        </div>

        <div v-if="scene.revealType === 'final-message'" class="final-message" :class="{ show: revealed && currentScene === i }">
          <p class="big-text">520 ❤️</p>
          <p class="small-text">我爱你</p>
          <button class="confetti-btn" @click.stop="triggerConfetti">🎊</button>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div id="bottom-bar">
      <div id="dots">
        <span
          v-for="i in TOTAL"
          :key="i"
          class="dot"
          :class="{ active: currentScene === i - 1 }"
          @click.stop="goTo(i - 1)"
        />
      </div>
      <p id="hint">{{ hintText }}</p>
    </div>
  </div>
</template>

<style scoped>
#love-app {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: background 1s ease;
}

/* ===== Particles ===== */
#particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.particle {
  position: absolute;
  top: 0;
  border-radius: 50%;
  will-change: transform, opacity;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
.particle.t0 { animation-name: lv-petal-fall; }
.particle.t1 { animation-name: lv-heart-float; }
.particle.t2 { animation-name: lv-star-twinkle; }
.particle.t3 { animation-name: lv-sakura-fall; }
.particle.t4 { animation-name: lv-sparkle-up; }

/* ===== Scene ===== */
#scene-wrap {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px 24px;
  width: 100%;
  max-width: 480px;
  cursor: pointer;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.scene {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateY(30px) scale(0.96);
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  will-change: transform, opacity;
  width: 100%;
}
.scene.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.icon {
  font-size: 80px;
  line-height: 1.2;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
  animation: icon-bob 3s ease-in-out infinite;
}
.icon.heartbeat {
  animation: heartbeat 1.4s ease-in-out infinite !important;
}
.icon.glow {
  animation: ring-glow 2s ease-in-out infinite !important;
}

@keyframes icon-bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  15%      { transform: scale(1.25); }
  30%      { transform: scale(1); }
  45%      { transform: scale(1.15); }
  60%      { transform: scale(1); }
}
@keyframes ring-glow {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(255,215,0,0.4)); }
  50%      { filter: drop-shadow(0 0 24px rgba(255,215,0,0.9)); }
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,0.15);
  letter-spacing: 4px;
  opacity: 0;
  transform: translateY(24px);
}
.scene.active .title {
  animation: fadeInUp 0.8s 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.sub {
  font-size: 20px;
  font-weight: 400;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 1px 8px rgba(0,0,0,0.1);
  letter-spacing: 6px;
  opacity: 0;
  transform: translateY(20px);
}
.scene.active .sub {
  animation: fadeInUp 0.8s 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.secret,
.heart-rate,
.final-message {
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.4s ease;
  pointer-events: none;
  margin-top: 20px;
}
.secret.show,
.heart-rate.show,
.final-message.show {
  opacity: 1;
  transform: translateY(0);
}

.secret {
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 1px 6px rgba(0,0,0,0.08);
  letter-spacing: 2px;
  padding: 12px 24px;
  border-radius: 20px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.heart-rate {
  display: flex;
  gap: 8px;
  font-size: 28px;
  color: #ff4757;
  animation: pulse-text 0.6s ease-in-out infinite;
}
@keyframes pulse-text {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.final-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.big-text {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(90deg, #ff4757, #ff6b81, #ff4757);
  background-size: 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 2s linear infinite;
  letter-spacing: 4px;
}
@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
.small-text {
  font-size: 18px;
  color: rgba(255,255,255,0.85);
  letter-spacing: 8px;
}
.confetti-btn {
  margin-top: 12px;
  font-size: 36px;
  cursor: pointer;
  animation: icon-bob 2s ease-in-out infinite;
  transition: transform 0.2s;
  background: none;
  border: none;
  outline: none;
}
.confetti-btn:active {
  transform: scale(1.3);
}

/* ===== Bottom Bar ===== */
#bottom-bar {
  position: fixed;
  bottom: 48px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 2;
}
#dots {
  display: flex;
  gap: 10px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.35);
  transition: all 0.3s ease;
  cursor: pointer;
}
.dot.active {
  width: 24px;
  border-radius: 4px;
  background: rgba(255,255,255,0.85);
}
#hint {
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  letter-spacing: 2px;
  animation: hint-pulse 2s ease-in-out infinite;
}
@keyframes hint-pulse {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 0.9; }
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .title { font-size: 28px; letter-spacing: 3px; }
  .sub   { font-size: 17px; letter-spacing: 4px; }
  .icon  { font-size: 64px; }
  .big-text { font-size: 36px; }
  .secret { font-size: 14px; padding: 10px 18px; }
}
</style>

<!-- keyframes 放在非 scoped 块中，避免构建时被 hash 导致动画名不匹配 -->
<style>
@keyframes lv-petal-fall {
  0%   { transform: translateY(-10vh) rotate(0deg) scale(0.8); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.6; }
  100% { transform: translateY(110vh) rotate(720deg) scale(1.2); opacity: 0; }
}
@keyframes lv-heart-float {
  0%   { transform: translateY(100vh) scale(0.2) rotate(0deg); opacity: 0; }
  20%  { opacity: 0.8; transform: translateY(70vh) scale(1); }
  80%  { opacity: 0.6; }
  100% { transform: translateY(-10vh) scale(0.5) rotate(30deg); opacity: 0; }
}
@keyframes lv-star-twinkle {
  0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
  50% { opacity: 0.9; transform: scale(1.3) rotate(180deg); }
}
@keyframes lv-sakura-fall {
  0%   { transform: translateY(-8vh) translateX(0) rotate(0deg); opacity: 0; }
  10%  { opacity: 0.8; }
  50%  { transform: translateY(50vh) translateX(40px) rotate(360deg); }
  100% { transform: translateY(108vh) translateX(-20px) rotate(720deg); opacity: 0; }
}
@keyframes lv-sparkle-up {
  0%   { transform: translateY(100vh) scale(0) rotate(0deg); opacity: 0; }
  30%  { opacity: 0.8; transform: translateY(60vh) scale(1.4); }
  70%  { opacity: 0.6; }
  100% { transform: translateY(-10vh) scale(0.3) rotate(360deg); opacity: 0; }
}
@keyframes lv-confetti-fall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { StarFilled, Timer } from '@element-plus/icons-vue'

const router = useRouter()

const cards = [
  {
    title: '520 ❤️',
    desc: '浪漫交互场景 — 轻触屏幕，感受心动时刻',
    route: '/love520',
    icon: StarFilled,
    color: 'linear-gradient(135deg, #f093fb, #f5576c)',
  },
  {
    title: '下班倒计时',
    desc: '工作日进度追踪 — 距下班还有多久',
    route: '/offduty',
    icon: Timer,
    color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  },
]

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="home">
    <h1 class="title">Zpadding</h1>
    <p class="subtitle">选择你想体验的功能</p>

    <div class="card-container">
      <div
        v-for="card in cards"
        :key="card.route"
        class="card"
        :style="{ background: card.color }"
        @click="navigate(card.route)"
      >
        <el-icon class="card-icon" :size="48">
          <component :is="card.icon" />
        </el-icon>
        <h2 class="card-title">{{ card.title }}</h2>
        <p class="card-desc">{{ card.desc }}</p>
        <span class="card-enter">进入 →</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  gap: 48px;
}

.title {
  font-size: 48px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 8px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
  margin: 0;
}

.subtitle {
  font-size: 20px;
  color: rgba(255,255,255,0.8);
  letter-spacing: 4px;
  margin: 0;
}

.card-container {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 700px;
}

.card {
  width: 300px;
  padding: 40px 32px;
  border-radius: 24px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.08);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 48px rgba(0,0,0,0.25);
}

.card:hover::before {
  opacity: 1;
}

.card-icon {
  position: relative;
  z-index: 1;
  margin-bottom: 8px;
}

.card-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  position: relative;
  z-index: 1;
}

.card-desc {
  font-size: 14px;
  opacity: 0.85;
  line-height: 1.6;
  margin: 0;
  position: relative;
  z-index: 1;
}

.card-enter {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  margin-top: 8px;
  padding: 6px 20px;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 20px;
}

.card:hover .card-enter {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.9);
}

@media (max-width: 480px) {
  .title { font-size: 36px; letter-spacing: 6px; }
  .subtitle { font-size: 16px; }
  .card { width: 100%; max-width: 300px; padding: 32px 24px; }
}
</style>

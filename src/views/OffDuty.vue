<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const OFF_DUTY_HOUR = 18
const WORK_START_HOUR = 9

const remainingSeconds = ref(0)
const totalSeconds = ref(0)
const isOffDutyDirection = ref(true)
const msgLabel = ref('下班')

let timer: ReturnType<typeof setInterval> | null = null

const h = computed(() => Math.floor(remainingSeconds.value / 3600))
const m = computed(() => Math.floor((remainingSeconds.value % 3600) / 60))
const s = computed(() => remainingSeconds.value % 3600 % 60)

const progressPercent = computed(() => {
  const p = (1 - remainingSeconds.value / totalSeconds.value) * 100
  return Math.max(0, Math.min(100, p))
})

function padTime(n: number): string {
  return n >= 10 ? String(n) : '0' + n
}

function initTimer() {
  const now = new Date()
  const currentH = now.getHours()
  const currentM = now.getMinutes()
  const currentS = now.getSeconds()
  const begTime = (currentH * 60 + currentM) * 60 + currentS

  if (currentH >= OFF_DUTY_HOUR || currentH < WORK_START_HOUR) {
    isOffDutyDirection.value = false
    msgLabel.value = '上班'
    // After off-duty, count down to next day 9am
    const endSeconds = currentH >= OFF_DUTY_HOUR
      ? (24 + WORK_START_HOUR) * 3600
      : WORK_START_HOUR * 3600
    remainingSeconds.value = endSeconds - begTime
    totalSeconds.value = (24 + WORK_START_HOUR - OFF_DUTY_HOUR) * 3600
  } else {
    isOffDutyDirection.value = true
    msgLabel.value = '下班'
    const endSeconds = OFF_DUTY_HOUR * 3600
    remainingSeconds.value = endSeconds - begTime
    totalSeconds.value = (OFF_DUTY_HOUR - WORK_START_HOUR) * 3600
  }
}

function tick() {
  if (remainingSeconds.value > 0) {
    remainingSeconds.value--
  } else {
    if (timer) clearInterval(timer)
  }
}

onMounted(() => {
  initTimer()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="off-duty">
    <div class="center">
      <ul class="showTime">
        <li>
          <p class="num-box">{{ padTime(h) }}</p>
          <p>Hrs</p>
        </li>
        <li>
          <p class="num-box">{{ padTime(m) }}</p>
          <p>Mins</p>
        </li>
        <li>
          <p class="num-box">{{ padTime(s) }}</p>
          <p>Sec</p>
        </li>
      </ul>

      <div class="progress">
        <div class="progress-con">
          <div class="show" :style="{ width: progressPercent + '%' }" />
        </div>
      </div>

      <div class="info-text">
        距离{{ msgLabel }}还有
        <span class="count">{{ remainingSeconds }}</span>秒；
        计{{ padTime(h) }}小时{{ padTime(m) }}分钟{{ padTime(s) }}秒
      </div>
    </div>
  </div>
</template>

<style scoped>
.off-duty {
  height: 100%;
  font-family: 'STXingkai', 'PingFang SC', sans-serif;
  background: url('/bg.jpg') no-repeat;
  background-position: center 20%;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center {
  text-align: center;
}

.showTime {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  width: 250px;
  text-align: center;
  font-size: 20px;
}

.showTime li p:first-child {
  width: 50px;
  height: 50px;
  color: #fff;
  font-size: 35px;
  line-height: 50px;
  border-radius: 5px;
  background-color: #000;
  margin: 0;
}

.num-box {
  width: 50px;
  height: 50px;
  color: #fff;
  font-size: 35px;
  line-height: 50px;
  border-radius: 5px;
  background-color: #000;
  margin: 0;
}

.progress {
  text-align: center;
  margin-top: 20px;
}

.progress-con {
  display: inline-block;
  width: 300px;
  height: 10px;
  border-radius: 5px;
  background-color: #e1375d;
  position: relative;
}

.progress-con .show {
  height: 100%;
  background-color: #43c2b5;
  border-radius: 5px;
  position: absolute;
  left: 0;
  top: 0;
  transition: width 0.3s ease;
}

.info-text {
  padding-top: 20px;
  text-align: center;
  font-size: 25px;
}

.info-text .count {
  color: red;
}
</style>

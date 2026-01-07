<script setup lang="ts">
defineProps<{
  loading?: boolean;
}>();

// We'll let the parent control the visibility through the loading prop,
// but we also have internal state for the exit animation.
</script>

<template>
  <Transition name="fade">
    <div v-if="loading" :class="['splash-screen']">
      <div class="content">
        <div class="logo-wrapper">
          <img src="/favicon.ico" alt="Logo" class="logo" />
          <div class="shimmer"></div>
        </div>
        <div class="loader-container">
          <div class="loader-bar"></div>
        </div>
        <p class="loading-text">🏃‍努力加载中...</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.logo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 0 20px rgba(0, 168, 255, 0.4));
}

.logo {
  width: 80px;
  height: 80px;
  z-index: 2;
  animation: pulse 2s infinite ease-in-out;
}

.shimmer {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent 160deg,
    rgba(255, 255, 255, 0.1) 180deg,
    transparent 200deg,
    transparent 360deg
  );
  animation: rotate 3s linear infinite;
  pointer-events: none;
}

/* 暂时不需要进度条加载 */
.loader-container {
  display: none;
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.loader-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);
  animation: progress 2s infinite ease-in-out;
  transform-origin: left;
}

.loading-text {
  color: rgba(255, 255, 255, 0.7);
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 0.9rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  margin: 0;
  animation: breathe 2s infinite ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    filter: brightness(1);
  }

  50% {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes progress {
  0% {
    transform: scaleX(0);
  }

  50% {
    transform: scaleX(0.5);
  }

  100% {
    transform: scaleX(1);
  }
}

@keyframes breathe {
  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>

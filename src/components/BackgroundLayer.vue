<script setup lang="ts">
import { computed } from 'vue';
import { useLuckyStore } from '@/stores/lucky';
import { useAssetsStore } from '@/stores/assets';

const luckyStore = useLuckyStore();
const assetsStore = useAssetsStore();

const backgroundStyle = computed(() => {
  const level = luckyStore.luckyLevel;
  const imageKey = `bg${level}`;
  const imageUrl = assetsStore.getImage(imageKey);

  if (imageUrl) {
    return {
      backgroundImage: `url(${imageUrl})`,
    };
  }
  return {};
});
</script>

<template>
  <div class="background-layer" :style="backgroundStyle"></div>
</template>

<style scoped>
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  background-size: 100% 100%;
}
</style>

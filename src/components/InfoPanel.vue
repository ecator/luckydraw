<script setup lang="ts">
import { computed } from 'vue';
import { useLuckyStore } from '@/stores/lucky';
import { useAssetsStore } from '@/stores/assets';

const luckyStore = useLuckyStore();
const assetsStore = useAssetsStore();
const titleStyle = computed(() => {
  const level = luckyStore.luckyLevel;
  const imageKey = `title${level}`;
  console.log('Setting title image for level:', level, 'with key:', imageKey);
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
  <div class="info-panel">
    <div class="draw-count">一次抽: {{ luckyStore.drawCount }} 人</div>
    <div class="lucky-count">
      已中奖: {{ luckyStore.drawnEmpnos.length }} 人
    </div>
    <div class="lucky-count">
      未中奖: {{ luckyStore.availableAvatars.length }} 人
    </div>
    <div class="lucky-count">总人数: {{ luckyStore.allAvatars.length }} 人</div>
  </div>
  <div class="titlebox" :style="titleStyle" />
</template>

<style scoped>
.info-panel {
  position: absolute;
  z-index: 99;
  left: 10px;
  top: 5px;
}

.draw-count,
.lucky-count {
  color: #ffffff;
  background-color: #f9d099;
  border: none;
  font-size: 16px;
  padding: 4px 6px;
  margin-bottom: 3px;
  border-radius: 4px;
}

.titlebox {
  width: 33vw;
  height: 20vh;
  margin: 0 auto;
  background-size: 100% 100%;
}
</style>

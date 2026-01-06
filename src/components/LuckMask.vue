<script setup lang="ts">
import { computed } from 'vue';
import { useLuckyStore } from '@/stores/lucky';
import { LuckyState } from '@/types/lucky';
import type { Avatar } from '@/types/config';
interface Props {
  maskAvatarSize: number;
}
const { maskAvatarSize } = defineProps<Props>();
const luckyStore = useLuckyStore();
const winners = computed(() =>
  luckyStore.allAvatars.filter((avatar) =>
    luckyStore.currentDrawnEmpnos.includes(avatar.empno)
  )
);
const showMask = computed(
  () => luckyStore.luckyState === LuckyState.SHOWING_RESULTS
);

function getWinnerStyle(avatar: Avatar) {
  return {
    backgroundImage: `url(${avatar.dataUrl})`,
    height: `${maskAvatarSize}px`,
    width: `${maskAvatarSize}px`,
  };
}
function getEmpnoStyle(avatar: Avatar) {
  let count = avatar.empno.length;
  if (count < 5) {
    count = 7;
  } else if (count < 10) {
    count = 10;
  } else {
    count++;
  }
  return {
    fontSize: `${maskAvatarSize / count}px`,
  };
}
</script>

<template>
  <Transition name="mask-fade">
    <div v-if="showMask" class="mask">
      <div
        v-for="avatar in winners"
        :key="avatar.empno"
        class="avatar bigimg"
        :style="getWinnerStyle(avatar)"
      >
        <div :style="getEmpnoStyle(avatar)">{{ avatar.empno }}</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.mask {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  position: absolute;
  z-index: 99;
  height: 33vh;
  width: 100vw;
  top: 35vh;
}

.mask-fade-enter-active {
  transition:
    opacity 1s ease,
    transform 1s ease;
}

.mask-fade-leave-active {
  transition: none;
}

.mask-fade-enter-from,
.mask-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.mask-fade-enter-to,
.mask-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.avatar {
  display: inline-block;
  border-radius: 0px;
  cursor: pointer;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  flex-grow: 0;
}

.bigimg {
  background-size: 100% 100%;
  box-shadow: 0px 1px 20px 20px #f9d099;
  z-index: 99;
}

.bigimg > div {
  display: block;
  font-size: medium;
  text-align: center;
  transition: all 1s;
  font-family: '微软雅黑', 'Dosis', sans-serif;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  background-color: #a83922;
  color: #f9d099;
}
</style>

<script setup lang="ts">
import { useLuckyStore } from '@/stores/lucky';
import type { Avatar } from '@/types/config';

interface Props {
  avatarSize: number;
}

const { avatarSize } = defineProps<Props>();

const luckyStore = useLuckyStore();

function getAvatarStyle(avatar: Avatar) {
  return {
    width: `${avatarSize}px`,
    height: `${avatarSize}px`,
    backgroundImage: `url(${avatar.dataUrlThumbnail})`,
    transform: `scale(${luckyStore.currentDrawnEmpnos.includes(avatar.empno) ? 1.5 : 1})`,
  };
}
</script>

<template>
  <div class="container">
    <div
      v-for="avatar in luckyStore.availableAvatars"
      :key="avatar.empno"
      class="avatar"
      :style="getAvatarStyle(avatar)"
    ></div>
  </div>
</template>

<style scoped>
.container {
  border: none;
  overflow: hidden;
  z-index: 10;
  width: 90vw;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  margin-top: 1px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}

.avatar {
  display: inline-block;
  transition: transform 0.6s ease;
  border-radius: 0px;
  cursor: pointer;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
}
</style>

import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useLuckyStore } from '@/stores/lucky';

export function useLayout() {
  const avatarSize = ref(0);
  const maskAvatarSize = ref(0);
  const luckyStore = useLuckyStore();
  function calculateLayout() {
    // 计算抽奖池头像大小
    const avatarCount = luckyStore.availableAvatars.length;
    if (avatarCount === 0) {
      avatarSize.value = 0;
      return;
    }

    const containerWidth = window.innerWidth * 0.9;
    const containerHeight = window.innerHeight * 0.7;
    const aspectRatio = containerWidth / containerHeight;

    const hc = Math.sqrt(avatarCount / aspectRatio);
    const wc = Math.ceil(hc * aspectRatio);

    const size = Math.min(containerWidth / wc, containerHeight / hc);

    avatarSize.value = size;

    // 计算Mask头像大小
    const drawnCount = luckyStore.drawCount as number;
    if (drawnCount === 0) {
      maskAvatarSize.value = 0;
      return;
    }
    const drawnWidth = window.innerWidth / drawnCount - 2;
    maskAvatarSize.value = Math.min(drawnWidth, 512);
  }
  watch(
    [() => luckyStore.availableAvatars.length, () => luckyStore.drawCount],
    calculateLayout
  );

  onMounted(() => {
    window.addEventListener('resize', calculateLayout);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', calculateLayout);
  });

  return {
    avatarSize,
    maskAvatarSize,
    calculateLayout,
  };
}

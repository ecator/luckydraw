<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useLuckyStore } from '@/stores/lucky';
import { useAssetsStore } from '@/stores/assets';
import { getConfig, getAvatars, getImages, getAudios } from '@/api/tauri';
import { useLuckyControl } from '@/composables/useLuckyControl';
import { useKeyboard } from '@/composables/useKeyboard';
import { useAudio } from '@/composables/useAudio';
import BackgroundLayer from '@/components/BackgroundLayer.vue';
import InfoPanel from '@/components/InfoPanel.vue';
import AvatarGrid from '@/components/AvatarGrid.vue';
import Avatar3D from '@/components/Avatar3D.vue';
import LuckMask from '@/components/LuckMask.vue';
import SplashScreen from '@/components/SplashScreen.vue';
import { useLayout } from '@/composables/useLayout';

const isLoading = ref(true);
const luckyStore = useLuckyStore();
const assetsStore = useAssetsStore();

// Initialize layout management
const { avatarSize, maskAvatarSize } = useLayout();

// Initialize lucky control
const { runDraw, confirmWinners } = useLuckyControl();

// Initialize keyboard handlers
useKeyboard({
  runDraw: runDraw,
  confirmWinners: confirmWinners,
});

// Initialize audio
const { initAudioElements } = useAudio();

// Load application data on mount
onMounted(async () => {
  try {
    // Load configuration
    const config = await getConfig();
    luckyStore.setConfig(config);
    luckyStore.setLuckyMode(config.LUCKY_MODE);

    // Load avatars
    const avatars = await getAvatars();
    luckyStore.setAllAvatars(avatars);
    // Load images
    const images = await getImages();
    assetsStore.setImages(images);

    // Load audios
    const audios = await getAudios();
    assetsStore.setAudios(audios);

    // Load drawn avatars from Storage
    await luckyStore.loadDrawnAvatars();

    // Initialize audio elements
    initAudioElements();

    isLoading.value = false;
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
});

// Cleanup on unmount
import { onUnmounted } from 'vue';
onUnmounted(() => {});
</script>

<template>
  <SplashScreen :loading="isLoading" />
  <BackgroundLayer />
  <InfoPanel />
  <AvatarGrid
    v-if="luckyStore.luckyMode === 'grid'"
    :avatar-size="avatarSize"
  />
  <Avatar3D v-else />
  <LuckMask :mask-avatar-size="maskAvatarSize" />
</template>

<style scoped></style>

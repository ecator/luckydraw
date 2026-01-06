import { ref, watch, onUnmounted } from 'vue';
import { useLuckyStore } from '@/stores/lucky';
import { useAssetsStore } from '@/stores/assets';
import { LuckyState } from '@/types/lucky';

export function useAudio() {
  const luckyStore = useLuckyStore();
  const assetsStore = useAssetsStore();

  const bgAudioEl = ref<HTMLAudioElement | null>(null);
  const activeAudioEl = ref<HTMLAudioElement | null>(null);

  function initAudioElements() {
    bgAudioEl.value = new Audio();
    bgAudioEl.value.loop = true;

    activeAudioEl.value = new Audio();
  }

  function playBackgroundMusic() {
    if (!bgAudioEl.value) return;

    const level = luckyStore.luckyLevel;
    const audioKey = `bg${level}`;
    const audioUrl = assetsStore.getAudio(audioKey);

    if (audioUrl) {
      bgAudioEl.value.src = audioUrl;
      bgAudioEl.value.play().catch((error) => {
        console.warn('Failed to play background music:', error);
      });
    }
  }

  function stopBackgroundMusic() {
    if (bgAudioEl.value) {
      bgAudioEl.value.pause();
      bgAudioEl.value.currentTime = 0;
    }
  }

  function playActiveSound() {
    if (!activeAudioEl.value) return;

    const level = luckyStore.luckyLevel;
    const audioKey = `active${level}`;
    const audioUrl = assetsStore.getAudio(audioKey);

    if (audioUrl) {
      activeAudioEl.value.src = audioUrl;
      activeAudioEl.value.play().catch((error) => {
        console.warn('Failed to play active sound:', error);
      });
    }
  }
  function stopActiveSound() {
    if (activeAudioEl.value) {
      activeAudioEl.value.pause();
      activeAudioEl.value.currentTime = 0;
    }
  }

  // Watch lottery state changes
  watch(
    () => luckyStore.luckyState,
    (newState) => {
      if (newState === LuckyState.DRAWING) {
        stopActiveSound();
        playBackgroundMusic();
      } else if (newState === LuckyState.SHOWING_RESULTS) {
        stopBackgroundMusic();
        playActiveSound();
      } else {
        stopBackgroundMusic();
        stopActiveSound();
      }
    }
  );

  onUnmounted(() => {
    stopBackgroundMusic();
    if (bgAudioEl.value) {
      bgAudioEl.value = null;
    }
    if (activeAudioEl.value) {
      activeAudioEl.value = null;
    }
  });

  return {
    bgAudioEl,
    activeAudioEl,
    initAudioElements,
    playBackgroundMusic,
    stopBackgroundMusic,
    playActiveSound,
    stopActiveSound,
  };
}

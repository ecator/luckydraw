import { onMounted, onUnmounted } from 'vue';
import { useLuckyStore } from '@/stores/lucky';
import { LuckyState } from '@/types/lucky';
import type { LuckyLevel, DrawCount } from '@/types/lucky';
import { clearDrawnAvatars } from '@/api/storage';
import { toggleFullScreen } from '@/api/tauri';

export function useKeyboard({
  runDraw,
  confirmWinners,
}: {
  runDraw: () => void;
  confirmWinners: () => void;
}) {
  const luckyStore = useLuckyStore();

  function handleKeyDown(event: KeyboardEvent) {
    const { key, code, shiftKey } = event;
    console.log(`Key pressed: ${key} (code: ${code}, shift: ${shiftKey})`);

    // Prevent tab key default behavior
    if (key === 'Tab') {
      event.preventDefault();
    }

    // Get config keys
    const config = luckyStore.config;
    if (!config) return;

    // Start drawing
    if (
      key === config.LUCKY_KEY &&
      luckyStore.luckyState === LuckyState.INITIAL
    ) {
      runDraw();
      return;
    }

    // Confirm winners
    if (
      key === config.LUCKY_INIT_KEY &&
      luckyStore.luckyState === LuckyState.SHOWING_RESULTS
    ) {
      confirmWinners();
      return;
    }

    // Clear all winners
    if (
      key === config.CLEAR_KEY &&
      luckyStore.luckyState === LuckyState.INITIAL
    ) {
      if (!confirm('Are you sure you want to clear all drawn winners?')) {
        return;
      }
      clearDrawnAvatars();
      luckyStore.loadDrawnAvatars();
      return;
    }

    // Toggle fullscreen
    if (
      key === config.FULL_SCREEN_KEY &&
      luckyStore.luckyState !== LuckyState.DRAWING
    ) {
      toggleFullScreen();
      return;
    }

    // Toggle between grid and 3D mode (F1/F2)
    if (
      (key === 'F1' || key === 'F2') &&
      luckyStore.luckyState === LuckyState.INITIAL
    ) {
      const mode = key === 'F1' ? 'grid' : '3d';
      luckyStore.setLuckyMode(mode);
      return;
    }

    // Handle number keys 1-9 - switch lottery level
    if (
      !shiftKey &&
      /^[1-9]$/.test(key) &&
      luckyStore.luckyState === LuckyState.INITIAL
    ) {
      console.log(`Switching lottery level to ${key}`);
      const level = parseInt(key) as LuckyLevel;
      luckyStore.setLuckyLevel(level);
      return;
    }

    // Handle Shift + 0-9 - set draw count
    if (
      shiftKey &&
      /^Digit[0-9]$/.test(code) &&
      luckyStore.luckyState === LuckyState.INITIAL
    ) {
      const numMatch = code.match(/\d/);
      if (numMatch) {
        const num = parseInt(numMatch[0]);
        const count = (num === 0 ? 10 : num) as DrawCount;
        luckyStore.setDrawCount(count);
      }
      return;
    }
  }

  onMounted(() => {
    document.body.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    document.body.removeEventListener('keydown', handleKeyDown);
  });

  return {
    handleKeyDown,
  };
}

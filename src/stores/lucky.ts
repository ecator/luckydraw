import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Avatar, Config } from '@/types/config';
import type { LuckyLevel, DrawCount, LuckyMode } from '@/types/lucky';
import { LuckyState } from '@/types/lucky';
import { getDrawnAvatars, setDrawnAvatars } from '@/api/storage';

export const useLuckyStore = defineStore('lucky', () => {
  // State
  const luckyState = ref<LuckyState>(LuckyState.INITIAL);
  const luckyLevel = ref<LuckyLevel>(1);
  const drawCount = ref<DrawCount>(1);
  const luckyMode = ref<LuckyMode>('grid');

  // Configuration
  const config = ref<Config | null>(null);

  // Avatars data
  const allAvatars = ref<Avatar[]>([]);
  const drawnEmpnos = ref<string[]>([]);
  const currentDrawnEmpnos = ref<string[]>([]);

  // Current lottery parameters
  const currentLuckyTime = computed<number>(() => {
    if (!config.value) return 0;

    let timeIdx =
      (config.value.LUCKY_TIMES.length < luckyLevel.value
        ? config.value.LUCKY_TIMES.length
        : luckyLevel.value) - 1;
    return config.value.LUCKY_TIMES[timeIdx] as number;
  });
  const currentLuckySpeed = computed<number>(() => {
    if (!config.value) return 0;

    let speedIdx =
      (config.value.LUCKY_SPEEDS.length < luckyLevel.value
        ? config.value.LUCKY_SPEEDS.length
        : luckyLevel.value) - 1;
    return config.value.LUCKY_SPEEDS[speedIdx] as number;
  });

  // Getters
  const availableAvatars = computed(() => {
    return allAvatars.value.filter(
      (avatar) => !drawnEmpnos.value.includes(avatar.empno)
    );
  });

  // Actions
  function setConfig(newConfig: Config) {
    config.value = newConfig;
  }

  function setAllAvatars(avatars: Avatar[]) {
    allAvatars.value = avatars;
  }

  function setLuckyLevel(level: LuckyLevel) {
    luckyLevel.value = level;
  }

  function setDrawCount(count: DrawCount) {
    drawCount.value = count;
  }

  function setLuckyMode(mode: LuckyMode) {
    luckyMode.value = mode;
  }

  function setLuckyState(state: LuckyState) {
    luckyState.value = state;
  }

  function addDrawnAvatars(empnos: string[]) {
    drawnEmpnos.value.push(...empnos);
    setDrawnAvatars(drawnEmpnos.value);
  }

  function loadDrawnAvatars() {
    drawnEmpnos.value = getDrawnAvatars();
  }

  function clearDrawnAvatars() {
    drawnEmpnos.value = [];
    setDrawnAvatars([]);
  }

  return {
    // State
    luckyState,
    luckyLevel,
    drawCount,
    luckyMode,
    config,
    allAvatars,
    drawnEmpnos,
    currentDrawnEmpnos,
    currentLuckyTime,
    currentLuckySpeed,
    availableAvatars,

    // Actions
    setConfig,
    setAllAvatars,
    setLuckyLevel,
    setDrawCount,
    setLuckyMode,
    setLuckyState,
    addDrawnAvatars,
    loadDrawnAvatars,
    clearDrawnAvatars,
  };
});

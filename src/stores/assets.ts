import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAssetsStore = defineStore('assets', () => {
  // State
  const images = ref<Map<string, string>>(new Map());
  const audios = ref<Map<string, string>>(new Map());

  // Actions
  function setImages(imagesData: Record<string, string>) {
    images.value = new Map(Object.entries(imagesData));
  }

  function setAudios(audiosData: Record<string, string>) {
    audios.value = new Map(Object.entries(audiosData));
  }

  function getImage(key: string): string | undefined {
    if (!images.value.has(key)) {
      key = key.replace(/\d+$/, '');
    }
    return images.value.get(key);
  }

  function getAudio(key: string): string | undefined {
    if (!audios.value.has(key)) {
      key = key.replace(/\d+$/, '');
    }
    return audios.value.get(key);
  }

  return {
    // State
    images,
    audios,

    // Actions
    setImages,
    setAudios,
    getImage,
    getAudio,
  };
});

import { invoke } from '@tauri-apps/api/core';
import type { Avatar, Config } from '@/types/config';
import type { ImageKey, AudioKey } from '@/types/lucky';

/**
 * Get application configuration from Rust backend
 */
export async function getConfig(): Promise<Config> {
  return await invoke<Config>('get_config');
}

/**
 * Get all avatars with thumbnails from Rust backend
 */
export async function getAvatars(): Promise<Avatar[]> {
  return await invoke<Avatar[]>('get_avatars');
}

/**
 * Get images (backgrounds and titles) from Rust backend
 * Returns a map of image keys to base64 data URLs
 */
export async function getImages(): Promise<Record<ImageKey, string>> {
  return await invoke<Record<ImageKey, string>>('get_imgs');
}

/**
 * Get audio files from Rust backend
 * Returns a map of audio keys to base64 data URLs
 */
export async function getAudios(): Promise<Record<AudioKey, string>> {
  return await invoke<Record<AudioKey, string>>('get_audios');
}

/**
 * Toggle fullscreen mode
 */
export async function toggleFullScreen(): Promise<void> {
  await invoke<void>('toggle_full_screen');
}

export async function getLuckyList(): Promise<string[]> {
  return await invoke<string[]>('get_lucky_list');
}

export async function saveLuckyList(luckyList: string[]): Promise<void> {
  await invoke<void>('save_lucky_list', { luckyList });
}

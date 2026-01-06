// LocalStorage keys
export const STORAGE_KEYS = {
  LUCKY_AVATARS: 'luckyAavatars',
  EMPNO: 'empno',
} as const;

// Type-safe localStorage utilities
export function getDrawnAvatars(): string[] {
  const stored = localStorage.getItem(STORAGE_KEYS.LUCKY_AVATARS);
  if (
    !stored ||
    stored.trim() === '' ||
    !stored.trim().startsWith('[') ||
    !stored.trim().endsWith(']')
  ) {
    return [];
  }
  return JSON.parse(stored) as string[];
}

export function setDrawnAvatars(avatars: string[]): void {
  localStorage.setItem(STORAGE_KEYS.LUCKY_AVATARS, JSON.stringify(avatars));
}

export function clearDrawnAvatars(): void {
  localStorage.removeItem(STORAGE_KEYS.LUCKY_AVATARS);
}

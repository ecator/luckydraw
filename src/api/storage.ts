import { getLuckyList, saveLuckyList } from './tauri';

export async function getDrawnAvatars(): Promise<string[]> {
  const luckyList = await getLuckyList();
  return luckyList;
}

export async function setDrawnAvatars(avatars: string[]): Promise<void> {
  await saveLuckyList(avatars);
}

export async function clearDrawnAvatars(): Promise<void> {
  await saveLuckyList([]);
}

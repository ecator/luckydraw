import { invoke } from '@tauri-apps/api/core';


async function getConfig() {
  return await invoke("get_config");
}

async function getAvatars() {
  let avatars = await invoke("get_avatars");
  let avatarMap = new Map();
  for (let avatar of avatars) {
    avatarMap.set(avatar.empno, avatar);
  }
  return avatarMap;
}


async function getImgs() {
  let imgs = await invoke("get_imgs");
  return new Map(Object.keys(imgs).map(k => [k, imgs[k]]));
}


async function getAudios() {
  let audios = await invoke("get_audios");
  return new Map(Object.keys(audios).map(k => [k, audios[k]]));
}

async function toggleFullScreen() {
  await invoke("toggle_full_screen");
}


export { getConfig, getAvatars, getImgs, getAudios, toggleFullScreen };

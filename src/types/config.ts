import type { LuckyMode } from './lucky';
// Config types matching Rust backend
export interface Config {
  LUCKY_KEY: string;
  LUCKY_INIT_KEY: string;
  CLEAR_KEY: string;
  FULL_SCREEN_KEY: string;
  LUCKY_TIMES: number[];
  LUCKY_SPEEDS: number[];
  LUCKY_MODE: LuckyMode;
}

// Avatar types matching Rust backend
export interface Avatar {
  empno: string;
  dataUrl: string;
  dataUrlThumbnail: string;
}

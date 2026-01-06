// Config types matching Rust backend
export interface Config {
  LUCKY_KEY: string;
  LUCKY_INIT_KEY: string;
  CLEAR_KEY: string;
  FULL_SCREEN_KEY: string;
  LUCKY_TIMES: number[];
  LUCKY_SPEEDS: number[];
}

// Avatar types matching Rust backend
export interface Avatar {
  empno: string;
  dataUrl: string;
  dataUrlThumbnail: string;
}

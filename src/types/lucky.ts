// Lottery state enum
export enum LuckyState {
  INITIAL = 0,
  DRAWING = 1,
  SHOWING_RESULTS = 2,
}

// Lottery level type (1-9)
export type LuckyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Draw count type (1-10)
export type DrawCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Image key types
export type ImageKey =
  | 'bg'
  | 'title'
  | `bg${LuckyLevel}`
  | `title${LuckyLevel}`;

// Audio key types
export type AudioKey =
  | 'bg'
  | 'active'
  | `bg${LuckyLevel}`
  | `active${LuckyLevel}`;

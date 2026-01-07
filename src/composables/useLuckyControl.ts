import { useLuckyStore } from '@/stores/lucky';
import { LuckyState } from '@/types/lucky';
import type { Avatar } from '@/types/config';

export function useLuckyControl() {
  const luckyStore = useLuckyStore();
  async function delay(s: number) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  }
  /**
   * Run the lottery drawing animation
   */
  async function runDraw() {
    if (luckyStore.availableAvatars.length === 0) {
      alert('已经没有人可以抽奖了！');
      return;
    }
    if (luckyStore.availableAvatars.length < luckyStore.drawCount) {
      alert(
        `抽奖人数不足！\n只剩${luckyStore.availableAvatars.length}人可以抽奖了, 但是现在要抽${luckyStore.drawCount}人😂`
      );
      return;
    }

    luckyStore.setLuckyState(LuckyState.DRAWING);

    // 等差数列逆运算，计算出变化次数（项数）
    let a = Math.sqrt(
      (2 * luckyStore.currentLuckyTime) / luckyStore.currentLuckySpeed
    );
    for (let i = a; i > 0; i--) {
      luckyStore.currentDrawnEmpnos = [];
      // 生成多个中奖结果
      for (let s = 0; s < luckyStore.drawCount; s++) {
        let index;
        let avatar: Avatar;
        do {
          index = Math.floor(
            Math.random() * luckyStore.availableAvatars.length
          );
          avatar = luckyStore.availableAvatars[index] as Avatar;
        } while (luckyStore.currentDrawnEmpnos.includes(avatar.empno));
        luckyStore.currentDrawnEmpnos.push(avatar.empno);
      }
      luckyStore.currentDrawnEmpnos = [...luckyStore.currentDrawnEmpnos];
      await delay(luckyStore.currentLuckySpeed * i);
    }

    luckyStore.addDrawnAvatars(luckyStore.currentDrawnEmpnos);
    luckyStore.setLuckyState(LuckyState.SHOWING_RESULTS);
  }

  /**
   * Confirm the selected winners
   */
  function confirmWinners() {
    if (luckyStore.luckyState !== LuckyState.SHOWING_RESULTS) return;

    luckyStore.currentDrawnEmpnos = [];
    luckyStore.setLuckyState(LuckyState.INITIAL);
  }

  return {
    runDraw,
    confirmWinners,
  };
}

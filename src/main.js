import './style.css'
import { getConfig, getAvatars, getAudios, getImgs, toggleFullScreen } from './commands';

// 获取初期配置
const { LUCKY_KEY, LUCKY_INIT_KEY, CLEAR_KEY, LUCKY_TIMES, LUCKY_SPEEDS, FULL_SCREEN_KEY } = await getConfig();

// 获取抽奖人一览
const AVATARS = await getAvatars();

const LUCKY_AVATARS_KEY = "luckyAavatars";
const EMPNO_KEY = "empno";

const AUDIOS = await getAudios();
const IMGS = await getImgs();

let activeAudio = document.getElementById("active-audio");
let bgAudio = document.getElementById("bg-audio");


// 读取抽奖人头
let container = document.getElementById("container");
let luckyAavatars = localStorage.getItem(LUCKY_AVATARS_KEY);
if (luckyAavatars) {
  luckyAavatars = luckyAavatars.split(",");
} else {
  luckyAavatars = [];
}

for (let avatar of AVATARS.keys().filter(v => luckyAavatars.indexOf(v) == -1)) {
  let div = document.createElement("div");
  div.className = "avatar";
  div.dataset[EMPNO_KEY] = avatar;
  div.innerHTML = `<div>${avatar}</div`;
  // 加载的时候用缩略图
  div.style.backgroundImage = `url(${AVATARS.get(avatar).dataUrlThumbnail})`;
  container.appendChild(div);
}

let luckyState = 0; // 0: 初期, 1:抽奖中 ,2:展示抽奖结果
let luckyBoxCnt = 1; // shift+数字修改一次抽取的人数，最多10人
let box = document.querySelectorAll(".container .avatar"); // 照片池
// 设置默认抽奖级别
let luckyTime = LUCKY_TIMES[0];
let luckySpeed = LUCKY_SPEEDS[0];
switchLevel(1);

// 初期显示每次抽奖的人数
updateLuckyBoxCntDisplay();
// 初期显示已经抽奖的人数
updateLuckyCountDisplay();

document.body.addEventListener("keydown", (event) => {
  // 拦截Tab默认动作
  if (event.key == "Tab") {
    event.preventDefault();
  }
  console.log(event);
  //抽奖
  if (event.key == LUCKY_KEY && luckyState == 0) {
    if (box.length == 0) {
      alert("empty");
      return;
    }
    //开始抽奖
    runLucky();
  }
  // 抽奖完成，删除已经获奖的dom
  if (event.key == LUCKY_INIT_KEY && luckyState == 2) {
    // 删除 mask 元素（抽中的人员显示）
    let mask = document.getElementById("mask");
    mask.parentNode.removeChild(mask);
    luckyState = 0;
    resetContainer();
    // 重新检查每次抽奖人数
    updateLuckyBoxCntDisplay()
  }
  // 删除localstorage
  if (event.key == CLEAR_KEY && luckyState == 0) {
    if (confirm("clear luckyAavatars")) {
      localStorage.clear();
      location.reload();
      alert("luckyAavatars cleared !");
      resetContainer();
    }

  }

  // 切换全屏
  if (event.key == FULL_SCREEN_KEY && luckyState == 0) {
    toggleFullScreen();
  }

  //切换抽奖级别
  if (event.key.match(/^[1-9]$/) && luckyState == 0) {
    let id = event.key
    switchLevel(id);
  }

  // 切换每次抽中的人数
  if (event.shiftKey && event.code.match(/^Digit[0-9]$/) && (luckyState === 0 || luckyState === 2)) {
    luckyBoxCnt = parseInt(event.code.replace("Digit", ""));
    if (luckyBoxCnt == 0) {
      luckyBoxCnt = 10;
    }
    updateLuckyBoxCntDisplay()
  }
});

// 重新对齐contrainer
function resetContainer() {
  if (box.length == 0) {
    return;
  }
  let width = container.clientWidth;
  let height = container.clientHeight;
  let k = width / height;
  let hc = Math.ceil(Math.sqrt(box.length / k));
  let wc = Math.ceil(hc * k);
  let x = Math.min(height / hc, width / wc);
  //console.log(`hc=${hc}, wc=${wc} ,x=${x}`);
  for (let avatar of box) {
    avatar.style.width = `${x}px`;
    avatar.style.height = `${x}px`;
  }
}

// 刷新每次抽奖人数显示
function updateLuckyBoxCntDisplay() {
  let drawcount = document.getElementById("drawcount");
  if (luckyBoxCnt > box.length) {
    luckyBoxCnt = box.length;
  }
  drawcount.textContent = `${luckyBoxCnt}人/次`;
}

// 刷新已中奖人数显示
function updateLuckyCountDisplay() {
  let luckycount = document.getElementById("luckycount");
  luckycount.textContent = `已抽${luckyAavatars.length}人`;
}

// 切换抽奖级别（音乐和速率），id只能是1-9
function switchLevel(id) {
  if (id < 1) {
    id = 1;
  }
  if (id > 9) {
    id = 9;
  }
  document.body.style.backgroundImage = `url(${IMGS.get(`bg${id}`) ?? IMGS.get("bg")})`;
  document.getElementById('titlebox').style.backgroundImage = `url(${IMGS.get(`title${id}`) ?? IMGS.get("title")})`;
  activeAudio.setAttribute("src", `${AUDIOS.get(`active${id}`) ?? AUDIOS.get("active")}`);
  bgAudio.setAttribute("src", `${AUDIOS.get(`bg${id}`) ?? AUDIOS.get("bg")}`);
  let timeIdx = (LUCKY_TIMES.length < id ? LUCKY_TIMES.length : id) - 1;
  luckyTime = LUCKY_TIMES[timeIdx];
  let speedIdx = (LUCKY_SPEEDS.length < id ? LUCKY_SPEEDS.length : id) - 1;
  luckySpeed = LUCKY_SPEEDS[speedIdx];
}

// 休眠
function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
}

// 抽奖
async function runLucky() {
  // 设置抽奖中状态
  luckyState = 1;
  // 计算抽奖次数（等差数列求和逆运算，计算出项数）
  let a = Math.sqrt(2 * luckyTime / luckySpeed);
  // 播放背景音乐
  bgAudio.currentTime = 0;
  bgAudio.play();
  let luckyBoxList = [];
  for (let i = a; i > 0; i--) {
    for (let luckyBox of luckyBoxList) {
      luckyBox.style.transform = "scale(1.0)";
      luckyBox.style.zIndex = 1;
    }
    // 生成随机 luckyBoxList ，每个成员不一样
    luckyBoxList = [];
    for (let i = 0; i < luckyBoxCnt; i++) {
      let luckyIdx;
      do {
        luckyIdx = parseInt(Math.random() * box.length);
      } while (luckyBoxList.includes(box[luckyIdx]));
      luckyBoxList.push(box[luckyIdx]);
      box[luckyIdx].style.transform = "scale(1.6)";
    }
    await sleep(i * luckySpeed);
  }
  // 展示结果
  bgAudio.pause();
  // 创建mask用于展示抽中的人员
  let mask = document.createElement("div");
  mask.id = "mask";
  // 播放抽中的音乐
  activeAudio.currentTime = 0;
  activeAudio.play();
  // 将抽中的box元素移动到mask元素中
  for (let luckyBox of luckyBoxList) {
    let empno = luckyBox.dataset[EMPNO_KEY];
    // 替换成高清图片
    luckyBox.style.backgroundImage = `url(${AVATARS.get(empno).dataUrl})`;
    luckyBox.style.width = `min(calc(50vw / ${luckyBoxCnt}) , 30vh)`;
    luckyBox.style.height = luckyBox.style.width;
    luckyBox.style.opacity = "0";
    luckyBox.classList.add("bigimg");
    luckyAavatars.push(empno);
    localStorage.setItem(LUCKY_AVATARS_KEY, luckyAavatars);
    mask.appendChild(luckyBox);
    // 动态设置文字大小&显示
    setTimeout(() => {
      luckyBox.firstElementChild.style.fontSize = `calc(min(calc(50vw / ${luckyBoxCnt}) , 30vh) / ${empno.length + 5} )`;
      luckyBox.style.opacity = "1";
    }, 100);
  }
  document.body.appendChild(mask);

  // 更新照片池引用
  box = document.querySelectorAll(".container .avatar");
  // 更新抽中的人数
  updateLuckyCountDisplay();
  // 设置抽完状态
  luckyState = 2;
}

window.addEventListener("resize", (e) => {
  resetContainer()
})

resetContainer();

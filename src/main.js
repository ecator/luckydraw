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

// 设置默认背景和音乐
document.body.style.backgroundImage = `url(${IMGS.get("bg")})`;
document.getElementById('titlebox').style.backgroundImage = `url(${IMGS.get("title")})`;
activeAudio.setAttribute("src", `${AUDIOS.get("active")}`);
bgAudio.setAttribute("src", `${AUDIOS.get("bg")}`);

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
let luckyIdx = -1;
let box = document.getElementsByClassName("avatar"); // 照片池
let luckyTime = LUCKY_TIMES[0];
let luckySpeed = LUCKY_SPEEDS[0];

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
    box[luckyIdx].parentNode.removeChild(box[luckyIdx]);
    luckyIdx = -1;
    luckyState = 0;
    resetContainer();
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

  //切换背景和音乐
  if (event.key.match(/^[1-9]$/) && luckyState == 0) {
    let id = event.key
    document.body.style.backgroundImage = `url(${IMGS.get(`bg${id}`) ?? IMGS.get("bg")})`;
    document.getElementById('titlebox').style.backgroundImage = `url(${IMGS.get(`title${id}`) ?? IMGS.get("title")})`;
    activeAudio.setAttribute("src", `${AUDIOS.get(`active${id}`) ?? AUDIOS.get("active")}`);
    bgAudio.setAttribute("src", `${AUDIOS.get(`bg${id}`) ?? AUDIOS.get("bg")}`);
    luckyTime = LUCKY_TIMES[id - 1];
    luckySpeed = LUCKY_SPEEDS[id - 1];
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

// 休眠
function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
}

// 抽奖
async function runLucky() {
  luckyState = 1;
  let a = Math.sqrt(2 * luckyTime / luckySpeed);
  // 抽奖中
  bgAudio.currentTime = 0;
  bgAudio.play();
  for (let i = a; i > 0; i--) {
    if (luckyIdx !== -1) {
      box[luckyIdx].style.transform = "scale(1.0)";
      box[luckyIdx].style.zIndex = 1;
    }
    luckyIdx = parseInt(Math.random() * box.length);
    box[luckyIdx].style.transform = "scale(1.6)";
    box[luckyIdx].style.zIndex = 99;
    //console.log(`luckyIdx=${luckyIdx}`);
    await sleep(i * luckySpeed);
  }
  // 展示结果
  bgAudio.pause();
  box[luckyIdx].classList.add("bigimg");
  activeAudio.currentTime = 0;
  activeAudio.play();
  let empno = box[luckyIdx].dataset[EMPNO_KEY];
  // 替换成高清图片
  box[luckyIdx].style.backgroundImage = `url(${AVATARS.get(empno).dataUrl})`;
  // 动态设置文字大小
  setTimeout(() => {
    box[luckyIdx].firstElementChild.style.fontSize = `${box[luckyIdx].clientWidth / (empno.length + 5)}px`;
    luckyState = 2;
  }, 1010);
  luckyAavatars.push(empno);
  localStorage.setItem(LUCKY_AVATARS_KEY, luckyAavatars);
}

window.addEventListener("resize", (e) => {
  resetContainer()
})

resetContainer();

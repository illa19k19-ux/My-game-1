let state = {balance:500,inventory:[],marketLots:[],myId:Math.floor(10000+Math.random()*90000),friendsList:[],nickname:""};
const ranks = ["Silver I", "Silver Elite", "Gold Nova I", "Master Guardian", "Legendary Eagle", "The Legend"];

const pool = {
    weapon:[
        {name:"P350 | Nano",r:"Ширпотреб",p:20,icon:"🔫",c:"rare-common"},{name:"Glock | Oiled",r:"Запрещенное",p:35,icon:"🔫",c:"rare-rare"},
        {name:"Glock | Fade",r:"Засекреченное",p:95,icon:"🔫",c:"rare-mythical"},{name:"Desert Eagle | Sparkle",r:"Засекреченное",p:80,icon:"🔫",c:"rare-mythical"},
        {name:"Desert Eagle | Ocean Drive",r:"Тайное",p:210,icon:"🔫",c:"rare-legendary"},{name:"AK-47 | Elite Build",r:"Запрещенное",p:50,icon:"🔱",c:"rare-rare"},
        {name:"AK-47 | Gold Sparkle",r:"Тайное",p:450,icon:"🔱",c:"rare-ancient"},{name:"M4A1-S | Emerald Marble",r:"Тайное",p:550,icon:"⚔️",c:"rare-ancient"},
        {name:"AWP | Tiger Silver",r:"Тайное",p:650,icon:"🎯",c:"rare-ancient"}
    ],
    knife:[
        {name:"Karambit | Doppler",r:"Нож",p:1600,icon:"🔪",c:"rare-knife"},{name:"Butterfly | Fade",r:"Нож",p:1850,icon:"🦋",c:"rare-knife"},{name:"M9 | Crimson Web",r:"Нож",p:1400,icon:"🗡️",c:"rare-knife"}
    ],
    charm:[
        {name:"Брелок | Котэ",r:"Брелок",p:40,icon:"🧸",c:"rare-rare"},{name:"Брелок | Череп",r:"Брелок",p:80,icon:"💀",c:"rare-mythical"},{name:"Брелок | Золотой Куб",r:"Брелок",p:200,icon:"🟩",c:"rare-ancient"}
    ]
};

let gInt,tInt,score=0,time=15,diff='easy',isRun=false,tx=0,ty=0,dx=2,dy=2,curIdx,curSrc,isRolling=false;
const $=id=>document.getElementById(id);
const save=()=>localStorage.setItem('nans_classic_3files_v2',JSON.stringify(state));

const load=()=>{
    let s=localStorage.getItem('nans_classic_3files_v2');
    if(s) state=Object.assign(state,JSON.parse(s));
    if(!state.nickname) state.nickname = "Игрок №" + state.myId;
    $('balance-val').innerText=state.balance;
};

function switchScreen(n){
    document.querySelectorAll('.screen').forEach(s=>s.style.display='none');
    document.querySelectorAll('nav .nav-btn').forEach(b=>b.classList.remove('active'));
    let ts = $(`screen-${n}`); if(ts) ts.style.display='block';
    if(event && event.target) event.target.classList.add('active');
    if(n==='inventory') drawInv();
    if(n==='market') drawMarket();
    if(n==='friends') drawFriends();
    if(n==='profile') drawProfile();
}

function setDifficulty(d){if(isRun)return;diff=d;document.querySelectorAll('#screen-game .nav-btn').forEach(b=>b.style.background='');$(`diff-${d}`).style.background='var(--accent)'}

function startGame(){
    if(isRun) return; isRun=true; score=0; time=15; $('game-score').innerText=score; $('game-timer').innerText=time;
    $('start-game-btn').disabled=true; $('target').style.display='block'; dx=dy=diff=='easy'?2:(diff=='medium'?5:8);
    tInt=setInterval(()=>{
        let c=$('game-canvas-container'); tx+=dx; ty+=dy; if(tx<=0||tx>=c.clientWidth-45)dx=-dx; if(ty<=0||ty>=c.clientHeight-45)dy=-dy;
        $('target').style.left=tx+'px';$('target').style.top=ty+'px'
    },16);
    gInt=setInterval(()=>{time--; $('game-timer').innerText=time; if(time<=0){clearInterval(gInt);clearInterval(tInt);isRun=false;$('target').style.display='none';$('start-game-btn').disabled=false;alert('Время вышло!')}},1000);
}

function hitTarget(){
    if(!isRun)return; score++; let r=diff=='easy'?50:(diff=='medium'?100:250); state.balance+=r;
    $('game-score').innerText=score; $('balance-val').innerText=state.balance; save();
    tx=Math.random()*($('game-canvas-container').clientWidth-45); ty=Math.random()*($('game-canvas-container').clientHeight-45);
}

document.addEventListener("DOMContentLoaded",()=>{load();setDifficulty('easy');});

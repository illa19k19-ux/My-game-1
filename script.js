let state = {balance:500,inventory:[],marketLots:[],myId:Math.floor(10000+Math.random()*90000),totalEarned:0,casesOpened:0,friendsList:[]};

const pool = {
    weapon:[
        {name:"P350 | Nano",r:"Ширпотреб",p:20,icon:"🔫",c:"rare-common"},
        {name:"Glock | Oiled",r:"Запрещенное",p:35,icon:"🔫",c:"rare-rare"},
        {name:"Glock | Fade",r:"Засекреченное",p:95,icon:"🔫",c:"rare-mythical"},
        {name:"Desert Eagle | Sparkle",r:"Засекреченное",p:80,icon:"🔫",c:"rare-mythical"},
        {name:"Desert Eagle | Ocean Drive",r:"Тайное",p:210,icon:"🔫",c:"rare-legendary"},
        {name:"USP-S | Monster Mashup",r:"Засекреченное",p:85,icon:"🔫",c:"rare-mythical"},
        {name:"AK-47 | Elite Build",r:"Запрещенное",p:50,icon:"🔱",c:"rare-rare"},
        {name:"AK-47 | Gold Sparkle",r:"Тайное",p:450,icon:"🔱",c:"rare-ancient"},
        {name:"M4A4 | Cyberpunk",r:"Засекреченное",p:120,icon:"⚔️",c:"rare-mythical"},
        {name:"M4A1-S | Emerald Marble",r:"Тайное",p:550,icon:"⚔️",c:"rare-ancient"},
        {name:"AWP | Atheris",r:"Запрещенное",p:65,icon:"🎯",c:"rare-rare"},
        {name:"AWP | Tiger Silver",r:"Тайное",p:650,icon:"🎯",c:"rare-ancient"}
    ],
    knife:[
        {name:"Karambit | Doppler",r:"Нож",p:1600,icon:"🔪",c:"rare-knife"},
        {name:"Karambit | Marble Fade",r:"Нож",p:1900,icon:"🔪",c:"rare-knife"},
        {name:"Butterfly | Fade",r:"Нож",p:1850,icon:"🦋",c:"rare-knife"},
        {name:"Butterfly | Lore",r:"Нож",p:2100,icon:"🦋",c:"rare-knife"},
        {name:"M9 | Crimson Web",r:"Нож",p:1400,icon:"🗡️",c:"rare-knife"},
        {name:"Bayonet | Autotronic",r:"Нож",p:1150,icon:"🗡️",c:"rare-knife"},
        {name:"Huntsman | Tiger Tooth",r:"Нож",p:980,icon:"⚔️",c:"rare-knife"}
    ],
    charm:[
        {name:"Брелок | Котэ",r:"Брелок",p:40,icon:"🧸",c:"rare-rare"},
        {name:"Брелок | Пёсель",r:"Брелок",p:45,icon:"🐶",c:"rare-rare"},
        {name:"Брелок | Череп",r:"Брелок",p:80,icon:"💀",c:"rare-mythical"},
        {name:"Брелок | Дракон",r:"Брелок",p:150,icon:"🐉",c:"rare-legendary"},
        {name:"Брелок | Золотой Куб",r:"Брелок",p:200,icon:"🟩",c:"rare-ancient"},
        {name:"Брелок | Алмаз",r:"Брелок",p:350,icon:"💎",c:"rare-knife"}
    ]
};

let gInt,tInt,score=0,time=15,diff='easy',isRun=false,tx=0,ty=0,dx=2,dy=2,curIdx,curSrc,isRolling=false;
const $=id=>document.getElementById(id);
const save=()=>localStorage.setItem('cs_sim_v7',JSON.stringify(state));
const load=()=>{let s=localStorage.getItem('cs_sim_v7');if(s){state=Object.assign(state,JSON.parse(s))}$('balance-val').innerText=state.balance};

function switchScreen(name){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.querySelectorAll('nav .nav-btn').forEach(b=>b.classList.remove('active'));
    $(`screen-${name}`).classList.add('active');
    document.querySelectorAll('nav .nav-btn').forEach(btn => {
        if(btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(name)) btn.classList.add('active');
    });
    if(name==='inventory')drawInv();if(name==='market')drawMarket();if(name==='friends')drawFriends();if(name==='profile')drawProfile();
}
function setDifficulty(d){if(isRun)return;diff=d;document.querySelectorAll('#screen-game .nav-btn').forEach(b=>b.style.background='');$(`diff-${d}`).style.background='var(--accent-color)'}

function startGame(){
    if(isRun)return;isRun=true;score=0;time=15;$('game-score').innerText=score;$('game-timer').innerText=time;$('start-game-btn').disabled=true;$('target').style.display='block';
    dx=dy=diff=='easy'?2:(diff=='medium'?5:8);
    tInt=setInterval(()=>{let c=$('game-canvas-container');tx+=dx;ty+=dy;if(tx<=0||tx>=c.clientWidth-45)dx=-dx;if(ty<=0||ty>=c.clientHeight-45)dy=-dy;if(diff=='easy'&&Math.random()<0.02){dx=-dx;dy=-dy}$('target').style.left=tx+'px';$('target').style.top=ty+'px'},16);
    gInt=setInterval(()=>{time--;$('game-timer').innerText=time;if(diff=='hard')$('target').style.opacity=Math.random()>0.4?1:0;if(time<=0){clearInterval(gInt);clearInterval(tInt);isRun=false;$('target').style.display='none';$('start-game-btn').disabled=false;alert('Время вышло!')}},1000);
}

function hitTarget(){if(!isRun)return;score++;let r=diff=='easy'?50:(diff=='medium'?100:250);state.balance+=r;state.totalEarned+=r;$('game-score').innerText=score;$('balance-val').innerText=state.balance;save();tx=Math.random()*($('game-canvas-container').clientWidth-45);ty=Math.random()*($('game-canvas-container').clientHeight-45)}

function buyCasePack(type, price){
    if(state.balance < price) return alert('Нет монет!');
    state.balance -= price;
    let nameMap = {weapon:"📦 Кейс пушек", knife:"🔪 Кейс ножей", charm:"🧸 Набор брелков"};
    let iconMap = {weapon:"📦", knife:"🔪", charm:"🧸"};
    state.inventory.push({id:'c'+Date.now()+Math.random(), isCase:true, caseType:type, name:nameMap[type], icon:iconMap[type], p:price, c:"rare-common"});
    $('balance-val').innerText = state.balance; save(); alert('Кейс добавлен в инвентарь!');
}

function openCase(caseIdx) {
    if(isRolling) return; 
    isRolling = true;
    let caseItem = state.inventory[caseIdx]; 
    let type = caseItem.caseType;
    
    state.inventory.splice(caseIdx, 1); 
    state.casesOpened++; 
    closePreview();
    
    let tr = $('roulette-track'); 
    $('roulette-view').style.display='block';
    tr.innerHTML = ''; 
    tr.style.transition = 'none'; 
    tr.style.transform = 'translateX(0)';
    
    let itemsCount = 120; 
    let arr = [];
    for(let i=0; i<itemsCount; i++) {
        let item = pool[type][Math.floor(Math.random()*pool[type].length)]; 
        arr.push(item);
        tr.innerHTML += `<div class="roulette-item ${item.c}"><div class="icon-box">${item.icon}</div><div>${item.name}</div></div>`;
    }
    
    let winIndex = 90; 
    let winItem = Object.assign({}, arr[winIndex], {id: 'w'+Date.now()+Math.random()}); 
    winItem.oldP = winItem.p;
    
    setTimeout(() => { 
        tr.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.85, 0.15, 1)'; 
        // 140px ширина карточки + 12px отступы (margin: 0 6px) = 152px шаг
        let scrollAmount = -(winIndex * 152) + ($('roulette-view').clientWidth / 2) - 76;
        tr.style.transform = `translateX(${scrollAmount}px)`; 
    }, 150);
    
    setTimeout(() => { 
        isRolling = false; 
        state.inventory.push(winItem); 
        save(); 
        alert(`🎉 Из кейса выпало: ${winItem.name}!`); 
        drawInv(); 
    }, 4700);
}

document.addEventListener("DOMContentLoaded",()=>{load();setDifficulty('easy');});

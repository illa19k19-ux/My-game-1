function buyCasePack(type, price){
    if(state.balance < price) return alert('Нет монет!'); state.balance -= price;
    let nameMap = {weapon:"📦 Кейс пушек", knife:"🔪 Кейс ножей", charm:"🧸 Набор брелков"};
    state.inventory.push({id:'c'+Date.now()+Math.random(), isCase:true, caseType:type, name:nameMap[type], icon:type=='weapon'?'📦':(type=='knife'?'🔪':'🧸'), p:price, c:"rare-common"});
    $('balance-val').innerText = state.balance; save(); alert('Кейс добавлен в инвентарь!');
}

function openCase(caseIdx) {
    if(isRolling) return; isRolling = true; let caseItem = state.inventory[caseIdx]; let type = caseItem.caseType;
    state.inventory.splice(caseIdx, 1); closePreview();
    let tr = $('roulette-track'); $('roulette-view').style.display='block'; tr.innerHTML = ''; tr.style.transition='none'; tr.style.transform='translateX(0)';
    let itemsCount = 120, arr = [];
    for(let i=0; i<itemsCount; i++) { let item = pool[type][Math.floor(Math.random()*pool[type].length)]; arr.push(item); tr.innerHTML += `<div class="roulette-item ${item.c}"><div class="icon-box">${item.icon}</div><div>${item.name}</div></div>`; }
    let winIndex = 90; let winItem = Object.assign({}, arr[winIndex], {id: 'w'+Date.now()+Math.random()}); winItem.oldP = winItem.p;
    setTimeout(() => { tr.style.transition='transform 4.5s cubic-bezier(0.15, 0.85, 0.15, 1)'; let scrollAmount = -(winIndex * 152) + ($('roulette-view').clientWidth / 2) - 76; tr.style.transform = `translateX(${scrollAmount}px)`; }, 150);
    setTimeout(() => { isRolling = false; state.inventory.push(winItem); save(); alert(`🎉 Выпало: ${winItem.name}!`); drawInv(); }, 4700);
}

function drawInv(){ let g=$('inventory-grid'); g.innerHTML=state.inventory.length?'':'<p>Пусто</p>'; state.inventory.forEach((item,i)=>{g.innerHTML+=`<div class="skin-card ${item.c}"><div style="font-size:50px;">${item.icon}</div><b>${item.name}</b><button class="btn-buy" onclick="openPreview(${i},'inventory')">Осмотреть</button></div>`})}

function drawMarket(){
    let g=$('market-lots-grid');
    if(state.marketLots.length === 0) {
        let types = ['weapon', 'knife', 'charm'];
        let rType = types[Math.floor(Math.random()*types.length)];
        let rItem = pool[rType][Math.floor(Math.random()*pool[rType].length)];
        state.marketLots.push({id:'m'+Date.now(), name:"[Бот] "+rItem.name, p: Math.floor(rItem.p * 0.9), icon: rItem.icon, c: rItem.c, r: rItem.r, isBot: true});
    }
    g.innerHTML='';
    state.marketLots.forEach((item,i)=>{g.innerHTML+=`<div class="skin-card ${item.c}"><div style="font-size:50px;">${item.icon}</div><b>${item.name}</b><p>${item.p}🪙</p><button class="btn-buy" style="background:#2196f3" onclick="openPreview(${i},'market')">Лот</button></div>`})
}

function drawFriends(){ let fl=$('friends-list'); fl.innerHTML=state.friendsList.length?'':'<p>Список пуст.</p>'; state.friendsList.forEach(f=>{fl.innerHTML+=`<div class="friend-row"><span>🟢 <b>${f.name}</b> (ID: ${f.id})</span><button class="nav-btn" style="padding:4px 10px;margin:0;" onclick="giftAction(${f.id})">🎁 Подарок</button></div>`})}

function findFriendById(){ let id=parseInt($('friend-search-id').value); if(isNaN(id)) return alert("Введите ID!"); let found=state.friendsList.find(f=>f.id===id); if(found) return alert('Уже в списке!'); let names=["Gamer_Top","Sniper_Elite","Standoff_Pro","CS_Expert"]; let rName=names[Math.floor(Math.random()*names.length)]; state.friendsList.push({id:id,name:rName}); save(); drawFriends(); alert(`Добавлен: ${rName}`); }

function giftAction(fId){
    let f=state.friendsList.find(f=>f.id===fId); let choice=prompt(`Подарок для ${f.name}:\n1 - Монеты\n2 - Скин`);
    if(choice=="1"){let sum=parseInt(prompt(`Сколько монет?`));if(isNaN(sum)||sum<=0||sum>state.balance)return;state.balance-=sum;$('balance-val').innerText=state.balance;save();alert('Отправлено!')}
    else if(choice=="2"){let filtered=state.inventory.filter(i=>!i.isCase);if(!filtered.length)return alert("Нет скинов!");let t="Номер скина:\n";filtered.forEach((item,idx)=>{t+=`${idx+1} - ${item.name}\n`});let sIdx=parseInt(prompt(t))-1;if(isNaN(sIdx)||sIdx<0||sIdx>=filtered.length)return;let realIdx=state.inventory.findIndex(item=>item.id===filtered[sIdx].id);state.inventory.splice(realIdx,1);save();alert(`Скин отправлен другу ${f.name}!`);drawInv()}
}

function drawProfile(){
    $('prof-id').innerText=state.myId;
    $('prof-name-title').innerText=state.nickname;
    let container = document.querySelector('.profile-container');
    let existBtn = $('change-nick-btn');
    if(!existBtn) {
        let btn = document.createElement('button');
        btn.id = 'change-nick-btn'; btn.className = 'nav-btn'; btn.innerText = 'Изменить Никнейм';
        btn.style.marginTop = '10px';
        btn.onclick = () => {
            let newNick = prompt("Введите новый ник:", state.nickname);
            if(newNick && newNick.trim() !== "") { state.nickname = newNick.trim(); $('prof-name-title').innerText=state.nickname; save(); }
        };
        container.appendChild(btn);
    }
}

function openPreview(idx,src){
    curIdx=idx; curSrc=src; let item=src=='inventory'?state.inventory[idx]:state.marketLots[idx]; $('preview-title').innerText=item.name;
    $('preview-rarity').innerText=item.isCase ? "Запечатанный предмет" : item.r; $('preview-price-info').innerText=`Ценность: ${item.p} 🪙`; let acts = $('preview-actions'); acts.innerHTML = '';
    if(src=='inventory'){
        if(item.isCase) { acts.innerHTML += `<button class="nav-btn" style="background:#4caf50; width:100%; font-size:16px;" onclick="openCase(${idx})">Открыть кейс</button>`; }
        else { acts.innerHTML += `<button class="nav-btn" style="background:#e91e63;margin-bottom:5px;width:100%;" onclick="sell(${idx})">Продать системе</button><button class="nav-btn" style="background:#ff9800;width:100%;" onclick="toMarket(${idx})">Выставить на рынок</button>`; }
    } else { 
        if(item.isBot) { acts.innerHTML += `<button class="nav-btn" style="background:#4caf50;width:100%;" onclick="buyFromMarket(${idx})">Купить лот</button>`; }
        else { acts.innerHTML += `<button class="nav-btn" style="background:#f44336;width:100%;" onclick="cancelMarket(${idx})">Снять с рынка</button>`; }
    }
    $('preview-modal').style.display='flex';
}

function closePreview(){ $('preview-modal').style.display='none'; }
function sell(i){ state.balance += state.inventory[i].p; state.inventory.splice(i,1); updateUI(); }

function toMarket(i) {
    let pr = parseInt(prompt("Введите вашу цену для продажи на рынке:")); if(isNaN(pr) || pr <= 0) return;
    let item = state.inventory.splice(i, 1)[0]; item.oldP = item.p; item.p = pr;
    state.marketLots.push(item); updateUI();
    setTimeout(() => {
        let idx = state.marketLots.findIndex(l => l.id === item.id);
        if(idx !== -1) { state.marketLots.splice(idx, 1); state.balance += pr; alert(`📢 Ваш лот "${item.name}" был успешно куплен на рынке другим игроком! +${pr} 🪙`); save(); $('balance-val').innerText=state.balance; }
    }, Math.floor(Math.random() * 20000) + 10000);
}

function buyFromMarket(i) {
    let item = state.marketLots[i]; if(state.balance < item.p) return alert("Недостаточно монет!");
    state.balance -= item.p; state.marketLots.splice(i,1); delete item.isBot; item.p = item.oldP;
    state.inventory.push(item); updateUI(); alert(`🎉 Вы успешно купили "${item.name}" на рынке!`);
}

function cancelMarket(i) { let item = state.marketLots.splice(i, 1)[0]; item.p = item.oldP; state.inventory.push(item); updateUI(); }
function updateUI(){ save(); closePreview(); $('balance-val').innerText=state.balance; drawInv(); drawMarket(); }

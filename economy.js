function drawInv(){
    let g=$('inventory-grid');g.innerHTML=state.inventory.length?'':'<p>В инвентаре пусто</p>';
    state.inventory.forEach((item,i)=>{g.innerHTML+=`<div class="skin-card ${item.c}"><div style="font-size:50px; margin-bottom:10px;">${item.icon}</div><b>${item.name}</b><button class="btn-buy" onclick="openPreview(${i},'inventory')">Взаимодействие</button></div>`})
}
function drawMarket(){
    let g=$('market-lots-grid');g.innerHTML='';if(!state.marketLots.length){g.innerHTML='<p>Рынок пуст. Выставьте свои скины на продажу!</p>';return}
    state.marketLots.forEach((item,i)=>{g.innerHTML+=`<div class="skin-card ${item.c}"><div style="font-size:50px; margin-bottom:10px;">${item.icon}</div><b>${item.name}</b><p>${item.p}🪙</p><button class="btn-buy" style="background:#2196f3" onclick="openPreview(${i},'market')">Лот</button></div>`})
}
function drawFriends(){let fl=$('friends-list');fl.innerHTML=state.friendsList.length?'':'<p style="color:#aaa;">У вас пока нет друзей. Добавьте кого-нибудь по ID выше!</p>';state.friendsList.forEach(f=>{fl.innerHTML+=`<div class="friend-row"><span>🟢 <b>${f.name}</b> (ID: ${f.id})</span><button class="nav-btn" style="padding:4px 10px;margin:0;font-size:12px;" onclick="giftAction(${f.id})">🎁 Подарок</button></div>`})}
function findFriendById(){let id=parseInt($('friend-search-id').value);if(isNaN(id))return alert("Введите ID!");let found=state.friendsList.find(f=>f.id===id);if(found){alert('Уже в списке!');return};let names=["Gamer_Top","Sniper_Elite","Standoff_Pro","Knife_Master"];let rName=names[Math.floor(Math.random()*names.length)];state.friendsList.push({id:id,name:rName});save();drawFriends();alert(`Добавлен игрок: ${rName} (ID: ${id})`)}
function giftAction(fId){
    let f=state.friendsList.find(f=>f.id===fId);let choice=prompt(`Подарок для ${f.name}:\n1 - Монеты\n2 - Скин`);
    if(choice=="1"){let sum=parseInt(prompt(`Сколько монет? (Баланс: ${state.balance})`));if(isNaN(sum)||sum<=0||sum>state.balance)return;state.balance-=sum;$('balance-val').innerText=state.balance;save();alert('Отправлено!')}
    else if(choice=="2"){let filtered=state.inventory.filter(i=>!i.isCase);if(!filtered.length)return alert("У вас нет скинов для отправки!");let t="Выберите номер скина:\n";filtered.forEach((item,idx)=>{t+=`${idx+1} - ${item.name}\n`});let sIdx=parseInt(prompt(t))-1;if(isNaN(sIdx)||sIdx<0||sIdx>=filtered.length)return;let realIdx=state.inventory.findIndex(item=>item.id===filtered[sIdx].id);state.inventory.splice(realIdx,1);save();alert(`Скин отправлен!`);drawInv()}
}
function drawProfile(){$('prof-id').innerText=state.myId;$('prof-total-earned').innerText=state.totalEarned;$('prof-cases-opened').innerText=state.casesOpened}
function openPreview(idx,src){
    curIdx=idx;curSrc=src;let item=src=='inventory'?state.inventory[idx]:state.marketLots[idx];
    $('preview-title').innerText=item.name; $('preview-img').style.display='none';
    let iconView = $('preview-modal').querySelector('.preview-icon-txt') || document.createElement('div');
    iconView.className = 'preview-icon-txt'; iconView.style.fontSize = '70px'; iconView.style.margin = '15px 0'; iconView.innerText = item.icon;
    $('preview-title').after(iconView);
    $('preview-rarity').innerText=item.isCase ? "Запечатанный предмет" : item.r;
    $('preview-price-info').innerText=`Ценность/Цена покупки: ${item.p} 🪙`;
    let acts = $('preview-actions'); acts.innerHTML = ''; let lootContainer = $('case-loot-container'); lootContainer.style.display = 'none';
    if(src=='inventory'){
        if(item.isCase) {
            acts.innerHTML += `<button class="nav-btn" style="background:#4caf50; width:100%; font-size:16px;" onclick="openCase(${idx})">Открыть кейс</button>`;
            let tbody = $('loot-table-body'); tbody.innerHTML = ''; pool[item.caseType].forEach(drop => { tbody.innerHTML += `<tr><td>${drop.icon} ${drop.name}</td><td style="font-weight:bold;">${drop.r}</td></tr>`; });
            lootContainer.style.display = 'block';
        } else { acts.innerHTML += `<button class="nav-btn" style="background:#e91e63;margin-bottom:5px;width:100%;" onclick="sell(${idx})">Продать за ${item.p}</button><button class="nav-btn" style="background:#ff9800;width:100%;" onclick="toMarket(${idx})">На рынок</button>`; }
    } else { acts.innerHTML += `<button class="nav-btn" style="background:#f44336;width:100%;" onclick="cancelMarket('${item.id}')">Снять с рынка</button>`; }
    $('preview-modal').style.display='flex';
}
function closePreview(){ $('preview-modal').style.display='none'; let iv = $('preview-modal').querySelector('.preview-icon-txt'); if(iv) iv.remove(); }
function sell(i){ state.balance += state.inventory[i].p; state.inventory.splice(i,1); updateUI(); }
function toMarket(i) {
    let pr = parseInt(prompt("Введите цену:")); if(isNaN(pr) || pr <= 0) return;
    let res = state.inventory.splice(i, 1); let item = res[0]; item.oldP = item.p; item.p = pr; item.id = 'u' + Date.now(); state.marketLots.push(item); updateUI();
}
function cancelMarket(id) {
    let idx = state.marketLots.findIndex(l => l.id === id);
    if(idx !== -1) { let res = state.marketLots.splice(idx, 1); let item = res[0]; item.p = item.oldP; state.inventory.push(item); updateUI(); }
}
function updateUI(){ save(); closePreview(); $('balance-val').innerText=state.balance; drawInv(); drawMarket(); }

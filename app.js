const API=(window.API_URL||'').replace(/\/$/,'')||'/.netlify/functions/api';
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const LS=(k,d)=>{try{return JSON.parse(localStorage.getItem('nd_'+k))??d}catch{return d}},SV=(k,v)=>localStorage.setItem('nd_'+k,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)};
const MOODS=['happy','sad','energetic','romantic','dark','chill','spiritual'];
const MEM={happy:'😄 Happy',sad:'😢 Sad',energetic:'⚡ Energetic',romantic:'💖 Romantic',dark:'🖤 Dark',chill:'🌙 Chill',spiritual:'✨ Spiritual'};
const MQ={happy:'pop hits',sad:'sad songs',energetic:'edm',romantic:'love songs',dark:'metal',chill:'lofi',spiritual:'ambient'};
const G={happy:['#FFE066','#FF6B35'],sad:['#2C3E7A','#1A1A2E'],energetic:['#7B5CFA','#F050A0'],romantic:['#ff8fb1','#f5e1c8'],dark:['#2b2b33','#6b0f1a'],chill:['#2bb5a8','#6aa8e0'],spiritual:['#0b1b4d','#c9a227']};
const AC={happy:['#FF9F1C','#E4572E'],sad:['#5B7CFA','#8E9EE8'],energetic:['#7B5CFA','#F050A0'],romantic:['#E8488A','#FF8FB1'],dark:['#C0392B','#8E44AD'],chill:['#1FB5A8','#4FA3E0'],spiritual:['#E0B52E','#6C7BFF']};const PC={happy:{c:['#FFE066','#FF6B35','#fff'],vy:[1,3],vx:[-1,1],r:[3,6],sh:'r'},sad:{c:['#9bb7ff'],vy:[8,14],vx:[0,0],r:[1,2],sh:'l'},energetic:{c:['#7B5CFA','#F050A0','#0ff'],vy:[-3,3],vx:[-3,3],r:[2,5],sh:'c'},romantic:{c:['#ff8fb1','#ffd6e0'],vy:[1,2],vx:[-1,1],r:[4,7],sh:'c'},dark:{c:['#8b0000','#777'],vy:[2,5],vx:[-2,0],r:[1,3],sh:'l'},chill:{c:['#4fd1c5','#9ad0ff'],vy:[-.6,-.2],vx:[-.3,.3],r:[6,14],sh:'c',a:.25},spiritual:{c:['#ffd700','#fff'],vy:[0,.1],vx:[-.2,.2],r:[1,2.5],sh:'c'}};
const PETS=[['🐱','Mochi'],['🐶','Bimo'],['🐰','Kiko'],['🐦','Sari'],['🦖','Dino'],['🐉','Naga',1],['🦅','Fenix',1],['🐲','Qilin',1],['🐺','Anubis',1],['🦄','Pegasus',1]];
const ACC=[['🎩',30],['🕶️',20],['👑',60],['🪽',50],['🎀',15]];
const MISS=[{id:'d1',t:'Dengar 5 lagu berbeda',k:'plays',n:5,e:50},{id:'d2',t:'Tambah 1 lagu ke playlist',k:'add',n:1,e:30},{id:'d3',t:'Lakukan 1 pencarian',k:'search',n:1,e:40},{id:'d4',t:'Dengar musik 10 menit',k:'secs',n:600,e:60},{id:'w1',t:'Dengar 3 genre berbeda (mingguan)',k:'genres',n:3,e:150,w:1},{id:'w2',t:'Buat 1 playlist baru (mingguan)',k:'pl',n:1,e:100,w:1}];
const PH="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%237B5CFA'/%3E%3C/svg%3E";
const DEF={playlists:{},hist:[],searches:[],tc:{},coins:50,exp:0,streak:1,last:'',pets:['🐱'],owned:[],acc:{},pos:{},plays:0,artists:[],custom:[],name:'',bio:'',av:'🙂',set:{anim:2,theme:'dark',size:'m',mood:'auto'},priv:{}};
let U=LS('user',null),S=Object.assign({},DEF,LS('data',{}));S.set=Object.assign({},DEF.set,S.set);
const save=()=>{try{SV('data',S)}catch{toast('Penyimpanan penuh')}clearTimeout(save.t);if(U&&U.token)save.t=setTimeout(()=>{const{custom,...d}=S;api('save',{data:d})},2000)};
(()=>{const t=new Date().toDateString();if(S.last!==t){const y=new Date(Date.now()-864e5).toDateString();S.streak=S.last===y?S.streak+1:1;if(S.last){S.exp+=5;S.coins+=5+Math.min(S.streak,10);S.rw=1}S.last=t;save()}})();
const vip=()=>U&&['vip','admin'].includes(U.type),lvl=()=>Math.floor(S.exp/100)+1,mx=()=>vip()?3:1,petName=e=>PETS.find(p=>p[0]==e)[1];
const stage=()=>{const l=lvl();return l<5?'Baby':l<10?'Anak':l<20?'Remaja':l<30?'Dewasa':'Legenda'};
const bar=(v,m)=>`<div class="bar"><i style="width:${Math.min(100,v/m*100)}%"></i></div>`;
function addExp(n){const b=lvl();S.exp+=n;if(lvl()>b){toast('🎉 Pet naik ke Level '+lvl()+'!');confetti();drawPets()}save()}
function ctr(w){const k=w?'W'+(Date.now()/6048e5|0):new Date().toDateString(),o=w?'mw':'md';if(!S[o]||S[o].key!=k)S[o]={key:k,c:{},cl:{}};return S[o]}
function bump(k,v){[0,1].forEach(w=>{const c=ctr(w).c;if(typeof v=='string'){c[k]=c[k]||[];if(!c[k].includes(v))c[k].push(v)}else c[k]=(c[k]||0)+v});if(k!='secs')save()}
const prog=m=>{const c=ctr(m.w).c[m.k];return Array.isArray(c)?c.length:c||0};
// ---- data lagu
const T={};Object.assign(T,S.tc);S.custom.forEach(t=>T[t.id]=t);
const reg=l=>(l.forEach(t=>T[t.id]=t),l);
async function find(q,n=24){
 try{const j=await(await fetch('https://itunes.apple.com/search?media=music&entity=song&limit='+n+'&term='+encodeURIComponent(q))).json();
  return reg(j.results.filter(x=>x.previewUrl).map(x=>({id:'i'+x.trackId,title:x.trackName,artist:x.artistName,cover:x.artworkUrl100.replace('100x100','300x300'),url:x.previewUrl,genre:x.primaryGenreName,year:(x.releaseDate||'').slice(0,4)})))
 }catch(e){try{const j=await(await fetch(API.replace(/api$/,'music-proxy')+'?q='+encodeURIComponent(q))).json();
  return reg((j.data||[]).map(x=>({id:'d'+x.id,title:x.title,artist:x.artist.name,cover:x.album.cover_medium,url:x.preview,genre:'',year:''})))}catch(e2){return[]}}}
function mood(t){if(t.mood)return t.mood;const g=(t.genre||'').toLowerCase(),m=[[/metal|hard|punk/,'dark'],[/electro|dance|edm|house|techno|hip|rap/,'energetic'],[/r&b|soul|love|romant/,'romantic'],[/blues|singer|sad|country|folk/,'sad'],[/jazz|lo-?fi|acoustic|reggae|chill|indie|alt/,'chill'],[/classic|new age|ambient|gospel|religio|spirit/,'spiritual'],[/pop|latin/,'happy']].find(([r])=>r.test(g));return m?m[1]:MOODS[[...t.title].reduce((a,c)=>a+c.charCodeAt(0),0)%7]}
// ---- background + partikel
let CM='',bgf=0,P=[];const cv=$('#cv'),cx=cv.getContext('2d'),rn=(a,b)=>a+Math.random()*(b-a);
function sz(){cv.width=innerWidth;cv.height=innerHeight}addEventListener('resize',sz);sz();
function mkP(){const c=PC[CM||'chill'],n=[0,25,60,110][S.set.anim];P=Array.from({length:n},()=>({x:rn(0,cv.width),y:rn(0,cv.height),vx:rn(...c.vx),vy:rn(...c.vy),r:rn(...c.r),c:c.c[Math.random()*c.c.length|0]}))}
function setMood(m){if(S.set.mood!='auto')m=S.set.mood;if(m==CM)return;CM=m;document.body.dataset.mood=m;document.body.style.setProperty('--p',AC[m][0]);document.body.style.setProperty('--k',AC[m][1]);const e=$('#bg'+(bgf^=1));e.style.background=`linear-gradient(135deg,${G[m][0]},${G[m][1]})`;e.style.opacity=.55;$('#bg'+(1-bgf)).style.opacity=0;mkP()}
(function loop(){cx.clearRect(0,0,cv.width,cv.height);const c=PC[CM||'chill'];cx.globalAlpha=c.a||.8;P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.y>cv.height+20)p.y=-20;if(p.y<-20)p.y=cv.height+20;if(p.x>cv.width+20)p.x=-20;if(p.x<-20)p.x=cv.width+20;cx.fillStyle=cx.strokeStyle=p.c;if(c.sh=='l'){cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x+p.vx,p.y+p.r*6);cx.stroke()}else if(c.sh=='r')cx.fillRect(p.x,p.y,p.r,p.r*1.6);else{cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()}});
 if(CM=='dark'&&P.length&&Math.random()<.004){cx.globalAlpha=.25;cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height)}requestAnimationFrame(loop)})();
// ---- player (global, tidak pernah di-unmount)
const au=new Audio();au.volume=.8;let Q=[],qi=-1,sh=false,rp='off',curId=null,sleepT,lt=0;
const fmt=s=>isFinite(s)?(s/60|0)+':'+String(s%60|0).padStart(2,'0'):'0:00';
function play(id,list){Q=list&&list.length?[...list]:[id];if(!Q.includes(id))Q.push(id);qi=Q.indexOf(id);load(id)}
function load(id){const t=T[id];if(!t)return;curId=id;au.src=t.url;au.play().catch(()=>toast('Lagu tidak bisa diputar'));$('#pc').src=t.cover||PH;$('#pt').textContent=t.title;$('#pa').textContent=t.artist;
 setMood(mood(t));S.plays++;S.tc[id]=t;S.hist=[id,...S.hist.filter(x=>x!=id)].slice(0,50);if(!S.artists.includes(t.artist))S.artists.push(t.artist);bump('plays',id);if(t.genre)bump('genres',t.genre);drawQ();(S.mj=S.mj||[]).push(mood(t));S.mj=S.mj.slice(-30);bubble(t)}
function next(auto){if(!Q.length)return;if(rp=='one'&&auto){au.currentTime=0;au.play();return}if(sh)qi=Math.floor(Math.random()*Q.length);else{qi++;if(qi>=Q.length){if(rp=='all'||!auto)qi=0;else return}}load(Q[qi])}
function prev(){if(!Q.length)return;if(au.currentTime>3){au.currentTime=0;return}qi=(qi-1+Q.length)%Q.length;load(Q[qi])}
function drawQ(){$('#qpn').innerHTML='<b>Antrian</b>'+Q.map((id,i)=>`<div class="qi ${i==qi?'on':''}" data-a="jump" data-i="${i}">${esc(T[id]?.title)}</div>`).join('')}
au.onended=()=>next(1);au.onplay=()=>{document.body.classList.add('playing');$('#pp').textContent='⏸'};au.onpause=()=>{document.body.classList.remove('playing');$('#pp').textContent='▶';save()};
au.ontimeupdate=()=>{$('#sk').value=au.duration?au.currentTime/au.duration*100:0;$('#tm').textContent=fmt(au.currentTime);if(!au.paused){const d=au.currentTime-lt;if(d>0&&d<2){bump('secs',d);S.ls=(S.ls||0)+d;if(S.ls>=1800){S.ls-=1800;addExp(20)}}}lt=au.currentTime};
$('#sk').oninput=e=>{if(au.duration)au.currentTime=e.target.value/100*au.duration};$('#vl').oninput=e=>au.volume=e.target.value;
$('#viz').innerHTML='<i></i>'.repeat(20);setInterval(()=>{if(!au.paused)$$('#viz i').forEach(i=>i.style.height=3+Math.random()*27+'px')},140);
// ---- pet
function drawPets(){const b=$('#pets');b.innerHTML='';S.pets.forEach((e,i)=>{const d=document.createElement('div'),p=S.pos[e]||{x:innerWidth-120-i*80,y:innerHeight-(innerWidth<700?280:200)};d.className='pet';d.dataset.e=e;d.style.left=p.x+'px';d.style.top=p.y+'px';d.innerHTML=`<i>${S.acc[e]||''}</i><span style="font-size:${40+Math.min(lvl()*2,30)}px">${e}</span><small>${petName(e)} Lv${lvl()}</small>`;b.append(d)})}
let dr=null;$('#pets').addEventListener('pointerdown',e=>{const d=e.target.closest('.pet');if(!d)return;dr={d,ox:e.clientX-d.offsetLeft,oy:e.clientY-d.offsetTop,m:0};d.setPointerCapture(e.pointerId)});
addEventListener('pointermove',e=>{if(!dr)return;dr.m=1;dr.d.style.left=Math.max(0,Math.min(innerWidth-70,e.clientX-dr.ox))+'px';dr.d.style.top=Math.max(0,Math.min(innerHeight-110,e.clientY-dr.oy))+'px'});
addEventListener('pointerup',()=>{if(!dr)return;const d=dr.d;if(dr.m){S.pos[d.dataset.e]={x:d.offsetLeft,y:d.offsetTop};save()}else{d.classList.add('jump');setTimeout(()=>d.classList.remove('jump'),600)}dr=null});
$('#pets').addEventListener('dblclick',e=>{const d=e.target.closest('.pet');if(!d)return;const c=prompt('Pet: 1=Beri makan (-5 koin)  2=Ajak main  3=Status','3');if(c=='1'){if(S.coins<5)return toast('Koin kurang');S.coins-=5;addExp(10);toast('Nyam! +10 EXP')}else if(c=='2'){addExp(5);toast('Seru! +5 EXP')}else if(c=='3')toast(`${petName(d.dataset.e)} · Lv${lvl()} ${stage()} · ${S.exp%100}/100 EXP`)});
// ---- util tampilan
const row=t=>`<div class="row"><img src="${esc(t.cover||PH)}" loading="lazy" alt=""><div class="mt"><b>${esc(t.title)}</b><small>${esc(t.artist)}</small></div><button data-a="play" data-id="${esc(t.id)}">▶</button><button data-a="addpl" data-id="${esc(t.id)}">＋</button></div>`;
const rows=l=>`<div class="lst">${l.map(row).join('')||'<small>Tidak ada hasil.</small>'}</div>`;
const grid=l=>`<div class="lst cards">${l.map(t=>`<div class="tc"><img src="${esc(t.cover||PH)}" alt=""><b>${esc(t.title)}</b><small>${esc(t.artist)}</small><div><button data-a="play" data-id="${esc(t.id)}">▶</button> <button data-a="addpl" data-id="${esc(t.id)}">＋</button></div></div>`).join('')||'<small>Kosong.</small>'}</div>`;
const chips=l=>l.map(x=>`<button class="chip" data-a="q" data-v="${esc(x)}">${esc(x)}</button>`).join('');
const missions=()=>MISS.map(m=>{const p=Math.min(prog(m),m.n),c=ctr(m.w).cl[m.id];return `<div class="card ms"><span>${esc(m.t)} <small>+${m.e} EXP</small></span>${bar(p,m.n)}<button data-a="claim" data-id="${m.id}" ${p<m.n||c?'disabled':''}>${c?'✔':'Klaim'}</button></div>`}).join('');
const dl=(n,txt,mime='application/json')=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:mime}));a.download=n;a.click()};
// ---- halaman
const R={};let sq='';
R.home=async()=>{const[top,tr]=await Promise.all([find('top hits',10),find((S.fav&&S.fav.length?S.fav[Date.now()%S.fav.length]:['lofi','edm','jazz','pop'][Date.now()%4])+' music',8)]);
 return `<h1>Halo, ${esc(S.name||U.name)} 👋</h1>${hero()}<div class="grid"><div class="card"><h3>Mood saat ini</h3><p class="big">${MEM[CM]||'—'}</p><small>Latar berubah otomatis mengikuti lagu.</small></div><div class="card"><h3>🔥 Streak</h3><p class="big">${S.streak} hari</p><small>${S.plays} lagu diputar</small></div><div class="card"><h3>🐾 Pet Lv${lvl()} · ${stage()}</h3>${bar(S.exp%100,100)}<small>🪙 ${S.coins} koin</small></div></div>${journey()}<h2>Misi</h2>${missions()}<h2>Top Chart</h2>${rows(top)}<h2>Trending</h2>${grid(tr)}${S.custom.length?'<h2>Baru Ditambah</h2>'+grid(S.custom):''}`};
R.search=()=>`<h1>Cari</h1><select id="fm"><option value="">Semua mood</option>${MOODS.map(m=>`<option value="${m}">${MEM[m]}</option>`).join('')}</select><div id="sres"></div>`;
async function fill(){const el=$('#sres');if(!el)return;const q=sq;
 if(!q){el.innerHTML=`<h3>Riwayat</h3>${chips(S.searches)||'<small>Belum ada</small>'}<h3>Trending</h3>${chips(['pop hits','lofi','edm','jazz','rock','kpop'])}<h3>Genre / Mood</h3>${MOODS.map(m=>`<button class="chip" data-a="q" data-v="${MQ[m]}">${MEM[m]}</button>`).join('')}`;return}
 el.innerHTML='<p>Mencari…</p>';const ql=q.toLowerCase();let tr=[...S.custom.filter(t=>(t.title+t.artist).toLowerCase().includes(ql)),...await find(q,30)];if(q!==sq)return;
 const fm=$('#fm').value;if(fm)tr=tr.filter(t=>mood(t)==fm);S.searches=[q,...S.searches.filter(x=>x!=q)].slice(0,10);bump('search',1);
 const ar=[...new Set(tr.map(t=>t.artist))].slice(0,8),pl=Object.keys(S.playlists).filter(n=>n.toLowerCase().includes(ql));
 el.innerHTML=`<h3>🎵 Lagu</h3>${rows(tr)}<h3>👤 Artis</h3>${chips(ar)||'<small>-</small>'}<h3>📋 Playlist</h3>${pl.map(n=>`<span class="chip">${esc(n)}</span>`).join('')||'<small>-</small>'}`}
R.library=()=>`<h1>Library</h1><button class="btn" data-a="newpl">+ Playlist baru</button>${Object.entries(S.playlists).map(([n,ids])=>`<div class="card lst"><h3>${esc(n)} <button data-a="playall" data-n="${esc(n)}">▶ Putar</button> <button data-a="delpl" data-n="${esc(n)}">🗑</button></h3>${ids.filter(i=>T[i]).map(i=>row(T[i])).join('')||'<small>Kosong</small>'}</div>`).join('')}<h2>Riwayat putar</h2>${rows(S.hist.filter(i=>T[i]).map(i=>T[i]))}`;
R.pets=()=>`<h1>🐾 Peliharaan</h1><div class="card">Level ${lvl()} · ${stage()}${bar(S.exp%100,100)}<small>${S.exp%100}/100 EXP · 🪙 ${S.coins} · Seret pet di layar, klik = bereaksi, dobel klik = menu</small></div><h2>Pilih pet (aktif maks ${mx()})</h2><div class="cards">${PETS.map(([e,n,v])=>`<div class="tc pt ${S.pets.includes(e)?'on':''}"><span class="em">${e}</span><b>${n}</b><small>${v?'👑 VIP':'Biasa'}</small><button data-a="pet" data-e="${e}" ${v&&!vip()?'disabled':''}>${S.pets.includes(e)?'Aktif':v&&!vip()?'🔒 VIP':'Pilih'}</button></div>`).join('')}</div><h2>Toko aksesori</h2><div class="cards">${ACC.map(([i,p])=>`<div class="tc"><span class="em">${i}</span><small>${S.owned.includes(i)?'Dimiliki':'🪙 '+p}</small><button data-a="buy" data-i="${i}" data-p="${p}">${S.owned.includes(i)?'Pakai':'Beli'}</button></div>`).join('')}</div><p><button data-a="unequip">Lepas aksesori</button></p>`;
R.profile=()=>`<h1>Profil</h1><div class="card"><div class="av">${S.av}</div><p><input id="pn" value="${esc(S.name||U.name)}" placeholder="Nama"></p><textarea id="pb" maxlength="150" placeholder="Bio (maks 150)">${esc(S.bio)}</textarea><p>${['🙂','😎','🤖','👾','🦊','🐼','🎧','🌸'].map(a=>`<button data-a="av" data-v="${a}">${a}</button>`).join(' ')}</p><button class="btn" data-a="saveprof">Simpan</button> <button data-a="share">🖼 Kartu share</button></div><div class="grid"><div class="card"><h3>Statistik</h3><p>${S.plays} putaran · ${S.artists.length} artis · ${Object.keys(S.playlists).length} playlist</p><p>Akun: ${U.type.toUpperCase()}</p></div><div class="card"><h3>Badge</h3>${[[S.streak>=3,'🔥 Streak 3'],[S.plays>=10,'🎧 Pendengar'],[lvl()>=5,'🐾 Pet Lv5'],[vip(),'👑 VIP']].filter(b=>b[0]).map(b=>`<span class="chip">${b[1]}</span>`).join('')||'<small>Belum ada</small>'}</div></div>`;
R.settings=()=>{const sel=(k,o)=>`<select data-k="${k}">${o.map(([v,l])=>`<option value="${v}" ${String(S.set[k])==v?'selected':''}>${l}</option>`).join('')}</select>`;
 const pv=[['act','Tampilkan aktivitas mendengarkan'],['pl','Playlist bisa dilihat orang lain'],['pet','Tampilkan pet di profil'],['msg','Terima pesan'],['bdg','Tampilkan badge'],['hide','Mode sembunyi']];
 return `<h1>Pengaturan</h1><div class="card"><h3>Tampilan</h3><p>Mode warna ${sel('theme',[['dark','Gelap'],['light','Terang'],['system','Ikuti sistem']])}</p><p>Ukuran teks ${sel('size',[['s','Kecil'],['m','Sedang'],['l','Besar']])}</p><p>Animasi latar ${sel('anim',[[0,'Off'],[1,'Rendah'],[2,'Sedang'],[3,'Tinggi']])}</p><p>Mood latar ${sel('mood',[['auto','Auto'],...MOODS.map(m=>[m,MEM[m]])])}</p></div><div class="card"><h3>Privasi</h3>${pv.map(([k,l])=>`<label><input type="checkbox" data-p="${k}" ${S.priv[k]?'checked':''}> ${l}</label><br>`).join('')}</div><div class="card"><h3>Data</h3><button data-a="cs">Hapus riwayat cari</button> <button data-a="ch">Hapus riwayat putar</button> <button data-a="ex">Export data (JSON)</button> <button data-a="del">Hapus akun</button></div>`};
R.vip=()=>`<h1>👑 VIP</h1><div class="card"><p>Aktif untuk VIP: 5 pet mitologi, hingga 3 pet aktif sekaligus, badge VIP.</p><p><small>Mode demo — belum ada pembayaran sungguhan.</small></p><button class="btn" data-a="vip">${vip()?'Nonaktifkan VIP':'Aktifkan VIP (demo)'}</button></div>`;
R.admin=()=>{if(U.type!='admin')return '<h1>Admin</h1><p>Masuk dengan akun admin (email & password diatur di environment variable Netlify).</p>';
 return `<h1>🛠 Panel Admin</h1><div class="grid"><div class="card"><h3>Lagu</h3><p class="big">${S.custom.length}</p></div><div class="card"><h3>Artis</h3><p class="big">${new Set(S.custom.map(t=>t.artist)).size}</p></div><div class="card"><h3>Total putar</h3><p class="big">${S.plays}</p></div></div><h2>Tambah lagu</h2><div class="card"><p><input id="at" placeholder="Judul *"> <input id="aa" placeholder="Artis *"> <input id="ag" placeholder="Genre"></p><p><select id="am"><option value="">Mood otomatis</option>${MOODS.map(m=>`<option>${m}</option>`).join('')}</select> <input id="au_" placeholder="URL audio (mp3)"> <input id="ac" placeholder="URL cover"></p><p>atau file audio (maks 2MB): <input id="af" type="file" accept="audio/*"></p><button class="btn" data-a="addsong">Simpan</button></div><h2>Daftar lagu</h2>${S.custom.map(t=>`<div class="row"><img src="${esc(t.cover||PH)}" alt=""><div class="mt"><b>${esc(t.title)}</b><small>${esc(t.artist)}</small></div><button data-a="delsong" data-id="${t.id}">🗑</button></div>`).join('')||'<small>Belum ada</small>'}<h2>Backup</h2><button data-a="ex">Export JSON</button> <button data-a="bcsv">Export CSV</button> Restore: <input id="ri" type="file" accept=".json">`};
const hero=()=>{const t=T[curId];return `<div class="card hero" style="background-image:linear-gradient(#0008,#000b),url('${t?esc(t.cover):''}')"><img src="${esc(t?t.cover:PH)}" alt=""><div><small>SEDANG DIPUTAR</small><h2>${t?esc(t.title):'Belum ada lagu'}</h2><p>${t?esc(t.artist)+' · '+MEM[mood(t)]:'Pilih lagu di bawah untuk mulai ✨'}</p></div></div>`};
const journey=()=>{const m=S.mj||[];return m.length?`<h2>Mood journey</h2><div class="card jr">${m.map(x=>`<i title="${x}" style="background:${G[x][0]}"></i>`).join('')}</div>`:''};
R.about=()=>'<h1>Tentang Nandaku</h1><div class="card"><p>Musik yang merasakan perasaanmu. Latar, warna, dan peliharaanmu berubah mengikuti mood lagu.</p><p><small>Sumber musik: iTunes Search API (preview 30 detik). Nandaku tidak menyimpan file lagu milik pihak lain.</small></p></div>';
function bubble(t){const ph=['Lagunya enak! 🎶','Aku suka ini~','Ayo goyang! 💃','Wah, '+t.artist+'!'];$$('.pet').forEach(d=>{let b=d.querySelector('em');if(!b){b=document.createElement('em');d.append(b)}b.textContent=ph[Math.random()*4|0];b.className='bb on';clearTimeout(b.t);b.t=setTimeout(()=>b.className='bb',3000)})}
function confetti(){for(let i=0;i<30;i++){const e=document.createElement('b');e.className='cf';e.textContent=['🎉','✨','⭐','💖'][i%4];e.style.cssText=`left:${Math.random()*100}vw;animation-delay:${Math.random()*.6}s`;document.body.append(e);setTimeout(()=>e.remove(),3000)}}
function onboard(){const o=document.createElement('div');o.id='onb';let pet='🐱',fav=[];const g=['pop','lofi','edm','jazz','rock','kpop','indie','classical'];
o.innerHTML=`<div class="card"><h2>Selamat datang! 🎉</h2><p>1. Pilih pet pertamamu</p><div>${PETS.filter(p=>!p[2]).map(p=>`<button data-o="p" data-v="${p[0]}">${p[0]} ${p[1]}</button>`).join(' ')}</div><p>2. Genre favorit</p><div>${g.map(x=>`<button class="chip" data-o="g" data-v="${x}">${x}</button>`).join('')}</div><p>3. <button class="btn" data-o="go">Mulai dengar musik ▶</button></p></div>`;
o.onclick=e=>{const b=e.target.closest('[data-o]');if(!b)return;const v=b.dataset.v;if(b.dataset.o=='p'){pet=v;$$('[data-o=p]',o).forEach(x=>x.classList.toggle('on',x==b))}else if(b.dataset.o=='g'){fav=fav.includes(v)?fav.filter(x=>x!=v):[...fav,v];b.classList.toggle('on')}else{S.pets=[pet];S.fav=fav;S.onb=1;save();o.remove();drawPets();go();find((fav[0]||'pop')+' hits',10).then(l=>{if(l[0])play(l[0].id,l.map(x=>x.id))})}};document.body.append(o)}
// ---- router
const route=()=>(location.hash.replace('#/','')||'home').split('?')[0];let tok=0;
async function go(){const r=R[route()]?route():'home',my=++tok;$('#main').innerHTML='<div class="sk"></div><div class="sk"></div><div class="sk"></div>';const h=await R[r]();if(my!=tok)return;$('#main').innerHTML=h;$$('nav a').forEach(a=>a.classList.toggle('on',a.hash=='#/'+r));$('#coins').textContent='🪙 '+S.coins;$('#hav').textContent=S.av;if(r=='search')fill();scrollTo(0,0)}
addEventListener('hashchange',go);
// ---- aksi
const A={
play(d,el){const l=el.closest('.lst');play(d.id,l?$$('[data-a=play]',l).map(x=>x.dataset.id):[d.id])},
addpl(d){const n=prompt('Nama playlist (baru / yang ada):\n'+Object.keys(S.playlists).join(', '),Object.keys(S.playlists)[0]||'Favoritku');if(!n)return;if(!S.playlists[n]){S.playlists[n]=[];bump('pl',1)}if(!S.playlists[n].includes(d.id))S.playlists[n].push(d.id);S.tc[d.id]=T[d.id];bump('add',1);toast('Ditambahkan ke '+n)},
newpl(){const n=prompt('Nama playlist');if(n&&!S.playlists[n]){S.playlists[n]=[];bump('pl',1);go()}},
playall(d){const ids=S.playlists[d.n];if(ids&&ids.length)play(ids[0],ids)},
delpl(d){if(confirm('Hapus playlist?')){delete S.playlists[d.n];save();go()}},
tp(){if(curId)au.paused?au.play():au.pause()},nx(){next()},pv(){prev()},
sh(d,el){sh=!sh;el.classList.toggle('on',sh)},
rp(d,el){rp=rp=='off'?'all':rp=='all'?'one':'off';el.textContent=rp=='one'?'🔂':'🔁';el.classList.toggle('on',rp!='off')},
mute(d,el){au.muted=!au.muted;el.textContent=au.muted?'🔇':'🔊'},
qp(){$('#qpn').hidden=!$('#qpn').hidden},jump(d){qi=+d.i;load(Q[qi])},
sleep(){const m=+prompt('Sleep timer (menit, 0 = batal)','30');clearTimeout(sleepT);if(m>0){sleepT=setTimeout(()=>au.pause(),m*6e4);toast('Timer '+m+' menit')}else toast('Timer dibatalkan')},
q(d){$('#q').value=d.v;sq=d.v;fill()},
claim(d){const m=MISS.find(x=>x.id==d.id),c=ctr(m.w);if(prog(m)>=m.n&&!c.cl[m.id]){c.cl[m.id]=1;S.coins+=m.e/2|0;addExp(m.e);toast(`+${m.e} EXP, +${m.e/2|0} koin`);go()}},
pet(d){const v=PETS.find(p=>p[0]==d.e)[2];if(v&&!vip())return toast('Khusus VIP');if(S.pets.includes(d.e)){if(S.pets.length>1)S.pets=S.pets.filter(x=>x!=d.e)}else{S.pets.push(d.e);while(S.pets.length>mx())S.pets.shift()}save();drawPets();go()},
buy(d){const i=d.i;if(!S.owned.includes(i)){if(S.coins<+d.p)return toast('Koin kurang');S.coins-=+d.p;S.owned.push(i)}S.acc[S.pets[0]]=i;save();drawPets();go()},
unequip(){delete S.acc[S.pets[0]];save();drawPets()},
av(d){S.av=d.v;save();$('.av').textContent=d.v;$('#hav').textContent=d.v},
saveprof(){S.name=$('#pn').value.slice(0,40);S.bio=$('#pb').value.slice(0,150);save();toast('Tersimpan')},
async vip(){if(U.type=='guest')return toast('Daftar Member dulu');if(U.type=='admin')return toast('Admin sudah VIP');if(U.token){const r=await api('setvip');if(!r||r.err)return toast('Gagal');U.type=r.type}else U.type=U.type=='vip'?'member':'vip';SV('user',U);const a=LS('accts',{});if(a[U.email]){a[U.email].type=U.type;SV('accts',a)}go()},
cs(){S.searches=[];save();toast('Riwayat cari dihapus')},ch(){S.hist=[];save();toast('Riwayat putar dihapus')},
ex(){dl('nandaku-data.json',JSON.stringify(S))},
bcsv(){dl('nandaku-lagu.csv',['title,artist,genre,url',...S.custom.map(t=>[t.title,t.artist,t.genre,t.url.startsWith('data:')?'(file)':t.url].map(x=>'"'+String(x||'').replace(/"/g,'""')+'"').join(','))].join('\n'),'text/csv')},
del(){if(confirm('Hapus SEMUA data & akun?')){Object.keys(localStorage).filter(k=>k.startsWith('nd_')).forEach(k=>localStorage.removeItem(k));location.reload()}},
async delsong(d){if(!confirm('Hapus lagu?'))return;const r=await api('delsong',{id:d.id});if(r&&r.err)return toast(r.err);S.custom=r?r.songs:S.custom.filter(t=>t.id!=d.id);delete T[d.id];save();go()},
async addsong(){const t=$('#at').value.trim(),a=$('#aa').value.trim(),f=$('#af').files[0];let u=$('#au_').value.trim();if(!t||!a)return toast('Judul & artis wajib');
 if(f){if(f.size>2e6)return toast('File >2MB, pakai URL audio');u=await new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)})}
 if(!u)return toast('Isi URL audio atau pilih file');const s={id:'c'+Date.now(),title:t,artist:a,genre:$('#ag').value,mood:$('#am').value,cover:$('#ac').value,url:u};const r=await api('addsong',{song:s});if(r){if(r.err)return toast(r.err);S.custom=r.songs}else S.custom.push(s);S.custom.forEach(t=>T[t.id]=t);save();toast('Lagu ditambahkan');go()},
voice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('Browser tidak mendukung voice search');const r=new SR();r.lang='id-ID';r.onresult=e=>{$('#q').value=e.results[0][0].transcript;$('#q').dispatchEvent(new Event('input'))};r.start()},
share(){const c=document.createElement('canvas');c.width=600;c.height=340;const x=c.getContext('2d'),m=CM||'chill',g=x.createLinearGradient(0,0,600,340);g.addColorStop(0,G[m][0]);g.addColorStop(1,G[m][1]);x.fillStyle=g;x.fillRect(0,0,600,340);x.fillStyle='#0006';x.fillRect(0,0,600,340);x.fillStyle='#fff';x.font='bold 30px sans-serif';x.fillText('NANDAKU',30,50);x.font='22px sans-serif';x.fillText((S.name||U.name)+' · '+MEM[m],30,90);x.font='80px sans-serif';x.fillText(S.pets[0],480,110);x.font='20px sans-serif';x.fillText('Lagu favoritku minggu ini:',30,150);S.hist.slice(0,4).forEach((id,i)=>T[id]&&x.fillText((i+1)+'. '+T[id].title.slice(0,30)+' — '+T[id].artist.slice(0,16),30,185+i*32));x.font='16px sans-serif';x.fillText('Streak '+S.streak+' hari · Pet Lv'+lvl(),30,320);c.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='nandaku-kartu.png';a.click()})},
logout(){U=null;localStorage.removeItem('nd_user');au.pause();boot()}};
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(el&&A[el.dataset.a])A[el.dataset.a](el.dataset,el)});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.k){S.set[t.dataset.k]=/^\d$/.test(t.value)?+t.value:t.value;if(t.dataset.k=='mood'){CM='';setMood(t.value!='auto'?t.value:curId?mood(T[curId]):'chill')}save();applySet()}else if(t.dataset.p){S.priv[t.dataset.p]=t.checked;save()}else if(t.id=='fm')fill();else if(t.id=='ri'){const f=t.files[0];if(f)f.text().then(x=>{try{Object.assign(S,JSON.parse(x));save();location.reload()}catch{toast('File tidak valid')}})}});
let st;$('#q').addEventListener('input',e=>{clearTimeout(st);st=setTimeout(()=>{sq=e.target.value.trim();route()=='search'?fill():location.hash='#/search'},300)});
addEventListener('keydown',e=>{if((e.key=='/'&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))||(e.ctrlKey&&e.key=='k')){e.preventDefault();$('#q').focus()}});
// ---- login + backend (Netlify Function /api)
const LOCAL=/^(localhost|127\.|\[::1\])/.test(location.hostname);
const api=async(a,b={})=>{try{const r=await fetch(API,{method:'POST',body:JSON.stringify({a,token:U&&U.token,...b})});if(r.status==404)return null;const j=await r.json().catch(()=>({}));return r.ok?j:{err:j.err||'Server error'}}catch{return null}};
const H=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const setU=(u,token,data)=>{U={...u,token};if(data)Object.assign(S,data);SV('user',U);save();boot()};
const guest=()=>setU({email:'guest@nandaku.com',name:'Tamu',type:'guest'});
$('#lf').onsubmit=async e=>{e.preventDefault();const email=$('#em').value.trim().toLowerCase(),password=$('#pw').value;
 if(email=='guest@nandaku.com'&&password=='guest123')return guest();
 const r=await api('login',{email,password});if(r){if(r.err)return $('#le').textContent=r.err;return setU(r.user,r.token,r.data)}
 if(LOCAL&&email=='admin@nandaku.com'&&password=='admin123')return setU({email,name:'Admin',type:'admin'});
 const a=LS('accts',{})[email];if(a&&a.h==await H(password))return setU({email,name:a.name,type:a.type});$('#le').textContent='Email / password salah'};
$('#gb').onclick=guest;
$('#rg').onclick=async()=>{const email=$('#em').value.trim().toLowerCase(),password=$('#pw').value;if(!email||password.length<6)return $('#le').textContent='Isi email & password (min 6)';const name=prompt('Nama kamu?')||email.split('@')[0];
 const r=await api('register',{email,password,name});if(r){if(r.err)return $('#le').textContent=r.err;return setU(r.user,r.token,r.data)}
 const a=LS('accts',{});if(a[email])return $('#le').textContent='Email sudah terdaftar';a[email]={name,h:await H(password),type:'member'};SV('accts',a);setU({email,name,type:'member'})};
function applySet(){const l=S.set.theme=='light'||(S.set.theme=='system'&&matchMedia('(prefers-color-scheme: light)').matches);document.body.classList.toggle('light',l);document.body.dataset.sz=S.set.size;mkP()}
async function boot(){$('#login').hidden=!!U;$('#app').hidden=!U;$('#pets').hidden=!U;setMood('chill');if(!U)return;applySet();const r=await api('catalog');if(r&&r.songs){S.custom=r.songs;S.custom.forEach(t=>T[t.id]=t)}drawPets();go();if(S.rw){S.rw=0;toast('🎁 Hadiah login harian: +'+(5+Math.min(S.streak,10))+' koin')}if(!S.onb)onboard()}
boot();

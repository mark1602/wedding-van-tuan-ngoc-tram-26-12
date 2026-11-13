(function(){
  /* ===== CONFIG: nội dung sự kiện (chỉ dùng dữ liệu từ thiệp) ===== */
  var EVENT={
    title:'Lễ cưới Văn Tuấn & Ngọc Trâm',
    start:'2026-12-26T10:30:00+07:00',
    durationHours:2, /* giả định để tạo lịch — cặp đôi chưa cung cấp giờ kết thúc */
    place:'Kavin Garden Retreat, 57 HL2, Tân An Hội, Hồ Chí Minh',
    map:'https://maps.app.goo.gl/vA7XKYzgMHdgnqVX6'
  };
  var RSVP_ENDPOINT='https://script.google.com/macros/s/AKfycbz2EpRIFv8VuuD5G2FCW5tcMZDepsveVd2eaoES-xgBol93xxLJGf-z8Tv7UGchYewimQ/exec'; /* dán URL Google Apps Script/Supabase khi dùng thật */

  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};

  /* nav */
  var nav=$('#nav');
  function onScroll(){nav.classList.toggle('solid',window.scrollY>60)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  $('#burger').onclick=function(){nav.classList.toggle('open')};
  $$('#links a').forEach(function(a){a.onclick=function(){nav.classList.remove('open')}});

  /* reveal */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
  $$('.rv').forEach(function(el){io.observe(el)});

  /* countdown */
  var target=new Date(EVENT.start).getTime();
  function pad(n){return n<10?'0'+n:''+n}
  function tick(){
    var d=Math.max(0,target-Date.now()),s=Math.floor(d/1000);
    var v={d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60};
    $$('#count b').forEach(function(b){var k=b.dataset.u;b.textContent=k==='d'?v.d:pad(v[k])});
  }
  tick();setInterval(tick,1000);

  /* calendar */
  function fmt(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
  var st=new Date(EVENT.start),en=new Date(st.getTime()+EVENT.durationHours*3600e3);
  $('#gcal').href='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(EVENT.title)+'&dates='+fmt(st)+'/'+fmt(en)+'&location='+encodeURIComponent(EVENT.place)+'&details='+encodeURIComponent('Bản đồ: '+EVENT.map);
  $('#ics').onclick=function(){
    try{
      var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//VanTuanNgocTram//Wedding//VI','BEGIN:VEVENT','UID:vantuan-ngoctram-20261226@wedding','DTSTAMP:'+fmt(new Date()),'DTSTART:'+fmt(st),'DTEND:'+fmt(en),'SUMMARY:'+EVENT.title,'LOCATION:'+EVENT.place.replace(/,/g,'\\,'),'DESCRIPTION:'+EVENT.map,'END:VEVENT','END:VCALENDAR'].join('\r\n');
      var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='van-tuan-ngoc-tram-26-12-2026.ics';document.body.appendChild(a);a.click();a.remove();
    }catch(e){window.open($('#gcal').href,'_blank')}
  };

  /* gallery */
  var G={
    s:[['n1','Studio · hoa khô'],['s3','Studio · hoa khô'],['n2','Studio · hoa khô'],['s4','Studio · hoa khô'],['l7','Studio · hoa khô'],['s5','Studio · hoa khô'],['n3','Studio · chú rể']],
    t:[['t1','Hoàng hôn bên sông'],['t4','Hoàng hôn bên sông'],['t2','Hoàng hôn bên sông'],['t5','Hoàng hôn bên sông'],['t3','Hoàng hôn bên sông'],['t8','Hoàng hôn bên sông'],['t6','Hoàng hôn bên sông'],['t9','Hoàng hôn bên sông'],['t7','Hoàng hôn bên sông']],
    l:[['l1','Góc phố cổ'],['l2','Góc phố cổ'],['l3','Góc phố cổ'],['l4','Góc phố cổ'],['l5','Góc phố cổ'],['l10','Góc phố cổ'],['l9','Góc phố cổ'],['l8','Góc phố cổ'],['l11','Góc phố cổ']]
  };
  var cur='s',list=[],idx=0,grid=$('#grid');
  function render(k){
    cur=k;list=G[k];grid.innerHTML='';
    list.forEach(function(it,i){
      var f=document.createElement('figure'),im=new Image();
      im.src='img/'+it[0]+'.webp';im.alt=it[1];im.loading='lazy';
      f.appendChild(im);f.onclick=function(){open(i)};grid.appendChild(f);
    });
    $$('.tab').forEach(function(t){t.setAttribute('aria-selected',t.dataset.g===k)});
  }
  $$('.tab').forEach(function(t){t.onclick=function(){render(t.dataset.g)}});
  render('s');
  var lb=$('#lb'),lbimg=$('#lbimg');
  function open(i){idx=(i+list.length)%list.length;lbimg.src='img/'+list[idx][0]+'.webp';lbimg.alt=list[idx][1];lb.classList.add('on')}
  function close(){lb.classList.remove('on')}
  $('.x',lb).onclick=close;$('.p',lb).onclick=function(){open(idx-1)};$('.n',lb).onclick=function(){open(idx+1)};
  lb.onclick=function(e){if(e.target===lb)close()};
  addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')open(idx-1);if(e.key==='ArrowRight')open(idx+1)});

  /* music: thử tự phát; nếu trình duyệt chặn thì phát ở lần chạm/bấm đầu tiên */
  var mb=$('#music'),au=$('#bgm');
  function setOn(on){mb.classList.toggle('on',on);mb.setAttribute('aria-pressed',on);mb.setAttribute('aria-label',on?'Tắt nhạc nền':'Bật nhạc nền')}
  var userPaused=false;
  function start(){
    var pr=au.play();
    if(pr&&pr.then){pr.then(function(){setOn(true);unbind()}).catch(function(){})}
  }
  var evs=['pointerdown','touchend','click','keydown'];
  function onFirst(e){if(userPaused||(mb.contains&&mb.contains(e.target)))return;start()}
  function unbind(){evs.forEach(function(t){document.removeEventListener(t,onFirst,true)})}
  evs.forEach(function(t){document.addEventListener(t,onFirst,true)});
  au.volume=0.7;start();
  mb.onclick=function(){
    if(au.paused){userPaused=false;start()}
    else{userPaused=true;au.pause();setOn(false);unbind()}
  };

  /* gift box */
  var gb=$('#gbtn'),gp=$('#gpanel');
  gb.onclick=function(){var on=gb.getAttribute('aria-expanded')!=='true';gb.setAttribute('aria-expanded',on);gp.classList.toggle('on',on);if(on)setTimeout(function(){gp.scrollIntoView({behavior:'smooth',block:'center'})},350)};
  $$('.copy').forEach(function(b){b.onclick=function(){
    var n=b.dataset.num,old=b.textContent;
    function ok(){b.textContent='Đã sao chép';setTimeout(function(){b.textContent=old},1800)}
    try{navigator.clipboard.writeText(n).then(ok,function(){b.textContent=n})}catch(e){b.textContent=n}
  }});

  /* khách mời cá nhân hoá (trang /for/<slug>) */
  var GU=window.GUEST;
  if(!GU){ /* trang mặc định: lấy tên từ đường dẫn /for/<tên> */
    var pm=location.pathname.match(/^\/for\/([^\/?#]+)/);
    if(pm&&pm[1]!=='_default'){
      var sl;try{sl=decodeURIComponent(pm[1])}catch(x){sl=pm[1]}
      var gm=window.GUEST_MAP&&window.GUEST_MAP[sl.toLowerCase()];
      if(gm)GU=gm;
      else{
        var nm=sl.replace(/[-_+]+/g,' ').replace(/\s+/g,' ').trim().split(' ').map(function(w){return w.charAt(0).toUpperCase()+w.slice(1)}).join(' ').slice(0,40);
        if(nm)GU={name:nm,plus:false};
      }
      if(GU)document.title='Trân trọng kính mời '+(/^(Chị|Cô|Thầy|Anh|Em|Chú|Bác|C\.)/.test(GU.name)?'':'Bạn ')+GU.name+' | Thiệp cưới Văn Tuấn & Ngọc Trâm';
    }
  }
  if(GU&&GU.name){
    var gg=$('#guestGreet');gg.hidden=false;$('#gname').textContent=GU.name;
    $('#name').value=GU.name;
    if(GU.plus)setTimeout(function(){sel.value='2'},0);
  }

  /* QR chuyển khoản tự điền nội dung: "<Tên khách> gui tien mung" (chỉ trang /for/...) */
  if(GU&&GU.name){
    var plain=GU.name.replace(/đ/g,'d').replace(/Đ/g,'D').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\([^)]*\)/g,' ').replace(/[^A-Za-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim().slice(0,34).trim();
    if(plain){
      var memo=plain+' gui tien mung';
      var BANKS={'9999222197':{bin:'970407',n:'NGUYEN VAN TUAN'},'1064306176':{bin:'970436',n:'PHAN NGUYEN NGOC TRAM'}};
      $$('.gcard').forEach(function(c){
        var b=c.querySelector('.copy'),im=c.querySelector('img'),k=b&&BANKS[b.getAttribute('data-num')];
        if(!k||!im)return;
        var old=im.src;
        im.onerror=function(){im.onerror=null;im.src=old};
        im.src='https://img.vietqr.io/image/'+k.bin+'-'+b.getAttribute('data-num')+'-qr_only.png?addInfo='+encodeURIComponent(memo)+'&accountName='+encodeURIComponent(k.n);
        var p=document.createElement('p');p.className='gmemo';p.textContent='Nội dung chuyển khoản: '+memo;
        c.insertBefore(p,b);
      });
    }
  }

  /* Thiệp mừng (menu) mở hộp quà */
  $$('[data-gift]').forEach(function(a){a.addEventListener('click',function(){if(gb.getAttribute('aria-expanded')!=='true')gb.click()})});

  /* Tường lời chúc (đọc từ Google Sheet) */
  var wallAll=[],wallShown=0,WPAGE=12;
  function wallItem(w){var d=document.createElement('div');d.className='wall-item';var p=document.createElement('p');p.textContent=w.message;var b=document.createElement('b');b.textContent=w.name;d.appendChild(p);d.appendChild(b);return d}
  function wallRender(){var L=$('#wallList');L.innerHTML='';wallAll.slice(0,wallShown).forEach(function(w){L.appendChild(wallItem(w))});$('#wallEmpty').hidden=wallAll.length>0;$('#wallMore').hidden=wallShown>=wallAll.length}
  function addWish(w,top){if(top){wallAll.unshift({name:w.name,message:w.message});wallShown=Math.max(wallShown+1,Math.min(wallAll.length,WPAGE))}wallRender()}
  $('#wallMore').onclick=function(){wallShown+=WPAGE;wallRender()};
  $('#wallBtn').onclick=function(){wopen(true)};
  function mine(){try{return JSON.parse(localStorage.getItem('mywishes')||'[]')}catch(x){return []}}
  function wallMerge(srv){var seen={};srv.forEach(function(w){seen[w.name+'|'+w.message]=1});return mine().reverse().filter(function(w){return !seen[w.name+'|'+w.message]}).concat(srv)}
  function wallLoad(){
    wallAll=wallMerge([]);wallShown=Math.min(wallAll.length,WPAGE);wallRender();
    if(RSVP_ENDPOINT){fetch(RSVP_ENDPOINT+'?action=wishes&t='+Date.now()).then(function(r){return r.json()}).then(function(j){wallAll=wallMerge(j.wishes||[]);wallShown=Math.min(wallAll.length,WPAGE);wallRender()}).catch(function(){})}
  }
  wallLoad();

  /* Popup toàn màn hình: cảm ơn sau khi gửi lời chúc */
  function thanksFull(n){
    var o=document.createElement('div');o.className='thx';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Cảm ơn bạn');
    o.innerHTML='<div class="thx-in"><span class="thx-mark" aria-hidden="true">&#10003;</span><p class="eyebrow">Đã gửi thành công</p><h2>Cảm ơn bạn!</h2><p class="thx-t"></p><button class="btn" type="button">Đóng</button></div>';
    o.querySelector('.thx-t').textContent=(n?n+' ơi, l':'L')+'ời chúc của bạn đã được gửi đến Văn Tuấn & Ngọc Trâm và hiện trong Sổ lưu bút.';
    function close(){document.removeEventListener('keydown',k);o.classList.remove('on');setTimeout(function(){o.remove()},350);var w=document.getElementById('loi-chuc');if(w&&w.scrollIntoView)w.scrollIntoView({behavior:'smooth',block:'center'})}
    function k(e){if(e.key==='Escape')close()}
    o.querySelector('button').onclick=close;o.addEventListener('click',function(e){if(e.target===o)close()});document.addEventListener('keydown',k);
    document.body.appendChild(o);requestAnimationFrame(function(){o.classList.add('on');o.querySelector('button').focus()});
  }

  /* Gửi lời chúc (popup góc dưới) */
  var wf=$('#wishfab'),wb=$('#wishbox');
  function wopen(on){wb.hidden=!on;wf.setAttribute('aria-expanded',on);if(on){if(GU&&GU.name&&!$('#wname').value)$('#wname').value=GU.name;setTimeout(function(){($('#wname').value?$('#wmsg'):$('#wname')).focus()},50)}}
  wf.onclick=function(){wopen(wb.hidden)};
  $('#wishx').onclick=function(){wopen(false)};
  addEventListener('keydown',function(e){if(e.key==='Escape'&&!wb.hidden)wopen(false)});
  $('#wishform').onsubmit=function(e){
    e.preventDefault();
    var n=$('#wname').value.trim(),m=$('#wmsg').value.trim();
    if(!n||!m){$('#werr').textContent=!n?'Vui lòng nhập họ tên.':'Vui lòng nhập lời chúc.';return}
    $('#werr').textContent='';
    var data={type:'wish',name:n,message:m,at:new Date().toISOString()};
    try{var mw=mine();mw.push({name:n,message:m});localStorage.setItem('mywishes',JSON.stringify(mw.slice(-20)))}catch(x){}
    function ok(){addWish(data,true);wopen(false);$('#wmsg').value='';thanksFull(n)}
    if(RSVP_ENDPOINT){fetch(RSVP_ENDPOINT,{method:'POST',mode:'no-cors',body:JSON.stringify(data)}).then(ok).catch(function(){$('#werr').textContent='Chưa gửi được, vui lòng thử lại.'})}
    else{try{var all=JSON.parse(localStorage.getItem('wishes')||'[]');all.push(data);localStorage.setItem('wishes',JSON.stringify(all))}catch(x){}ok()}
  };

  /* Xác nhận tham dự */
  var sel=$('#guests');
  for(var i=1;i<=10;i++){var o=document.createElement('option');o.value=i;o.textContent=i;sel.appendChild(o)}
  $$('input[name=attend]').forEach(function(r){r.onchange=function(){$('#gf').style.display=this.value==='no'?'none':''}});
  $('#form').onsubmit=function(e){
    e.preventDefault();
    var name=$('#name').value.trim();
    if(!name){$('#err').textContent='Vui lòng nhập họ tên.';$('#name').focus();return}
    $('#err').textContent='';
    var attend=$('input[name=attend]:checked').value;
    var data={name:name,attend:attend,guests:attend==='yes'?+sel.value:0,note:$('#msg').value.trim(),at:new Date().toISOString()};
    function done(){$('#form').style.display='none';$('#thanks').style.display='block'}
    if(RSVP_ENDPOINT){
      fetch(RSVP_ENDPOINT,{method:'POST',mode:'no-cors',body:JSON.stringify(data)}).then(done).catch(function(){$('#err').textContent='Chưa gửi được, vui lòng thử lại.'});
    }else{
      try{var all=JSON.parse(localStorage.getItem('rsvps')||'[]');all.push(data);localStorage.setItem('rsvps',JSON.stringify(all))}catch(x){}
      done();
    }
  };
})();

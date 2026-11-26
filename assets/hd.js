/* hadavn.com · hd.js · dùng chung cho mọi trang
   1) HD.track(item, detail): đếm lượt bấm (không cookie, không bên thứ ba) → webhook Make, tối đa 100 lượt/ngày toàn site, mỗi phiên chỉ gửi 1 lần cho mỗi mục.
   2) HD.order(prefill): mở form đặt dịch vụ AI → gửi webhook (type "order") → ghi Google Sheet của HADA. Không thu gì ngoài những gì khách tự điền.
   Nút tắt: đặt localStorage hd_off=1 (hoặc HD.off=true) để không gửi gì. */
(function(){
'use strict';
var HOOK='https://hook.eu2.make.com/cdwpcywwuyyox7589b4xn8f8qoglf0yk';
var HD=window.HD=window.HD||{};
function off(){try{return HD.off||localStorage.getItem('hd_off')==='1'}catch(e){return !!HD.off}}
function ua(){var m=navigator.userAgent||'';var dev=/iPhone|iPad/.test(m)?'iOS':/Android/.test(m)?'Android':/Mac/.test(m)?'Mac':/Windows/.test(m)?'Windows':'Khác';var w=Math.min(innerWidth||0,9999);return dev+' · '+w+'px'}
function send(payload,cb){
  if(off()){cb&&cb(false);return}
  var body=JSON.stringify(payload);
  if(payload.type!=='order'&&navigator.sendBeacon){try{navigator.sendBeacon(HOOK,new Blob([body],{type:'text/plain'}));cb&&cb(true);return}catch(e){}}
  fetch(HOOK,{method:'POST',headers:{'Content-Type':'text/plain'},body:body,keepalive:true}).then(function(r){cb&&cb(r.ok)}).catch(function(){cb&&cb(false)});
}
HD.track=function(item,detail){
  try{var k='hd_t_'+item;if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1')}catch(e){}
  send({type:'click',page:location.pathname,item:String(item||'').slice(0,80),detail:String(detail||'').slice(0,200),contact:'',qty:'',total:'',ua:ua(),note:document.referrer?('từ '+document.referrer.slice(0,80)):''});
};
/* tự gắn: mọi phần tử có data-track="tên" (detail = data-detail hoặc href) */
document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('[data-track]');if(el)HD.track(el.getAttribute('data-track'),el.getAttribute('data-detail')||el.getAttribute('href')||el.textContent.trim().slice(0,60))},true);

/* ---------- form đặt dịch vụ ---------- */
var CSS='.hdm{position:fixed;inset:0;z-index:90;background:rgba(4,3,8,.74);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px}'+
'.hdm[hidden]{display:none}.hdf{width:100%;max-width:560px;max-height:92vh;overflow:auto;border-radius:24px;border:1px solid rgba(255,255,255,.16);background:#0e0c16;color:#f5f2ff;padding:24px;box-shadow:0 40px 120px -30px #000;font-family:"Be Vietnam Pro",system-ui,sans-serif;position:relative}'+
'.hdf h3{margin:0 0 4px;font-size:22px;letter-spacing:-.01em}.hdf p.s{margin:0 0 16px;color:#a49fb8;font-size:14px}.hdf label{display:block;font-size:12.5px;color:#a49fb8;margin:10px 0 4px}'+
'.hdf input,.hdf select,.hdf textarea{width:100%;box-sizing:border-box;font:inherit;color:inherit;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:11px 12px}.hdf textarea{min-height:70px;resize:vertical}'+
'.hdf input:focus,.hdf select:focus,.hdf textarea:focus{outline:none;border-color:#22d3ee;box-shadow:0 0 0 3px rgba(34,211,238,.2)}.hdf .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:480px){.hdf .row{grid-template-columns:1fr}}'+
'.hdf .x{position:absolute;right:12px;top:10px;width:36px;height:36px;border:1px solid rgba(255,255,255,.16);border-radius:12px;background:transparent;color:#a49fb8;font-size:20px;cursor:pointer}'+
'.hdf .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.hdf button.b{font:inherit;font-weight:700;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:inherit;border-radius:14px;padding:13px 18px;cursor:pointer}'+
'.hdf button.b.p{border:0;color:#0a0810;background:linear-gradient(100deg,#ffb547,#ff4d6d 40%,#8b5cf6 75%,#22d3ee)}.hdf button.b[disabled]{opacity:.6;cursor:wait}'+
'.hdf .ok{display:none;text-align:center;padding:18px 0 6px}.hdf.done form{display:none}.hdf.done .ok{display:block}.hdf .ok b{display:block;font-size:20px;margin-bottom:6px}.hdf .ok a{display:inline-flex;margin-top:12px;padding:12px 18px;border-radius:14px;background:#f5f2ff;color:#0a0810;font-weight:700;text-decoration:none}'+
'.hdf small.n{display:block;color:#6d6882;font-size:11.5px;margin-top:10px;line-height:1.5}.hdf .err{color:#ff8da1;font-size:13px;margin-top:8px;display:none}';
var SERVICES=['Thumbnail Shorts 9:16','Thumbnail video dài 16:9','Poster / ảnh bài đăng 1:1','Tiêu đề + mô tả + hashtag','Kiểm duyệt trước đăng','Trả lời bình luận tự động','Tự động đăng & lên lịch đa nền tảng','Video AI ngắn 15–30s','Lồng tiếng đa ngữ + phụ đề karaoke','Voice clone đọc kịch bản','Nhạc nền AI cho Shorts','Website cá nhân / gian hàng affiliate','Đào tạo đội ngũ dùng AI','Thiết lập trọn bộ văn phòng AI','Khác (ghi ở phần ghi chú)'];
var modal=null;
function build(){
  if(modal)return modal;
  var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  modal=document.createElement('div');modal.className='hdm';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','hdf-t');
  modal.innerHTML='<div class="hdf"><button class="x" type="button" aria-label="Đóng">×</button><h3 id="hdf-t">Đặt dịch vụ AI của HADA</h3><p class="s">Điền 1 phút. HADA trả lời trong 24 giờ kèm mẫu thử miễn phí, chưa cần thanh toán.</p>'+
  '<form novalidate><label for="hdf-sv">Dịch vụ</label><select id="hdf-sv" name="item">'+SERVICES.map(function(s){return '<option>'+s+'</option>'}).join('')+'</select>'+
  '<div class="row"><div><label for="hdf-q">Số lượng / tháng</label><input id="hdf-q" name="qty" type="number" min="1" max="999" value="10" inputmode="numeric"></div><div><label for="hdf-c">Kênh của bạn (link YouTube/TikTok/Facebook)</label><input id="hdf-c" name="channel" type="url" placeholder="https://…" autocomplete="off"></div></div>'+
  '<label for="hdf-ct">Cách liên hệ lại (Zalo / Messenger / email) <b style="color:#ff8da1">*</b></label><input id="hdf-ct" name="contact" type="text" placeholder="Ví dụ: Zalo 09xx hoặc m.me/… hoặc email" required autocomplete="off">'+
  '<label for="hdf-n">Mô tả thêm (tuỳ chọn)</label><textarea id="hdf-n" name="note" placeholder="Phong cách muốn làm, deadline, ngân sách…"></textarea>'+
  '<div class="err" id="hdf-e"></div><div class="acts"><button class="b p" type="submit">Gửi yêu cầu →</button><button class="b" type="button" data-close>Để sau</button></div>'+
  '<small class="n">Thông tin chỉ dùng để HADA liên hệ báo giá; không chia sẻ cho bên thứ ba. Hệ thống nhận tối đa 100 yêu cầu/ngày; nếu quá tải, bạn nhắn thẳng Messenger nhé.</small></form>'+
  '<div class="ok"><b>Đã nhận yêu cầu, cảm ơn bạn!</b><span style="color:#a49fb8">HADA sẽ liên hệ trong 24 giờ. Muốn nhanh hơn, nhắn thêm qua Messenger:</span><br><a href="https://m.me/863132256880383" target="_blank" rel="noopener">💬 Mở Messenger</a></div></div>';
  document.body.appendChild(modal);
  var close=function(){modal.hidden=true;document.body.style.overflow=''};
  modal.addEventListener('click',function(e){if(e.target===modal||e.target.closest('.x')||e.target.closest('[data-close]'))close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)close()});
  var f=modal.querySelector('form'),err=modal.querySelector('#hdf-e');
  f.addEventListener('submit',function(e){e.preventDefault();err.style.display='none';
    var ct=f.contact.value.trim();if(ct.length<5){err.textContent='Bạn cho HADA một cách liên hệ lại nhé (Zalo, Messenger hoặc email).';err.style.display='block';f.contact.focus();return}
    var btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Đang gửi…';
    var p={type:'order',page:location.pathname,item:f.item.value,detail:(f.note.value||'').trim().slice(0,500),contact:(ct+(f.channel.value?' · kênh: '+f.channel.value.trim():'')).slice(0,300),qty:f.qty.value,total:HD.lastTotal||'',ua:ua(),note:'form web'};
    send(p,function(ok){btn.disabled=false;btn.textContent='Gửi yêu cầu →';if(ok){modal.querySelector('.hdf').classList.add('done');try{localStorage.setItem('hd_contact',ct)}catch(e){}}else{err.textContent='Chưa gửi được (mạng hoặc hệ thống đang đầy). Bạn nhắn Messenger giúp HADA: m.me/863132256880383';err.style.display='block'}});
  });
  return modal;
}
HD.order=function(pre){
  var m=build();pre=pre||{};var f=m.querySelector('form');
  m.querySelector('.hdf').classList.remove('done');
  if(pre.item){var o=[].slice.call(f.item.options).find(function(x){return x.text===pre.item});if(o)f.item.value=o.text;else{f.item.value='Khác (ghi ở phần ghi chú)';f.note.value=pre.item+(pre.note?'\n'+pre.note:'')}}
  if(pre.qty)f.qty.value=pre.qty;if(pre.note&&!f.note.value)f.note.value=pre.note;
  try{var c=localStorage.getItem('hd_contact');if(c&&!f.contact.value)f.contact.value=c}catch(e){}
  m.hidden=false;document.body.style.overflow='hidden';setTimeout(function(){(f.contact.value?f.item:f.contact).focus()},50);
  HD.track('mở form đặt hàng',pre.item||'');
};
document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('[data-order]');if(!el)return;e.preventDefault();HD.order({item:el.getAttribute('data-order')||'',qty:el.getAttribute('data-qty')||'',note:el.getAttribute('data-note')||''})});
})();

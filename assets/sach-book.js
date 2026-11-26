(function(){
document.getElementById('y').textContent=new Date().getFullYear();
var prog=document.getElementById('prog'),st=document.getElementById('sticky'),buy=document.getElementById('buy');
addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?scrollY/h*100:0)+'%';var r=buy.getBoundingClientRect();st.classList.toggle('on',r.bottom<0)},{passive:true});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.06});document.querySelectorAll('.rv').forEach(function(el){io.observe(el)})}else document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')});
var v=document.getElementById('vid'),id=v.dataset.yt,at=v.dataset.at;
if(id&&(!at||Date.now()>=Date.parse(at))){
 v.innerHTML='<img src="https://i.ytimg.com/vi/'+id+'/hq720.jpg" onerror="this.src=\'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg\'" alt="Video tóm tắt"><button type="button" aria-label="Phát video tóm tắt"><span>▶</span></button>';
 v.insertAdjacentHTML('afterend','<p style="text-align:center;margin:10px 0 0;font-size:13px"><a href="https://www.youtube.com/shorts/'+id+'" target="_blank" rel="noopener" style="color:var(--muted)">Không phát được? Xem trên YouTube ↗</a></p>');
 v.querySelector('button').onclick=function(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&playsinline=1&rel=0" title="Video tóm tắt sách" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';if(window.HD&&HD.track)HD.track('xem video sách',v.dataset.k)};
}
})();

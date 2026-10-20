(() => {
 const base='/hezi-site/hezi/tv/';
 const episodes={resume:{src:base+'resume-review.mp4',poster:base+'resume-review-cover.jpg',title:'中登金融男如何筛选实习生简历？',url:'https://www.douyin.com/video/7525027178182921522'},interview:{src:base+'zhuxun-interview.mp4',poster:base+'zhuxun-interview-cover.jpg',title:'我被朱迅老师采访啦！',url:'https://www.douyin.com/video/7668256114271050746'}};
 const icons={play:'<path d="m9 5 11 7-11 7Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',mute:'<path d="M4 9h4l5-4v14l-5-4H4Z"/><path d="m17 9 5 6m0-6-5 6"/>',volume:'<path d="M4 9h4l5-4v14l-5-4H4Z"/><path d="M17 8q6 4 0 8"/>'};
 let root,dispose=()=>{};
 function init(){const next=document.querySelector('.hz-cinema');if(next===root)return;dispose();root=next;if(!root)return;
 const scope=root,abort=new AbortController(),on=(e,t,f)=>e.addEventListener(t,f,{signal:abort.signal});
 const player=root.querySelector('.tv-player'),video=root.querySelector('video'),seek=root.querySelector('.tv-seek'),volume=root.querySelector('.tv-volume'),clock=root.querySelector('.tv-clock'),error=root.querySelector('.tv-error'),speed=root.querySelector('.tv-speed');
 const control=n=>root.querySelector(`[data-tv="${n}"]`),reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 let active='resume',manualPause=false,inView=false,autoPause=false,idleTimer,seeking=false;
 const fmt=t=>Number.isFinite(t)?Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0'):'0:00';
 const updateTime=()=>{if(!seeking)seek.value=video.duration?video.currentTime/video.duration*100:0;seek.setAttribute('aria-valuetext',fmt(video.currentTime)+' / '+fmt(video.duration));clock.textContent=fmt(video.currentTime)+' / '+fmt(video.duration);};
 function wake(){player.classList.remove('is-idle');clearTimeout(idleTimer);if(!video.paused)idleTimer=setTimeout(()=>player.classList.add('is-idle'),2400);}
 async function play(){try{await video.play();}catch{player.classList.add('is-paused');}}
 function pauseAuto(){if(!video.paused){autoPause=true;video.pause();}}
 function toggle(){if(video.paused){manualPause=false;play();}else{manualPause=true;video.pause();}wake();}
 function sync(){const paused=video.paused;player.classList.toggle('is-paused',paused);scope.classList.toggle('is-paused',paused);control('play').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[paused?'play':'pause']+'</svg>';control('play').setAttribute('aria-label',paused?'播放':'暂停');control('play').title=paused?'播放':'暂停';control('surface').setAttribute('aria-label',paused?'播放':'暂停');wake();}
 function select(key){if(key===active)return;active=key;video.pause();video.src=episodes[key].src;video.poster=episodes[key].poster;video.setAttribute('aria-label',episodes[key].title);root.querySelector('.tv-ambient').style.backgroundImage=`url("${episodes[key].poster}")`;root.querySelector('#hz-playing-title').textContent=episodes[key].title;root.querySelector('#hz-video-original').href=episodes[key].url;error.querySelector('a').href=episodes[key].url;error.hidden=true;root.querySelector('.tv-total').textContent=(key==='resume'?'01':'02')+' — 02';root.querySelectorAll('[data-hz-episode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.hzEpisode===key)));manualPause=false;video.load();video.playbackRate=Number(speed.value);updateTime();play();}
 on(control('surface'),'click',toggle);on(control('play'),'click',toggle);on(control('next'),'click',()=>select(active==='resume'?'interview':'resume'));
 root.querySelectorAll('[data-hz-episode]').forEach(b=>on(b,'click',()=>{if(b.dataset.hzEpisode===active){toggle();return;}select(b.dataset.hzEpisode);}));
 on(video,'play',()=>{manualPause=false;sync();});on(video,'pause',()=>{if(!autoPause)manualPause=true;autoPause=false;sync();});on(video,'ended',()=>{if(active==='resume')select('interview');else sync();});
 on(video,'timeupdate',updateTime);on(video,'loadedmetadata',()=>{video.playbackRate=Number(speed.value);updateTime();});
 on(video,'waiting',()=>player.classList.add('is-buffering'));['playing','canplay','pause','error'].forEach(t=>on(video,t,()=>player.classList.remove('is-buffering')));
 on(video,'error',()=>{error.hidden=false;});on(control('retry'),'click',()=>{error.hidden=true;video.load();play();});
 on(seek,'input',()=>{seeking=true;if(Number.isFinite(video.duration)){video.currentTime=Number(seek.value)/100*video.duration;clock.textContent=fmt(video.currentTime)+' / '+fmt(video.duration);}});on(seek,'change',()=>{seeking=false;updateTime();});
 on(control('mute'),'click',()=>{video.muted=!video.muted;if(!video.muted&&video.volume===0)video.volume=1;});on(volume,'input',()=>{video.volume=Number(volume.value);video.muted=video.volume===0;});
 function sound(){const muted=video.muted||video.volume===0;control('mute').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[muted?'mute':'volume']+'</svg>';control('mute').setAttribute('aria-label',muted?'打开声音':'静音');control('mute').title=muted?'打开声音':'静音';volume.value=muted?0:video.volume;}
 on(video,'volumechange',sound);on(speed,'change',()=>{video.playbackRate=Number(speed.value);});
 const theater=document.createElement('dialog');theater.className='tv-theater';scope.append(theater);let placeholder;
 function closeTheater(){if(!placeholder)return;placeholder.replaceWith(player);placeholder=null;theater.close();control('full').setAttribute('aria-label','全屏');wake();}
 function openTheater(){placeholder=document.createComment('tv-player');player.replaceWith(placeholder);theater.append(player);theater.showModal();control('full').setAttribute('aria-label','退出全屏');wake();}
 on(theater,'cancel',e=>{e.preventDefault();closeTheater();});
 on(control('full'),'click',async()=>{if(theater.open){closeTheater();return;}try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.fullscreenEnabled&&player.requestFullscreen)await player.requestFullscreen();else if(video.webkitSupportsFullscreen&&video.webkitEnterFullscreen)video.webkitEnterFullscreen();else openTheater();}catch{openTheater();}});
 on(document,'fullscreenchange',()=>control('full').setAttribute('aria-label',document.fullscreenElement?'退出全屏':'全屏'));
 if(!document.pictureInPictureEnabled)control('pip').hidden=true;else on(control('pip'),'click',async()=>{try{if(document.pictureInPictureElement)await document.exitPictureInPicture();else await video.requestPictureInPicture();}catch{}});
 on(player,'pointermove',wake);on(player,'focusin',wake);on(player,'keydown',e=>{if(/INPUT|SELECT|BUTTON|A/.test(e.target.tagName))return;if(e.code==='Space'||e.key==='k'){e.preventDefault();toggle();}else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();video.currentTime=Math.max(0,Math.min(video.duration||0,video.currentTime+(e.key==='ArrowRight'?5:-5)));wake();}else if(e.key==='m'){video.muted=!video.muted;}});
 const observer=new IntersectionObserver(es=>{inView=es[0].isIntersecting;if(inView&&!manualPause&&!reduced&&!document.hidden)play();else if(!inView&&!document.pictureInPictureElement)pauseAuto();},{threshold:.35});observer.observe(video);
 on(document,'visibilitychange',()=>{if(document.hidden&&!document.pictureInPictureElement)pauseAuto();else if(inView&&!manualPause&&!reduced)play();});
 video.controls=false;sync();sound();dispose=()=>{closeTheater();theater.remove();abort.abort();observer.disconnect();clearTimeout(idleTimer);video.pause();};
 }
 init();new MutationObserver(()=>{if(document.querySelector('.hz-cinema')!==root)init();}).observe(document.body,{childList:true,subtree:true});
})();

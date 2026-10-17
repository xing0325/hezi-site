(() => {
  const episodes = {
    interview: {src:'/hezi-site/hezi/tv/zhuxun-interview.mp4',poster:'/hezi-site/hezi/tv/zhuxun-interview-cover.jpg',title:'我被朱迅老师采访啦！',number:'02',url:'https://www.douyin.com/video/7668256114271050746'},
    resume: {src:'/hezi-site/hezi/tv/resume-review.mp4',poster:'/hezi-site/hezi/tv/resume-review-cover.jpg',title:'中登金融男如何筛选实习生简历？',number:'01',url:'https://www.douyin.com/video/7525027178182921522'}
  };
  let activeRoot, dispose = () => {};
  const init = () => {
    const root = document.querySelector('.hz-tv');
    if (root === activeRoot) return;
    dispose(); activeRoot = root;
    if (!root) return;
    const abort = new AbortController(), signal = abort.signal;
    const on = (el,type,fn) => el.addEventListener(type,fn,{signal});
    const video = root.querySelector('video'), sound = root.querySelector('.hz-sound');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let inView = false, manualPause = false, autoPause = false;
    const play = () => video.play().catch(() => {});
    const pause = () => { if (!video.paused) {autoPause=true; video.pause();} };
    on(video,'pause',() => {if(!autoPause) manualPause=true; autoPause=false;});
    on(video,'play',() => {manualPause=false;});
    on(video,'volumechange',() => {sound.hidden=!video.muted;});
    on(sound,'click',() => {video.muted=false;play();});
    const visibility = new IntersectionObserver(entries => {
      inView=entries[0].isIntersecting;
      if(inView && !reduced && !manualPause && !document.hidden) play();
      else if(!inView) pause();
    },{threshold:.45});
    root.querySelectorAll('[data-hz-episode]').forEach(button => on(button,'click',() => {
      const item=episodes[button.dataset.hzEpisode];
      root.querySelectorAll('[data-hz-episode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      video.src=item.src;video.poster=item.poster;video.setAttribute('aria-label',item.title);
      root.querySelector('#hz-playing-title').textContent=`${item.number} / ${item.title}`;
      root.querySelector('#hz-video-original').href=item.url;
      manualPause=false;play();
    }));
    on(document,'visibilitychange',()=>{if(document.hidden)pause();else if(inView&&!manualPause&&!reduced)play();});
    on(video,'error',()=>{sound.textContent='暂时无法播放，请打开下方「抖音原片」';sound.hidden=false;sound.disabled=true;});
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('hz-revealed');reveal.unobserve(e.target);}}),{threshold:.12});
    document.querySelectorAll('.hz-tv,.hz-mamba,.hz-social').forEach(e=>e.classList.add('hz-reveal-ready'));
    document.querySelectorAll('[data-hz-reveal]').forEach(e=>reveal.observe(e));
    visibility.observe(video);
    dispose=()=>{abort.abort();visibility.disconnect();reveal.disconnect();video.pause();};
  };
  init();
  // The original site swaps page containers without a full reload.
  new MutationObserver(()=>{if(document.querySelector('.hz-tv')!==activeRoot)init();}).observe(document.body,{childList:true,subtree:true});
})();

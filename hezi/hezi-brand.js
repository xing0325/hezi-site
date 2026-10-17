(()=>{
 const initialized=new WeakSet();let scrollSignatures=[];let queued=false;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const draw=()=>{queued=false;
 const sections=[...document.querySelectorAll('[data-nav-theme-target]')].map(el=>({el,r:el.getBoundingClientRect()})).filter(x=>x.r.height>0);
 const active=sections.filter(x=>x.r.top<=24&&x.r.bottom>24).at(-1)||sections.sort((a,b)=>Math.abs(a.r.top)-Math.abs(b.r.top))[0];
 const menu=document.querySelector('.nav-ham[aria-expanded="true"]');
 const dual=document.getElementById('H05')?.getBoundingClientRect();
 const light=menu||(dual&&dual.top<=80&&dual.bottom>80)||active?.el.getAttribute('data-nav-theme-target')==='light';
 document.documentElement.style.setProperty('--hezi-emblem-ink',light?'#fff9ed':'#552583');
 document.querySelectorAll('.nav-brand-link').forEach(el=>el.style.setProperty('color',light?'#fff9ed':'#552583','important'));
const tracker=document.querySelector('.hero-rive-tracker');if(!tracker)return;const r=tracker.getBoundingClientRect();const p=clamp((innerHeight*.5-r.top)/Math.max(1,r.height-innerHeight*.3));for(const svg of scrollSignatures){svg.style.opacity=p>0?'1':'0';svg.querySelectorAll('path').forEach((path,i)=>{path.style.strokeDashoffset=String(1-clamp(p*1.45-i*.15))})}};
 const update=()=>{if(!queued){queued=true;requestAnimationFrame(draw)}};
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-drawn');observer.unobserve(entry.target)}},{threshold:.15});
 const init=()=>{document.querySelectorAll('.hezi-signature-animated').forEach(svg=>{if(initialized.has(svg))return;initialized.add(svg);svg.querySelectorAll('path').forEach(path=>path.setAttribute('pathLength','1'));if(!svg.closest('.marquee-gl-rive-target'))observer.observe(svg)});scrollSignatures=[...document.querySelectorAll('.marquee-gl-rive-target .hezi-signature-animated')];update()};
 let dualActive=false;const watchDual=()=>{const r=document.getElementById('H05')?.getBoundingClientRect();const now=!!r&&r.top<=80&&r.bottom>80;if(now!==dualActive){dualActive=now;update()}requestAnimationFrame(watchDual)};requestAnimationFrame(watchDual);
 init();new MutationObserver(init).observe(document.body,{childList:true,subtree:true});addEventListener('scroll',update,{passive:true});addEventListener('resize',update);document.addEventListener('click',update);
})();

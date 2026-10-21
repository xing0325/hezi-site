(()=>{'use strict';
const KEY='hezi-wall-layout-20261021', DRAFT='hezi-wall-draft-20261021';
const clone=x=>JSON.parse(JSON.stringify(x));
function validate(input){
 if(!input||input.version!==1||!Array.isArray(input.items)||input.items.length>80)throw Error('不是有效的照片墙布局文件（最多 80 个元素）');
 const n=(x,min,max,f)=>Number.isFinite(Number(x))?Math.min(max,Math.max(min,Number(x))):f;
 const state={version:1,width:n(input.width,1200,10000,2600),height:800,background:/^#[0-9a-f]{6}$/i.test(input.background)?input.background:'#eee7e3',items:[]};
 const ids=new Set();
 for(const [index,v] of input.items.entries()){
  if(!v||!['image','text'].includes(v.type))throw Error('布局包含未知元素');
  if(v.type==='image'&&!(/^\/(?:hezi-site\/)?hezi\/photos\/[\w.-]+$/.test(v.src)||/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v.src)))throw Error('照片来源不受支持，请使用素材库或本地上传');
  let id=typeof v.id==='string'&&/^[\w-]{1,80}$/.test(v.id)&&!ids.has(v.id)?v.id:'item-'+index+'-'+Date.now();ids.add(id);
  const w=n(v.w,40,state.width,200),h=n(v.h,40,740,200);
  state.items.push({id,type:v.type,src:v.type==='image'?v.src:undefined,naturalWidth:n(v.naturalWidth,1,30000,1000),naturalHeight:n(v.naturalHeight,1,30000,1000),caption:String(v.caption||'').slice(0,300),alt:String(v.alt||v.caption||'').slice(0,300),x:n(v.x,0,state.width-w,0),y:n(v.y,30,800-h,40),w,h,rotation:n(v.rotation,-180,180,0),cropZoom:n(v.cropZoom,1,5,1),cropX:n(v.cropX,0,100,50),cropY:n(v.cropY,0,100,50),locked:!!v.locked,hidden:!!v.hidden});
 }return state;
}
function read(key){try{const s=localStorage.getItem(key);return s?validate(JSON.parse(s)):null;}catch{return null;}}
function imageStyle(item){const scale=Math.max(item.w/item.naturalWidth,item.h/item.naturalHeight)*item.cropZoom;const w=item.naturalWidth*scale,h=item.naturalHeight*scale;return {width:w/item.w*100+'%',height:h/item.h*100+'%',left:(item.w-w)*item.cropX/item.w+'%',top:(item.h-h)*item.cropY/item.h+'%'};}
function makeContent(item){const f=document.createElement('div');f.className='wall-frame';if(item.type==='image'){const img=document.createElement('img');img.src=item.src;img.alt=item.alt;img.draggable=false;Object.assign(img.style,imageStyle(item));f.append(img);}else{f.classList.add('wall-text');f.textContent=item.caption;}
return f;}
function fitText(e){let size=parseFloat(getComputedStyle(e).fontSize);e.style.lineHeight='1.4';while((e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1)&&size>9){size-=.5;e.style.fontSize=size+'px';}}
window.HeziWall={KEY,DRAFT,clone,validate,read,imageStyle,makeContent,fitText};
})();

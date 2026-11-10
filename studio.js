(() => {
'use strict';
const $=id=>document.getElementById(id), canvas=$('artboard'), ctx=canvas.getContext('2d');
const W=canvas.width,H=canvas.height, STORAGE='cartoon-short-kit-studio-v1';
const makeId=()=>crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());
const makeLayer=name=>({id:makeId(),name,visible:true,items:[]});
let project={version:1,name:'My Cartoon',background:'#ffffff',fps:12,frames:[{layers:[makeLayer('Sketch'),makeLayer('Line art')]}]};
let frameIndex=0,layerIndex=1,tool='pen',color='#202431',size=10,drawing=null,undoStack=[],playing=false,playTimer=null,selected=null,dragStart=null;
let audioUrl=null,audioContext=null,audioSource=null,audioGain=null,recording=false;
const activeFrame=()=>project.frames[frameIndex],activeLayer=()=>activeFrame().layers[layerIndex]||activeFrame().layers[0];
function snapshot(){undoStack.push(JSON.stringify(project));if(undoStack.length>40)undoStack.shift()}
function setStatus(t){$('saveState').textContent=t}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(project));setStatus('Saved on this iPhone')}catch(e){setStatus('Could not save — storage full')}}
function load(){try{const raw=localStorage.getItem(STORAGE);if(raw){const p=JSON.parse(raw);if(p&&p.version===1&&Array.isArray(p.frames)&&p.frames.length){project=p;frameIndex=0;layerIndex=0;setStatus('Restored local project')}}}catch(e){setStatus('New project')}}
function drawItem(c,item,alpha=1){c.save();c.globalAlpha=alpha;c.strokeStyle=item.color||'#202431';c.fillStyle=item.color||'#202431';c.lineWidth=item.size||10;c.lineCap='round';c.lineJoin='round';
 if(item.type==='path'){const pts=item.points||[];if(pts.length){c.beginPath();c.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)c.lineTo(pts[i].x,pts[i].y);if(pts.length===1)c.lineTo(pts[0].x+.1,pts[0].y+.1);c.stroke()}}
 if(item.type==='line'){c.beginPath();c.moveTo(item.x1,item.y1);c.lineTo(item.x2,item.y2);c.stroke()}
 if(item.type==='rect'){c.strokeRect(item.x,item.y,item.w,item.h)}
 if(item.type==='ellipse'){c.beginPath();c.ellipse(item.x+item.w/2,item.y+item.h/2,Math.abs(item.w/2),Math.abs(item.h/2),0,0,Math.PI*2);c.stroke()}
 if(item.type==='text'){c.font='bold '+(item.size*5)+'px system-ui';c.textBaseline='top';c.fillText(item.text,item.x,item.y)}
 if(item.type==='erase'){c.globalCompositeOperation='destination-out';c.beginPath();const pts=item.points||[];if(pts.length){c.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)c.lineTo(pts[i].x,pts[i].y)}c.lineWidth=item.size*3;c.stroke()}
 c.restore()}
function bounds(item){
 let x=item.x||0,y=item.y||0,w=item.w||0,h=item.h||0;
 if(item.type==='line'){x=Math.min(item.x1,item.x2);y=Math.min(item.y1,item.y2);w=Math.abs(item.x2-item.x1);h=Math.abs(item.y2-item.y1)}
 if(item.type==='path'||item.type==='erase'){const pts=item.points||[];if(!pts.length)return{x:0,y:0,w:0,h:0};const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);x=Math.min(...xs);y=Math.min(...ys);w=Math.max(...xs)-x;h=Math.max(...ys)-y}
 if(item.type==='text'){w=Math.max(60,(item.text||'').length*(item.size||10)*2.8);h=(item.size||10)*6}
 const pad=Math.max(12,(item.size||10)*1.5);return{x:x-pad,y:y-pad,w:w+pad*2,h:h+pad*2}
}
function hitTest(p){const layers=activeFrame().layers;for(let li=layers.length-1;li>=0;li--){const l=layers[li];if(!l.visible)continue;for(let i=l.items.length-1;i>=0;i--){const b=bounds(l.items[i]);if(p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h)return{layer:li,index:i,item:l.items[i]}}}return null}
function render(){ctx.clearRect(0,0,W,H);ctx.fillStyle=project.background;ctx.fillRect(0,0,W,H);
 if($('onion').checked&&frameIndex>0){const prev=project.frames[frameIndex-1];prev.layers.forEach(l=>{if(l.visible)l.items.forEach(it=>drawItem(ctx,it,.18))})}
 activeFrame().layers.forEach(l=>{if(l.visible)l.items.forEach(it=>drawItem(ctx,it))});
 if(selected&&selected.frame===frameIndex){const b=bounds(selected.item);ctx.save();ctx.strokeStyle='#795cff';ctx.lineWidth=3;ctx.setLineDash([10,7]);ctx.strokeRect(b.x,b.y,b.w,b.h);ctx.restore()}
 if(drawing){if(drawing.type==='path'||drawing.type==='erase')drawItem(ctx,drawing);else drawItem(ctx,{...drawing,x:Math.min(drawing.x1,drawing.x2),y:Math.min(drawing.y1,drawing.y2),w:drawing.x2-drawing.x1,h:drawing.y2-drawing.y1})}
}
function renderLayers(){const el=$('layers');el.innerHTML='';activeFrame().layers.forEach((l,i)=>{const b=document.createElement('div');b.className='layer-chip'+(i===layerIndex?' active':'');const vis=document.createElement('button');vis.className='vis';vis.textContent=l.visible?'◉':'○';vis.onclick=()=>{l.visible=!l.visible;render();renderLayers();save()};const name=document.createElement('span');name.textContent=l.name;name.onclick=()=>{layerIndex=i;renderLayers()};b.append(vis,name);el.append(b)});$('addLayer').disabled=activeFrame().layers.length>=8}
function renderFrames(){const el=$('frames');el.innerHTML='';project.frames.forEach((f,i)=>{const b=document.createElement('button');b.className='frame-chip'+(i===frameIndex?' active':'');const n=document.createElement('strong');n.textContent=i+1;const s=document.createElement('small');s.textContent=f.layers.reduce((a,l)=>a+l.items.length,0)+' marks';b.append(n,s);b.onclick=()=>{frameIndex=i;layerIndex=Math.min(layerIndex,f.layers.length-1);selected=null;renderAll()};el.append(b)});$('frameLabel').textContent='Frame '+(frameIndex+1)+' of '+project.frames.length}
function renderAll(){render();renderLayers();renderFrames()}
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}}
function down(e){e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);
 if(tool==='select'){const hit=hitTest(p);if(hit){selected={...hit,frame:frameIndex};layerIndex=hit.layer;dragStart={x:p.x,y:p.y,item:JSON.parse(JSON.stringify(hit.item))};renderLayers()}else{selected=null;dragStart=null}render();return}
 if(tool==='text'){snapshot();showText(p);return}
 snapshot();if(tool==='pen'||tool==='eraser')drawing={type:tool==='pen'?'path':'erase',color,size,points:[p]};else drawing={type:tool,color,size,x1:p.x,y1:p.y,x2:p.x,y2:p.y};render()}
function move(e){const p=point(e);if(tool==='select'&&selected&&dragStart&&e.buttons){const dx=p.x-dragStart.x,dy=p.y-dragStart.y;const it=selected.item,orig=dragStart.item;if(it.type==='path'||it.type==='erase'){it.points=orig.points.map(q=>({x:q.x+dx,y:q.y+dy}))}else if(it.type==='line'){it.x1=orig.x1+dx;it.x2=orig.x2+dx;it.y1=orig.y1+dy;it.y2=orig.y2+dy}else{it.x=orig.x+dx;it.y=orig.y+dy}render();return}
 if(!drawing)return;e.preventDefault();if(drawing.points)drawing.points.push(p);else{drawing.x2=p.x;drawing.y2=p.y}render()}
function up(){if(drawing){const d=drawing;if(d.type==='rect'||d.type==='ellipse'){d.x=Math.min(d.x1,d.x2);d.y=Math.min(d.y1,d.y2);d.w=Math.abs(d.x2-d.x1);d.h=Math.abs(d.y2-d.y1);delete d.x1;delete d.y1;delete d.x2;delete d.y2}activeLayer().items.push(d);drawing=null;render();renderFrames();save()}else if(selected&&dragStart){dragStart=null;save()}}
function showText(p){$('dialog').classList.remove('hidden');$('dialogInput').value='';$('dialogInput').focus();$('dialogOk').onclick=()=>{const t=$('dialogInput').value.trim();if(t){activeLayer().items.push({type:'text',text:t,x:p.x,y:p.y,color,size});render();renderFrames();save()}$('dialog').classList.add('hidden')};$('dialogCancel').onclick=()=>$('dialog').classList.add('hidden')}
canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
document.querySelectorAll('[data-tool]').forEach(b=>{b.onclick=()=>{tool=b.dataset.tool;document.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('active',x===b));if(tool!=='select')selected=null;render()}});tool='select';document.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('active',x.dataset.tool==='select'));
$('color').oninput=e=>color=e.target.value;$('size').oninput=e=>{size=+e.target.value;$('sizeOut').value=size};
$('bgColor').oninput=e=>{project.background=e.target.value;render();save()};
$('undoBtn').onclick=()=>{const p=undoStack.pop();if(p){project=JSON.parse(p);frameIndex=Math.min(frameIndex,project.frames.length-1);layerIndex=0;selected=null;renderAll();save()}};
$('deleteBtn').onclick=()=>{if(!selected)return;const l=project.frames[selected.frame].layers[selected.layer];l.items.splice(selected.index,1);selected=null;dragStart=null;renderAll();save()};
$('clearBtn').onclick=()=>{if(confirm('Clear everything on the selected layer in this frame?')){snapshot();activeLayer().items=[];selected=null;renderAll();save()}};
$('addLayer').onclick=()=>{if(activeFrame().layers.length>=8)return;snapshot();activeFrame().layers.push(makeLayer('Layer '+(activeFrame().layers.length+1)));layerIndex=activeFrame().layers.length-1;renderAll();save()};
$('addFrame').onclick=()=>{if(project.frames.length>=900){alert('Maximum 900 frames per project.');return}snapshot();const f=activeFrame();project.frames.splice(frameIndex+1,0,{layers:f.layers.map(l=>({...l,id:makeId(),items:[]}))});frameIndex++;layerIndex=0;selected=null;renderAll();save()};
$('onion').onchange=render;$('fps').onchange=e=>{project.fps=+e.target.value;save()};
$('playBtn').onclick=()=>{if(playing){clearInterval(playTimer);playing=false;$('playBtn').textContent='▶ Play';return}playing=true;$('playBtn').textContent='Ⅱ Stop';playTimer=setInterval(()=>{frameIndex=(frameIndex+1)%project.frames.length;selected=null;renderAll()},1000/project.fps)};
$('saveBtn').onclick=save;
$('pngBtn').onclick=()=>{const a=document.createElement('a');a.download='cartoon-frame-'+(frameIndex+1)+'.png';a.href=canvas.toDataURL('image/png');a.click()};
$('projectBtn').onclick=()=>{const blob=new Blob([JSON.stringify(project,null,2)],{type:'application/json'});download(blob,'cartoon-short-kit-project.json')};
function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),3000)}
$('importProject').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const p=JSON.parse(await f.text());if(p.version!==1||!Array.isArray(p.frames)||!p.frames.length)throw Error('Not a Cartoon Studio project');snapshot();project=p;frameIndex=0;layerIndex=0;selected=null;renderAll();save()}catch(err){alert('Could not import: '+err.message)}e.target.value=''};
$('menuBtn').onclick=()=>{const name=prompt('Project name',project.name);if(name!==null){project.name=name.trim()||'My Cartoon';setStatus(project.name);save()}};
$('audioFile').onchange=e=>{const f=e.target.files[0];if(!f)return;if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(f);$('audioPreview').src=audioUrl;$('audioPreview').classList.add('ready');$('audioStatus').textContent=f.name;$('audioPreview').volume=+$('audioVolume').value/100};
$('audioVolume').oninput=e=>{$('audioPreview').volume=+e.target.value/100;if(audioGain)audioGain.gain.value=+e.target.value/100};
$('removeAudio').onclick=()=>{if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=null;$('audioPreview').pause();$('audioPreview').removeAttribute('src');$('audioPreview').classList.remove('ready');$('audioStatus').textContent='No audio loaded';$('audioFile').value=''};
function chooseMime(){if(!window.MediaRecorder)return null;const types=['video/mp4;codecs=h264,aac','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];return types.find(t=>MediaRecorder.isTypeSupported(t))||''}
$('videoBtn').onclick=async()=>{if(recording)return;if(!canvas.captureStream||!window.MediaRecorder){alert('Video export is not supported by this browser. Try a recent Safari or desktop Chrome.');return}
 const mime=chooseMime();if(mime===null){alert('This browser does not support video recording.');return}
 const frames=project.frames.length,fps=project.fps||12,duration=frames/fps;
 if(duration>120){alert('Please export projects in clips of 120 seconds or less.');return}
 const btn=$('videoBtn'),old=btn.textContent;btn.disabled=true;btn.textContent='Preparing…';
 let stream,recorder,chunks=[];
 try{
  stream=canvas.captureStream(fps);
  const audio=$('audioPreview');
  if(audioUrl){
   const AC=window.AudioContext||window.webkitAudioContext;
   if(AC){audioContext=audioContext||new AC();await audioContext.resume();if(!audioSource){audioSource=audioContext.createMediaElementSource(audio);audioGain=audioContext.createGain();audioSource.connect(audioGain);audioGain.connect(audioContext.destination)}audioGain.gain.value=+$('audioVolume').value/100;const dest=audioContext.createMediaStreamDestination();audioGain.connect(dest);dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t))}
  }
  recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
  recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  const done=new Promise((resolve,reject)=>{recorder.onerror=()=>reject(new Error('Recording failed'));recorder.onstop=resolve});
  frameIndex=0;renderAll();recorder.start(250);recording=true;btn.textContent='Recording…';
  if(audioUrl){audio.currentTime=0;await audio.play().catch(()=>{})}
  let i=0;const interval=Math.max(10,1000/fps);
  await new Promise(resolve=>{const step=()=>{if(i>=frames){resolve();return}frameIndex=i;render();i++;btn.textContent='Rendering '+Math.round(i/frames*100)+'%';setTimeout(step,interval)};step()});
  if(audioUrl)audio.pause();recorder.stop();await done;
  const type=recorder.mimeType||mime||'video/webm';const ext=type.includes('mp4')?'mp4':'webm';download(new Blob(chunks,{type}), (project.name||'cartoon-short')+'.'+ext);
  btn.textContent='Export complete';setTimeout(()=>{btn.textContent=old},1800);
 }catch(err){alert('Could not export video: '+err.message);if(recorder&&recorder.state!=='inactive')recorder.stop();btn.textContent=old}
 finally{recording=false;btn.disabled=false;if(stream)stream.getTracks().forEach(t=>t.stop());renderAll()}
};
load();$('fps').value=String(project.fps||12);$('bgColor').value=project.background;renderAll();if(!localStorage.getItem(STORAGE))setStatus('Unsaved project');
})();
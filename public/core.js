export const SHARP=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const FLAT=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const NOTES={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
const CHORD=/^([A-G](?:#|b)?)(?:(?:maj|min|dim|aug|sus|add|m|M|Δ|ø|°)|\/[0-9]+|[0-9]+|[#b][0-9]+|[()+-])*(?:\/([A-G](?:#|b)?))?$/;
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const isChord=s=>CHORD.test(s)&&!/[a-z]{5}/.test(s);
export function transposeChord(chord,steps,preferFlats=false){
 if(!steps||!isChord(chord))return chord;
 const palette=preferFlats?FLAT:SHARP;
 return chord.replace(/^([A-G](?:#|b)?)|\/([A-G](?:#|b)?)$/g,(all,root,bass)=>{const n=root||bass;const value=palette[((NOTES[n]+steps)%12+12)%12];return bass?'/'+value:value;});
}
export function renderText(content,steps=0,key=''){
 const preferFlats=/b|^(F|Dm)$/.test(key);
 return String(content||'').replace(/\r\n?/g,'\n').split('\n').map(line=>{
  const bracket=line.trim().match(/^\[([^\]]+)\]$/);
  const directive=line.trim().match(/^\{(?:c|comment):\s*(.*?)\}$/i);
  const plainSection=/^(INTRO|VERSO|REFRÃO|REFRAO|PONTE|FINAL|SOLO|INSTRUMENTAL)\s*:?\s*$/.test(line.trim());
  const section=directive?.[1]||(bracket&&!isChord(bracket[1])?bracket[1]:null)||(plainSection?line.trim():null);
  if(section)return '<div class="song-section">'+esc(section)+'</div>';
  const inline=[...line.matchAll(/\[([^\]]+)\]/g)].filter(m=>isChord(m[1]));
  if(inline.length){let html='',offset=0;for(let i=0;i<inline.length;i++){const m=inline[i];if(m.index>offset)html+=esc(line.slice(offset,m.index));const end=inline[i+1]?.index??line.length;const text=line.slice(m.index+m[0].length,end);html+='<span class="chord-stack"><span class="inline-chord">'+esc(transposeChord(m[1],steps,preferFlats))+'</span><span>'+esc(text||' ')+'</span></span>';offset=end}return '<div class="lyric-line">'+html+'</div>'}
  const tokens=line.trim().split(/\s+/).filter(Boolean);const chordOnly=tokens.length&&tokens.every(t=>isChord(t)||/^[:|%/().-]+$/.test(t))&&tokens.some(isChord);
  if(chordOnly)return '<div class="lyric-line chord-line">'+esc(line.replace(/\S+/g,t=>transposeChord(t,steps,preferFlats)))+'</div>';
  return '<div class="lyric-line">'+(esc(line)||'<br>')+'</div>';
 }).join('');
}
const collator=new Intl.Collator('pt-BR',{sensitivity:'base'});
export function listSongs(songs,setlists,view,query=''){
 const byId=['library','favorites','catalog','personal'].includes(view)?null:new Map(songs.map(s=>[s.id,s]));
 let result=view==='favorites'?songs.filter(s=>s.favorite):view==='catalog'?songs.filter(s=>s.source==='catalog'):view==='personal'?songs.filter(s=>s.source!=='catalog'):view==='library'?[...songs]:[...(setlists.find(l=>l.id===view)?.songIds||[])].map(id=>byId.get(id)).filter(Boolean);
 const q=normalize(query).trim();if(q)result=result.filter(s=>(s.searchText||normalize([s.title,s.artist,s.tags].join(' '))).includes(q));
 if(['library','favorites','catalog','personal'].includes(view))result=[...result].sort((a,b)=>collator.compare(a.title,b.title)||collator.compare(a.artist||'',b.artist||''));return result;
}

export function safeSong(value){
 if(!value||typeof value!=='object'||typeof value.id!=='string'||!value.id||typeof value.title!=='string'||!value.title.trim())throw Error('Música inválida no backup.');
 if(!['text','pdf','guitarpro'].includes(value.type))throw Error('Formato de música inválido.');
 const song={id:value.id.slice(0,180),title:value.title.slice(0,180),artist:String(value.artist||'').slice(0,180),key:String(value.key||'').slice(0,12),tags:String(value.tags||'').slice(0,300),content:String(value.content||''),type:value.type,favorite:!!value.favorite,fontSize:Math.max(16,Math.min(52,Number(value.fontSize)||26)),speed:Math.max(5,Math.min(90,Number(value.speed)||22)),transpose:Math.max(-12,Math.min(12,Number(value.transpose)||0)),readingMode:value.readingMode==='page'?'page':'continuous',updatedAt:Date.now()};
 if(song.type==='guitarpro'){song.gpTrack=Math.max(0,Math.min(999,Math.trunc(Number(value.gpTrack)||0)));song.gpProfile=[1,2,3].includes(Number(value.gpProfile))?Number(value.gpProfile):1;}
 if(song.content.length>2000000)throw Error('Letra grande demais no backup.');return song;
}

export function fitPageScale(pageWidth,pageHeight,width,height){return Math.min(Math.max(1,width)/pageWidth,Math.max(1,height)/pageHeight)}
export function boundedPage(current,direction,total){return Math.max(1,Math.min(Math.max(1,total),current+direction))}

export function paginateBlocks(heights,capacity){const pages=[];let page=[],used=0;for(let i=0;i<heights.length;i++){const h=Math.max(0,Number(heights[i])||0);if(page.length&&used+h>capacity){pages.push(page);page=[];used=0}page.push(i);used+=h;if(h>capacity){pages.push(page);page=[];used=0}}if(page.length)pages.push(page);return pages.length?pages:[[]]}

export function swipeDirection(dx,dy){return Math.abs(dx)>=60&&Math.abs(dx)>Math.abs(dy)*1.3?(dx<0?1:-1):0}

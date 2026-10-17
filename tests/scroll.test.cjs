const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('public/app.js','utf8');const start=source.slice(source.indexOf('function startScroll(){'),source.indexOf('function toggleScroll(){'));
function simulate(speed,loading=false,whole=false){let frame;const state={scrolling:false};let top=0;const viewport={scrollHeight:5000,clientHeight:500,get scrollTop(){return top},set scrollTop(v){top=Math.round(v)}};const controls={lyricsViewport:viewport,speed:{value:speed},scrollSymbol:{},scrollLabel:{}};const context={state,readerLoading:loading,selected:()=>({}),pageMode:()=>whole,$:id=>controls[id],keepAwake(){},lastFrame:0,scrollPosition:0,updateProgress(){},stopScroll(){state.scrolling=false},requestAnimationFrame(fn){frame=fn;return 1}};vm.createContext(context);vm.runInContext(start+';startScroll()',context);for(let i=0;i<=120&&state.scrolling;i++)frame(1000+i*1000/60);return {top,state}}
for(const speed of [5,22,60])assert(Math.abs(simulate(speed).top-speed*2)<=1,'speed '+speed);
assert.equal(simulate(22,true).state.scrolling,false);assert.equal(simulate(22,false,true).state.scrolling,false);
assert(!source.includes("if(state.scrolling)scrollPosition=$('lyricsViewport').scrollTop"));
console.log('PASS: continuous scrolling retains fractional movement at 5/22/60 px/s; loading and whole-page guards.');

import assert from 'node:assert/strict';
import {transposeChord,isChord,renderText,listSongs,safeSong} from '../public/core.js';
for(const chord of ['C','Am','G/B','F#m7','Bbmaj7','C7M','Dm7(b5)','G7(9)','A7(#5)','Cadd9'])assert(isChord(chord),chord);
for(const word of ['Cada','Com','Cantar','Final','Refrão','<script>'])assert(!isChord(word),word);
assert.equal(transposeChord('G/B',2),'A/C#');assert.equal(transposeChord('Am',-2),'Gm');assert.equal(transposeChord('C',-1),'B');assert.equal(transposeChord('A7(#5)',2),'B7(#5)');assert.equal(transposeChord('F',1,true),'Gb');
assert(renderText('[Verso]\n[G]Minha [D]canção',2,'G').includes('>A<'));assert(renderText('G   D   Em',2).includes('A   E   F#m'));assert(renderText('<img src=x onerror=alert(1)>').includes('&lt;img'));assert(!renderText('<script>alert(1)</script>').includes('<script>'));assert(renderText('[Am7(b5)]',2).includes('Bm7(b5)'));assert(renderText('Cada',2).includes('Cada'));
const songs=[{id:'b',title:'Zebra',artist:'João',tags:'Bossa',favorite:true},{id:'a',title:'Água',artist:'Outro',tags:'Pop',favorite:false}];const sets=[{id:'gig',songIds:['b','a']}];assert.deepEqual(listSongs(songs,sets,'library').map(s=>s.id),['a','b']);assert.deepEqual(listSongs(songs,sets,'gig').map(s=>s.id),['b','a']);assert.equal(listSongs(songs,sets,'library','joao')[0].id,'b');assert.equal(listSongs(songs,sets,'favorites').length,1);assert.throws(()=>safeSong({id:'x',title:'',type:'text'}));assert.throws(()=>safeSong({id:'x',title:'Y',type:'exe'}));assert.equal(safeSong({id:'x',title:'Y',type:'text',fontSize:100}).fontSize,52);
console.log('PASS: chord transposition, slash bass, accidentals, chord/lyric distinction, HTML escaping, setlist order, accent-insensitive search and backup validation.');

const {fitPageScale,boundedPage}=await import('../public/core.js');
for(const [pw,ph] of [[595,842],[842,595],[500,2000]])for(const [w,h] of [[700,900],[900,400],[280,350]]){const scale=fitPageScale(pw,ph,w,h);assert(pw*scale<=w+1e-8);assert(ph*scale<=h+1e-8);assert(Math.abs(pw*scale-w)<1e-8||Math.abs(ph*scale-h)<1e-8)}
assert.equal(boundedPage(1,-1,4),1);assert.equal(boundedPage(4,1,4),4);let page=1;for(let i=0;i<3;i++)page=boundedPage(page,1,4);assert.equal(page,4);page=boundedPage(page,-1,4);assert.equal(page,3);
assert.equal(safeSong({id:'pdf-mode',title:'PDF',type:'pdf',readingMode:'page'}).readingMode,'page');
console.log('PASS: whole-page fitting in both orientations, four-page navigation boundaries, and backup reading mode.');

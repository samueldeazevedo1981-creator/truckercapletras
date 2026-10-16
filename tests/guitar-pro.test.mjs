import fs from 'node:fs';import assert from 'node:assert/strict';
import {parseGuitarProBytes,readGuitarPro,renderGuitarProSvg,GP_EXTENSIONS,MAX_GP_BYTES} from '../public/guitar-pro.js';
import {safeSong} from '../public/core.js';
const bytes=new Uint8Array(fs.readFileSync(new URL('../examples/EXERCICIO_TESTE_GUITAR_PRO.gp',import.meta.url)));
assert.equal(String.fromCharCode(...bytes.slice(0,2)),'PK');const score=parseGuitarProBytes(bytes);assert(score.title.includes('Exercicio'));assert.equal(score.tracks.length,1);assert.equal(score.masterBars.length,4);
for(const profile of [1,2,3]){const pages=renderGuitarProSvg(score,{profile,width:600});assert(pages.length>0);assert(pages.every(p=>p.svg.startsWith('<svg')));assert(pages.some(p=>p.svg.includes('class="at"')))}
score.title='<script>alert(1)</script>';const malicious=renderGuitarProSvg(score).map(p=>p.svg).join('');assert(!malicious.includes('<script>'));assert(malicious.includes('&lt;script&gt;'));
const oldError=console.error,oldWarn=console.warn;try{console.error=()=>{};console.warn=()=>{};assert.throws(()=>parseGuitarProBytes(new TextEncoder().encode('invalid guitar pro')));await assert.rejects(readGuitarPro(new Blob(['invalid'])),/Não foi possível ler/);}finally{console.error=oldError;console.warn=oldWarn;}await assert.rejects(readGuitarPro({size:MAX_GP_BYTES+1}),/10 MB/);
for(const extension of ['.gp','.GP','.gp3','.gp4','.gp5','.gpx'])assert(GP_EXTENSIONS.test('arquivo'+extension));assert(!GP_EXTENSIONS.test('arquivo.pdf'));
const song=safeSong({id:'gp-test',title:'Teste',type:'guitarpro',gpTrack:2,gpProfile:3});assert.equal(song.gpTrack,2);assert.equal(song.gpProfile,3);assert.equal(safeSong({id:'text',title:'Texto',type:'text'}).type,'text');assert.equal(safeSong({id:'pdf',title:'PDF',type:'pdf'}).type,'pdf');
const base64=Buffer.from(bytes).toString('base64');const blob=new Blob([Buffer.from(base64,'base64')]);assert.equal((await readGuitarPro(blob)).masterBars.length,4);
console.log('PASS: actual .gp ZIP parsing, notes/tracks/bars, three notation profiles, SVG generation, escaped score text, invalid/oversized inputs and backup byte round-trip.');

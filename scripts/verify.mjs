import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),pub=path.join(root,'public');
const html=fs.readFileSync(path.join(pub,'index.html'),'utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'IDs duplicados.');
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(m[1]==='./')continue;assert(!/^https?:\/\//i.test(m[1]),'Dependência externa: '+m[1]);assert(fs.existsSync(path.join(pub,m[1])),'Arquivo ausente: '+m[1]);}
for(const name of ['app.js','core.js','local-library.js','pedal.js','offline.js','compat.js','sw.js','app.css','manifest.json','vendor/pdf.min.mjs','vendor/pdf.worker.min.mjs','vendor/PDFJS-LICENSE.txt'])assert(fs.existsSync(path.join(pub,name)),'Arquivo obrigatório ausente: '+name);
const manifest=JSON.parse(fs.readFileSync(path.join(pub,'manifest.json')));for(const icon of manifest.icons){const data=fs.readFileSync(path.join(pub,icon.src));assert.equal(data.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(icon.sizes,data.readUInt32BE(16)+'x'+data.readUInt32BE(20));}
const sw=fs.readFileSync(path.join(pub,'sw.js'),'utf8');const core=sw.match(/const CORE=\[([^\]]+)\]/)?.[1];assert(core);for(const m of core.matchAll(/'([^']+)'/g))assert(fs.existsSync(path.resolve(pub,m[1])),'Recurso off-line ausente: '+m[1]);const version=sw.match(/const VERSION='([^']+)'/)?.[1];assert(fs.readFileSync(path.join(pub,'offline.js'),'utf8').includes("'"+version+"'"));
const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json')));assert.equal(config.outputDirectory,'public');assert.equal(config.framework,null);
assert(!fs.existsSync(path.join(pub,'catalog')),'Este pacote não deve incluir acervo.');
console.log('OK — arquivos, ícones, cache off-line e configuração Vercel conferidos.');

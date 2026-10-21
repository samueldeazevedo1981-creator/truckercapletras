const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 const ctx=vm.createContext({});vm.runInContext('Promise.withResolvers=undefined',ctx);vm.runInContext(fs.readFileSync('public/compat.js','utf8'),ctx);assert.equal(await vm.runInContext('(()=>{const d=Promise.withResolvers();d.resolve(42);return d.promise})()',ctx),42);
 const source=fs.readFileSync('public/app.js','utf8');const code=source.slice(source.indexOf('function fullscreenElement()'),source.indexOf('async function stageMode('));
 const doc={documentElement:{}};const c=vm.createContext({document:doc});vm.runInContext(code,c);await vm.runInContext('enterFullscreen()',c);await vm.runInContext('exitFullscreen()',c);
 let entered=0,exited=0;doc.documentElement.webkitRequestFullscreen=function(){assert.equal(this,doc.documentElement);entered++};doc.webkitExitFullscreen=function(){assert.equal(this,doc);exited++};await vm.runInContext('enterFullscreen()',c);await vm.runInContext('exitFullscreen()',c);assert.equal(entered,1);assert.equal(exited,1);
 doc.documentElement.requestFullscreen=()=>Promise.reject(Error('NotAllowedError'));await vm.runInContext('enterFullscreen()',c);
 const worker=fs.readFileSync('public/vendor/pdf.worker.min.mjs','utf8');assert(worker.startsWith(fs.readFileSync('public/compat.js','utf8')));
 console.log('PASS: Safari Promise fallback; independent PDF worker shim; missing, rejected and prefixed fullscreen APIs.');
})().catch(e=>{console.error(e);process.exitCode=1});

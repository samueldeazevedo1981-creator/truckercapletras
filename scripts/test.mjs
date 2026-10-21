import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const test of ['apple.test.cjs','quick-controls.test.cjs','guitar-pro.test.mjs','touch.test.cjs','scroll.test.cjs','core.test.mjs','pedal.test.mjs','offline.test.cjs']){const r=spawnSync(process.execPath,[path.join(root,'tests',test)],{cwd:root,stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1)}console.log('OK — todos os testes automatizados passaram.');

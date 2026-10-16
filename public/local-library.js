// Preserves documents already downloaded by an earlier version, without shipping or downloading a catalogue.
export class LocalLibrary {
 constructor(db){this.db=db;this.index=[];this.manifest={version:'local-only',genres:{}}}
 read(store,key){return new Promise((resolve,reject)=>{const r=this.db.transaction(store).objectStore(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
 async initialize(){const saved=await this.read('settings','catalog-index');if(!Array.isArray(saved?.songs))return this;const keys=await new Promise((resolve,reject)=>{const r=this.db.transaction('catalog').objectStore('catalog').getAllKeys();r.onsuccess=()=>resolve(new Set(r.result));r.onerror=()=>reject(r.error)});this.index=saved.songs.filter(s=>keys.has(s.id));this.manifest.version=saved.version||'local-only';for(const song of this.index)this.manifest.genres[song.genre||'Outros']=1;return this}
 async getSong(meta){const record=await this.read('catalog',meta.id);if(!record)throw Error('Documento não está neste aparelho. Importe o arquivo TXT ou PDF novamente.');return record}
}

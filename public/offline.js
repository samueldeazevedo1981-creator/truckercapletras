const VERSION='letras-v1.6-all-formats-pages';
const timeout=(promise,ms,message)=>{let timer;return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(message)),ms)})]).finally(()=>clearTimeout(timer))};
function askWorker(worker){return new Promise((resolve,reject)=>{const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(Error('O navegador ainda não confirmou o modo off-line.'))},8000);channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data)};worker.postMessage({type:'OFFLINE_STATUS'},[channel.port2])})}
export async function prepareOffline(element){
 const show=(text,error=false)=>{element.textContent=text;element.classList.toggle('error',error);element.title=text};
 try{
  if(!window.isSecureContext||!('serviceWorker' in navigator))throw Error('Use o app por HTTPS para preparar o off-line.');
  // Register before waiting on network updates. A previously installed worker can confirm offline readiness immediately.
  let reg=await navigator.serviceWorker.getRegistration('./');
  if(navigator.serviceWorker.controller){try{const status=await askWorker(navigator.serviceWorker.controller);if(status.ready&&status.version===VERSION){show('✓ Pronto para uso off-line');navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>{});return}}catch{}}
  show('Preparando off-line…');
  reg=await timeout(navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}),30000,'Conecte à internet para concluir a instalação.');
  const pending=reg.installing||reg.waiting;
  if(pending&&pending.state!=='activated')await timeout(new Promise((resolve,reject)=>{const check=()=>{if(pending.state==='activated'){pending.removeEventListener('statechange',check);resolve()}else if(pending.state==='redundant'){pending.removeEventListener('statechange',check);reject(Error('Falha ao baixar o aplicativo. Conecte e tente novamente.'))}};pending.addEventListener('statechange',check);check()}),45000,'A preparação demorou. Mantenha a internet e reabra o app.');
  await timeout(navigator.serviceWorker.ready,15000,'A instalação ainda não foi concluída.');
  if(!navigator.serviceWorker.controller)await timeout(new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})),10000,'Feche e reabra o app conectado para concluir.');
  const status=await askWorker(navigator.serviceWorker.controller);
  if(!status.ready||status.version!==VERSION)throw Error('Arquivos off-line incompletos. Conecte e reabra o app.');
  show('✓ Pronto para uso off-line');
 }catch(err){show('Off-line não confirmado',true);element.title=err.message;console.warn('Trucker Cap Letras:',err.message);}
}

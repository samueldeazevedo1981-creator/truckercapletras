// PDF.js uses this standard API; preserve the native implementation when present.
if(typeof Promise.withResolvers!=='function'){
 Promise.withResolvers=function(){var resolve,reject;var promise=new this(function(a,b){resolve=a;reject=b});return {promise:promise,resolve:resolve,reject:reject}};
}

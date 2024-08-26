function onWorkerReady(){
   console.log('Worker is ready');
}

console.log('init');

navigator.serviceWorker.register('worker.js')
navigator.serviceWorker.ready.then(onWorkerReady)

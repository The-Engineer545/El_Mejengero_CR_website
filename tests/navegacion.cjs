const {JSDOM}=require('jsdom');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname, '..');
const data=JSON.parse(fs.readFileSync(root+'/data/productos.json'));
const windows=[]; let checks=0;
function check(value,msg){assert.ok(value,msg);checks++;}
async function page(url,storage=null,failure=null){
 const file=url.split('?')[0];
 const dom=new JSDOM(fs.readFileSync(root+'/'+file,'utf8'),{url:'http://localhost:5500/'+url,runScripts:'outside-only'});
 const w=dom.window; windows.push(w); const errors=[];
 w.addEventListener('error',e=>errors.push(e.error));
 w.console.error=()=>{};w.console.warn=()=>{};
 if(storage!==null)w.localStorage.setItem('carrito_elmejenguero',storage);
 w.fetch=async()=>{if(failure==='network')throw Error('offline');return {ok:failure!=='http',json:async()=>{if(failure==='json')throw Error('invalid json');return data}}};
 w.open=(...args)=>w.opened=args;
 const scripts=[...w.document.querySelectorAll('script[src]')].map(s=>s.getAttribute('src')).filter(s=>s.startsWith('js/'));
 w.eval(scripts.map(s=>fs.readFileSync(root+'/'+s,'utf8')).join('\n'));
 await new Promise(r=>setImmediate(r));
 check(errors.length===0,`startup errors ${url}: ${errors}`);
 const ids=[...w.document.querySelectorAll('[id]')].map(e=>e.id);
 check(new Set(ids).size===ids.length,'duplicate ids '+url);
 check(!w.document.querySelector('#modalProducto'),'old modal removed');
 return w;
}
const $=(w,s)=>w.document.querySelector(s);
const cart=w=>JSON.parse(w.localStorage.getItem('carrito_elmejenguero'));
(async()=>{
 const home=await page('index.html');
 check(home.document.querySelectorAll('article').length===4,'four featured');
 check($(home,'main a').getAttribute('href')==='catalogo.html','hero catalog link');
 const catalog=await page('catalogo.html');
 check(catalog.document.querySelectorAll('article').length===10,'all products');
 check($(catalog,'#talla-1').disabled,'missing sizes safely disabled');
 $(catalog,'[data-categoria="clubes"]').click();
 check(catalog.document.querySelectorAll('article').length===4,'case insensitive category');
 $(catalog,'#buscadorProductos').value='Barcelona';
 $(catalog,'#buscadorProductos').dispatchEvent(new catalog.Event('input'));
 check(catalog.document.querySelectorAll('article').length===1,'search and category combined');
 check(catalog.location.search==='?categoria=clubes&q=Barcelona','filters in URL');
 const link=$(catalog,'article a').getAttribute('href');
 check(link.includes('id=3')&&link.includes('q=Barcelona'),'detail retains filters');
 const detail=await page(link);
 check(!$(detail,'#detalleProducto').classList.contains('hidden'),'detail visible');
 check($(detail,'#productoTitulo').textContent==='FC Barcelona','correct product');
 check($(detail,'#productoImagen').alt==='FC Barcelona','image alt');
 $(detail,'#productoTalla').value='M';$(detail,'#productoBtnAgregar').click();
 check(cart(detail)[0].talla==='M'&&cart(detail)[0].cantidad===1,'detail add size M');
 const back=$(detail,'#volverCatalogo').getAttribute('href');
 check(back==='catalogo.html?categoria=clubes&q=Barcelona','back URL');
 const returned=await page(back,detail.localStorage.getItem('carrito_elmejenguero'));
 check(returned.document.querySelectorAll('article').length===1,'filters after return');
 check($(returned,'#buscadorProductos').value==='Barcelona','search restored');
 $(returned,'#btnCarrito').click();
 check($(returned,'#carrito-items').textContent.includes('FC Barcelona'),'cart shared across pages');
 $(returned,'#talla-3').value='M';$(returned,'article button').click();
 check(cart(returned)[0].cantidad===2,'merge same product and size');
 $(returned,'#talla-3').value='L';$(returned,'article button').click();
 check(cart(returned).length===2,'different sizes distinct');
 // Restored document from browser cache must re-read storage.
 home.localStorage.setItem('carrito_elmejenguero',returned.localStorage.getItem('carrito_elmejenguero'));
 home.dispatchEvent(new home.PageTransitionEvent('pageshow',{persisted:true}));
 check($(home,'#contadorCarrito').innerText===3,'pageshow refresh');
 home.localStorage.removeItem('carrito_elmejenguero');home.dispatchEvent(new home.StorageEvent('storage',{key:'carrito_elmejenguero'}));
 check($(home,'#contadorCarrito').style.display==='none','storage event refresh');
 $(returned,'#btnCarrito').click();$(returned,'#btnCheckout').click();
 $(returned,'#inputNombre').value=' ';$(returned,'#inputCedula').value='123456789';$(returned,'#inputTelefono').value='88888888';
 $(returned,'#formCheckout').dispatchEvent(new returned.Event('submit',{cancelable:true}));
 check(!returned.opened&&$(returned,'#errorNombre').textContent.length>0,'blank name blocked');
 $(returned,'#inputNombre').value='Prueba';$(returned,'#formCheckout').dispatchEvent(new returned.Event('submit',{cancelable:true}));
 check(returned.opened[0].startsWith('https://wa.me/50663425133'),'checkout URL mocked');
 check(cart(returned).length===2,'checkout retains cart');
 for(const id of ['','0','-1','abc','999','3.2']){
  const bad=await page('producto.html'+(id?'?id='+id:''));
  check($(bad,'#estadoProducto').textContent.includes('no encontrado'),'invalid ID '+id);
  check($(bad,'#detalleProducto').classList.contains('hidden'),'invalid detail hidden');
 }
 const missing=await page('producto.html?id=1');
 check($(missing,'#productoBtnAgregar').disabled&&$(missing,'#productoTalla').disabled,'missing detail sizes');
 for(const file of ['index.html','catalogo.html','producto.html?id=3']){
  for(const failure of ['http','json','network']){
   const failed=await page(file,null,failure);
   check($(failed,'[role="alert"]').textContent.includes('No pudimos'),'visible fetch error '+file+' '+failure);
   $(failed,'#btnCarrito').click();check(!$(failed,'#carrito').classList.contains('hidden'),'cart works without catalog');
  }
 }
 for(const stored of ['oops','{}','[null,{},1]']){
  const bad=await page('catalogo.html',stored);check(bad.document.querySelectorAll('article').length===10,'corrupted cart tolerated');
 }
 const empty=await page('catalogo.html?q=zzzz');check($(empty,'#productos-grid').textContent.includes('No encontramos'),'empty search');
 const safe=await page('producto.html?id=3&categoria=invalid&q=%3Cscript%3E');
 check($(safe,'#volverCatalogo').getAttribute('href')==='catalogo.html?q=%3Cscript%3E','safe encoded query and category fallback');
 console.log(`${checks} comprobaciones correctas (DOM simulado; WhatsApp no enviado).`);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>windows.forEach(w=>w.close()));

const CACHE_STATIC_NAME = 'site-static'
const CACHE_DYNAMIC_NAME = 'site-dynamic'
const CACHE_INMUTABLE_NAME = 'inmutable'

const OFFLINE = '/offline.html'

const assets = [
  '/',
  '/index.html',
  '/offline.html',
  '/Icono.png',
  
  '/css/bulma-0.9.3.min.css',
  '/css/styles.css',
  '/css/glider-js-1.7.7.min.css',

  '/js/app.js',
  '/js/glider-js-1.7.7.min.js',

  '/pages/contacto.html',
  '/pages/especialidades.html',
  '/pages/nosotros.html',
  '/pages/nuevo_ingreso.html',
  '/pages/ubicacion.html',

  '/assets/carousel/1.jpg',
  '/assets/carousel/2.jpg',
  '/assets/carousel/3.jpg',
  '/assets/carousel/4.jpg',
  '/assets/carousel/5.jpg',

  '/assets/iconos/especialidades/alimentos.png',
  '/assets/iconos/especialidades/conta.png',
  '/assets/iconos/especialidades/mecanica.png',
  '/assets/iconos/especialidades/progra.png',

  '/assets/admision.jpg',
  '/assets/croquis_cetis.png',
  '/assets/Desfile_20_nov_2019.jpeg',
  '/assets/examen_unico.png',
  '/assets/EXAMEN_UNICO_2022-2023.jpg',
  '/assets/logos_responsive.png',
  '/assets/mapache.jpeg',
  '/assets/Proceso_2022.png',

]

const assetsInmutables = [
  'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js',
  'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4226.204019952943!2d-100.6186913192715!3d20.46386896515811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d34b4b8f180fb5%3A0xdf7323353c29dcc7!2sCETis%20150!5e0!3m2!1ses-419!2smx!4v1650783581371!5m2!1ses-419!2smx',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3528.28400914612!2d-100.61855570396784!3d20.46164060450954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d34b4b8f180fb5%3A0xdf7323353c29dcc7!2sCETis%20150!5e0!3m2!1ses!2smx!4v1650847610852!5m2!1ses!2smx'
]

self.addEventListener('install', e => {

  const cacheProm = caches.open( CACHE_STATIC_NAME )
      .then(cache => {
        return cache.addAll(assets)
          .then(() => self.skipWaiting())
      })
      .catch( err => console.log('Falló registro de cache', err) );

  const cacheInmutable = caches.open( CACHE_INMUTABLE_NAME )
      .then( cache => {
        return cache.addAll(assetsInmutables)
          .then(() => self.skipWaiting())
      })
      .catch( err => console.log('Falló registro de cache', err) );

  e.waitUntil(Promise.all([cacheProm, cacheInmutable]))

})

// una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  console.log("Service worker activated");

  const activateSW = caches.keys()
    .then(keys => {
      return Promise.all(keys).filter(key => key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME)
      .map(key => caches.delete(key));
    });

  e.waitUntil( activateSW );

});

self.addEventListener('fetch', e => {

  const respuesta = caches.match(e.request)
  .then(res => {
    if ( res ) return res;
    //No existe el archivo
    //tengo que ir a la web
    console.log('No existe', e.request.url);

    return fetch( e.request )
    .then( newResp => {
      caches.open(CACHE_DYNAMIC_NAME)
      .then( cache => {
        cache.put( e.request, newResp )
      });

      return newResp.clone();
    });
    
  }).catch(() => caches.match(OFFLINE))

  e.respondWith( respuesta );
  // 
})
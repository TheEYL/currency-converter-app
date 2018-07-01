const STORE = "curr";
const DB= "curry-store";
const dbPromise = idb.open(DB, 1, function(db) {
   if ( !db.objectStoreNames.contains(STORE)) {
     db.createObjectStore(STORE);
   }
});


function writeData(data, key) {
return  dbPromise
                .then(function(db) {
                  var tx = db.transaction(STORE, 'readwrite');
                  var store = tx.objectStore(STORE);
                  store.put(data[key],key);
                  return tx.complete;
                }).then(function() {
                  // console.log(`Added,h`);
                });
}

function readData(key) {
  return dbPromise
  .then(function(db) {
    var tx = db.transaction(STORE, 'readonly')
     var store = tx.objectStore(STORE);
     return store.get(key);
  })
}

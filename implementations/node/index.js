
var express = require('express');
var loki = require('lokijs');
var bittorrentDHT = require('bittorrent-dht');
var magnet = require('magnet-uri');

var wellKnown = '/.well-known/identity';
var ownerID = 'dan.id'; // somehow securely init containers with a target ID


var app = express();
var db = new loki('identity.json', {
  autosave: true
});

var uri = 'magnet:?xt=urn:btih:identity.' + ownerID;
var parsed = magnet(uri);
var dht = new bittorrentDHT();

dht.listen(20000, function () {
  console.log('now listening');
})

dht.on('peer', function (peer, infoHash, from) {
  console.log(parsed.infoHash == infoHash);
  console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
});

dht.lookup(parsed.infoHash, function(error, ){})


function getCollection(name){
  return db.getCollection(name) || db.addCollection(name)
}

function verifyIdentity(id, request, resolve, reject){
  resolve(true);
}

var data = getCollection('data');
var permissions = getCollection('permissions');
var connections = getCollection('connections');
var profile = data.findOne({ did: 'dan.id' });

app.get(wellKnown + '/profile', function (req, res) {
  console.log('GET /profile');
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(profile || null));
});

app.post(wellKnown + '/profile', (req, res) => {
  console.log('POST /profile');
  new Promise((resolve, reject) => {
    // Verify identity owner
    verifyIdentity(ownerID, req, resolve, reject);
  }).then((payload) => {
    console.log('UPDATED PROFILE');
    // data.update(profile)
  })
});

app.get(wellKnown + '/permissions', (req, res) => {
  res.send('Print the permissions!');
});

app.get(wellKnown + '/stores', (req, res) => {
  res.send('Print the stores!');
});

app.get(wellKnown + '/data/:schema/:type', (req, res) => {
  var type = req.params.type;
  var schema = req.params.type;
  console.log(type, schema);
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    links: {
      self: wellKnown + '/data/' + type
    },
    data: data.by('@type', type) || []
  }));
});

app.listen(1337, '127.0.0.1');


console.log('Server running at http://127.0.0.1:1337/');

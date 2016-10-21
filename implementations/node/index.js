
var express = require('express');
var loki = require('lokijs');

var app = express();
var db = new loki('identity.json', {
  autosave: true
});

var wellKnown = '/.well-known/identity';
var ownerID = 'dan.id'; // figure out how to securely initalize
                        // the container with the owner's ID

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

app.get(wellKnown + '/connections', (req, res) => {
  res.send('Print the connections!');
});

app.get(wellKnown + '/data/:type', (req, res) => {
  var type = req.params.type;
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

var config = require('../config/config')
  , MySQL  = require('mysql')

exports.getDB = (function() {
  var servers = {}

  return function getDB(host, cb) {
    var db

    if (!(host in config.hosts)) {
      cb(new Error(
          'jebús the host "'+ host +'" does not exist in my configuration!')
        , null
      )

      return
    }

    servers[host] = db = servers[host] || new MySQL.Client(config.hosts[host])

    if (db.connected) {
      cb(null, db)
    }
    else {
      console.log('Trying to connect to %s:%d', db.host, db.port)
      db.connect(connect)
    }

    function connect(err) {
      if (err) {
        console.log('Can not connect to %s:%d'
          , db.host
          , db.port
        )

        db.end()

        // this might be dangerous! the connect method
        // adds the connection to the queue, so we have to clear
        // it before we try to reconnect...
        // TODO: maybe patch Client.prototype.connect to use _prequeue instead of enqueue!
        db._queue = []
      }
      else {
        console.log('Successfully connected node-myadmin to %s:%d'
          , db.host
          , db.port
        )
      }

      cb(err, db)
    }
  }
})()

exports.validDB = validDB
function validDB(host, database) {
  var databases = []

  for (var i in config.hosts) {
    if (config.hosts[i].host === host) {
      databases = config.hosts[i].databases; break
    }
  }

  return !databases.length || databases.indexOf(database) >= 0
}

exports.useDatabase = useDatabase
function useDatabase(client, callback) {
  if (!validDB(client.host, client.database)) {
    callback(new Error('You are not allowed to access '+ client.database))

    return
  }

  client.useDatabase(client.database, callback)
}

var config = require('../config/config')
  , MySQL  = require('mysql')

exports.getDB = function getDB(host, cb) {
  var db

  if (!(host in config.hosts)) {
    cb(new Error(
        'jebús the host "'+ host +'" does not exist in my configuration!')
      , null
    )

    return
  }

  db = new MySQL.Client(config.hosts[host])

  db.on('error', function(err) { cb(err, db) })

  db.connect(connect)

  function connect(err) {
    if (err) {
      console.log('Can not connect to %s:%d'
        , db.host
        , db.port
      )

      db.end()
    }

    cb(err, db)
  }
}

exports.validDB = validDB
function validDB(host, database) {
  var databases = []

  for (var i in config.hosts) {
    if (config.hosts[i].host === host) {
      databases = config.hosts[i].databases || []; break
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

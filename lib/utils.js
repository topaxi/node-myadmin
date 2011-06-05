var config = require('../config/config')
  , DB     = require('./db/DB')

exports.getDB = (function() {
  var servers = {}

  return function getDB(host, cb) {
    if (!(host in config.hosts)) {
      cb(new Error(
          'jebús the host "'+ host +'" does not exist in my configuration!')
        , null
      )
    }

    if (!(host in servers)) {
      servers[host] = new DB(config.hosts[host], cb)
    }
    else {
      cb(null, servers[host])
    }
  }
})()

exports.validDB = validDB
function validDB(host, database){
  var databases = []

  for(var i in config.hosts){
    if(config.hosts[i].host === host) {
      databases = config.hosts[i].databases; break
    }
  }

  return !databases.length || databases.indexOf(database) >= 0
}

exports.useDatabase = useDatabase
function useDatabase(client, callback){
  if(!validDB(client.host, client.database)){
    callback(new Error('You are not allowed to access '+ client.database))

    return
  }

  client.useDatabase(client.database, callback)
}

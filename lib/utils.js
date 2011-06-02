var config = require('../config/config')

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

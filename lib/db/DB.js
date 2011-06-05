var Client = new require('mysql').Client

module.exports = function(config){
  var client = new Client()

  client.host     = config.host
  client.port     = config.port
  //client.database = config.database
  client.user     = config.user
  client.password = config.password
  client.typeCast = config.typeCast
  client.debug    = config.debug

  return client
}

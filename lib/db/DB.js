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

  client.connect(connect)

  return client

  function connect(err) {
    if (err) {
      console.log('Can not connect to %s:%d\n%s'
        , client.host
        , client.port
        , err
      )
      client.end()

      // this might be dangerous! the connect method
      // adds the connection to the queue, so we have to clear
      // it before we try to reconnect...
      client._queue = []

      setTimeout(function(){
        client.connect(connect)
      }, 5*1000)
    }
    else {
      console.log('Successfully connected node-myadmin to %s:%d'
        , client.host
        , client.port
      )
    }
  }
}

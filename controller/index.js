module.exports = function(app){
  app.server.get('/', function(req, res){
    var locals = {
          'title':   'node-myadmin'
        , 'content': 'Hosts:'
      }

    locals.hosts = []
    for(var host in app.config.hosts){
      locals.hosts.push(host)
    }

    res.render('index', {'locals': locals})
  })
}

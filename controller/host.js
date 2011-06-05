module.exports = function(app){
  app.server.get('/:host', function(req, res){
    var host   = req.params.host
      , hosts  = app.config.hosts
      , locals = {
          'title':   'node-myadmin:'+ host
        , 'content': 'Databases:'
      }


    req.db.query('show databases', function(err, result){
      if(err) throw err

      locals.databases = []
      for(var row in result){
        var database = result[row].Database

        if(app.utils.validDB(hosts[host].host, database)){
          locals.databases.push(database)
        }
      }

      res.render('host', {'locals': locals})
    })
  })
}

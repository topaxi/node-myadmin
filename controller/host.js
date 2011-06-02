module.exports = function(app){
  app.server.get('/:host', function(req, res){
    var host = req.params.host
      , locals = {
          'title':   'node-myadmin:'+ host
        , 'content': 'Databases:'
        , 'host':     host
        , 'database': undefined
        , 'table':    undefined
      }

    app.getDB(host).query('show databases', function(err, result){
      if(err) throw err

      locals.databases = []
      for(var row in result){
        locals.databases.push(result[row].Database)
      }

      res.render('host', {'locals': locals})
    })
  })
}

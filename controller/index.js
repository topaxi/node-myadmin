module.exports = function(app){
  var db = app.db

  app.server.get('/', function(req, res){
    var locals = {
          'title':   'node-myadmin:'+ app.config.db.host
        , 'content': 'Databases:'
        , 'host':     app.config.db.host
        , 'database': undefined
        , 'table':    undefined
      }

    db.query('show databases', function(err, result){
      if(err) throw err

      locals.databases = []
      for(var row in result){
        locals.databases.push(result[row].Database)
      }

      res.render('index', {'locals': locals})
    })
  })
}

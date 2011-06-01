module.exports = function(app){
  var db = app.db

  app.server.get('/query/:database?/:table?', function(req, res) {
    db.database = req.params.database

    var locals = {
          'title':   'node-myadmin:'+ app.config.db.host +'/query'
        , 'host':     app.config.db.host
        , 'database': db.database
        , 'table':    req.params.table
      }

    db.query('show databases', function(err, result){
      if(err) throw err

      locals.databases = []
      for(var row in result){
        locals.databases.push(result[row].Database)
      }

      res.render('query', {'locals': locals})
    })
  })

  app.server.post('/query', function(req, res) {
    var parameters = JSON.parse('['+ req.body.parameters.trim() +']')

    db.useDatabase(req.body.database, function(err) {
      if (err) {
        send(err, null)
      }
      else {
        try {
          // db.query is async, parameter errors can (and should) be catched!
          db.query(req.body.query, parameters, send)
        }
        catch(e) {
          send(err, null)
        }
      }
    })

    function send(err, data) {
      res.send({'err': err, 'data': data})
    }
  })
}

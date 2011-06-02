module.exports = function(app){
  app.server.get('/:host/query/:database?/:table?', function(req, res) {
    var host     = req.params.host
      , db       = app.getDB(host)
      , database = req.params.database
      , locals = {
          'title':   'node-myadmin:'+ host +'/query'
        , 'host':     host
        , 'database': database
        , 'table':    req.params.table
      }

    db.database = database

    db.query('show databases', function(err, result){
      if(err) throw err

      locals.databases = []
      for(var row in result){
        locals.databases.push(result[row].Database)
      }

      res.render('query', {'locals': locals})
    })
  })

  app.server.post('/:host/query', function(req, res) {
    var parameters = JSON.parse('['+ req.body.parameters.trim() +']')
      , db         = app.getDB(req.params.host)

    db.useDatabase(req.body.database, function(err) {
      if (err) {
        send(err, null)
      }
      else {
        try {
          if (req.body.query.indexOf('?') < 0) parameters = []

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

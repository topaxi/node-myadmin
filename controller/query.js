module.exports = function(app){
  app.server.get('/:host/query/:database?/:table?', function(req, res) {
    var host     = req.params.host
      , hosts    = app.config.hosts
      , database = req.params.database
      , locals = {
          'title': 'node-myadmin:'+ host +'/query'
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

      res.render('query', {'locals': locals})
    })
  })

  app.server.post('/:host/query', function(req, res) {
    var parameters = JSON.parse('['+ req.body.parameters.trim() +']')

    app.utils.getDB(req.params.host, function(err, db) {
      db.database = req.body.database

      app.utils.useDatabase(db, function(err) {
        if (err) {
          send(err, null)
        }
        else {
          try {
            if (req.body.query.indexOf('?') < 0) parameters = []

            // db.query is async, parameter errors can (and should) be catched!
            var query = db.query(req.body.query, parameters, send)
          }
          catch(err) {
            send(err, null)
          }
        }

        function send(err, data) {
          res.send({'err': err, 'data': data, 'query': !query ? null : {
              'sql':      query.sql
            , 'typeCast': query.typeCast
            , 'fields':   query._fields
            , 'database': db.database
          }})
        }
      })
    })
  })
}

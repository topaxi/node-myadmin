module.exports = function(app) {
  app.server.get('/:host/query/:database?/:table?', function(req, res, next) {
    var host     = req.params.host
      , hosts    = app.config.hosts
      , database = req.params.database
      , locals = {
          'title': 'node-myadmin:'+ host +'/query'
      }

    req.db.query('show databases', function(err, result) {
      if (err) return next(err)

      locals.databases = []
      for (var row in result) {
        var database = result[row].Database

        if (app.utils.validDB(hosts[host].host, database)) {
          locals.databases.push(database)
        }
      }

      res.render('query', {'locals': locals})
    })
  })

  app.server.post('/:host/query', function(req, res) {
    var parameters = req.body.parameters || ''
      , query

    parameters = JSON.parse('['+ parameters.trim() +']')

    if (~req.body.query.indexOf('?')) parameters = []

    if (req.body.database) {
      req.db.database = req.body.database

      app.utils.useDatabase(req.db, sendQuery)
    }
    else {
      sendQuery()
    }

    function sendQuery(err) {
      if (err) return send(err, null)

      try {
        // db.query is async, parameter errors can (and should) be catched!
        query = req.db.query(req.body.query, parameters, send)
      }
      catch (err) {
        send(err, null)
      }
    }

    function send(err, data, fields){
      res.send({'err': err, 'data': data, 'query': !query ? null : {
          'sql':      query.sql
        , 'typeCast': query.typeCast
        , 'fields':   fields
        , 'database': req.db.database
      }})
    }
  })
}

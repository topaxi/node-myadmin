module.exports = function(app) {

  app.server.get('/:host/getCharsets', function(req, res, next) {
    app.utils.getCharsets(req.db, function(err, data) {
      if (err) return next(err)

      res.send(data)
    })
  })

  app.server.get('/:host/create', function(req, res, next) {
    var locals = {
        'title': 'node-myadmin:'+ req.params.host +'/create'
    }

    app.utils.getCharsets(req.db, function(err, data) {
      if (err) return next(err)

      locals.charsets = data

      res.render('createDatabase', {'locals': locals})
    })
  })

  app.server.post('/:host/create', function(req, res, next) {
    var database  = req.body.name
      , collation = req.body.collation || 'utf8_general_ci'
      , charset   = /^(.*?)_/.exec(collation)[1]

    var query = req.db.query('CREATE DATABASE `'+ database +'` DEFAULT CHARACTER SET '+ charset +' COLLATE '+ collation, function(err, data) {
      if (err) return next(err)

      res.redirect('/'+ req.params.host +'/'+ database)
    })
  })

  app.server.get('/:host/:database', function(req, res, next) {
    var host     = req.params.host
      , database = req.params.database
      , locals   = {
        'title':   'node-myadmin:'+ host +'/'+ database
      , 'content': 'Tables of '+ database +':'
    }

    req.db.query('show tables', function(err, result) {
      if (err) return next(err)

      locals.tables = []
      for (var row in result) {
        locals.tables.push(result[row][firstIndexName(result[row])])
      }

      locals.database = database

      res.render('database', {'locals': locals})
    })
  })

  app.server.get('/:host/:database/drop', function(req, res, next) {
    var query = req.db.query('DROP DATABASE `'+ req.params.database +'`', function(err, data) {
      if (err) return next(err)

      res.redirect('/'+ req.params.host)
    })
  })
}

function firstIndexName(obj) {
  for (var i in obj) return i
}

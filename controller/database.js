module.exports = function(app) {

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

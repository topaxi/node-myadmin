module.exports = function(app) {

  app.server.get('/:host/:database/create', function(req, res, next) {
    var locals = {
        'title': 'node-myadmin:'+ req.params.host +'/'+ req.params.database +'/create'
    }

    app.utils.getCharsets(req.db, function(err, data) {
      if (err) return next(err)

      locals.charsets = data

      app.utils.getEngines(req.db, function(err, data) {
        if (err) return next(err)

        locals.engines = data

        res.render('createTable', {'locals': locals})
      })
    })
  })

  app.server.post('/:host/:database/create', function(req, res, next) {
    var table     = req.body.name
      , options = {'table':     table
                  ,'collation': req.body.collation
                  ,'engine':    req.body.engine
                  ,'fields':    req.body.fields
                  }

    app.utils.createTable(req.db, options, function(err) {
      if (err) return next(err)

      res.redirect('/'+ req.params.host +'/'+ req.params.database +'/'+ table)
    })
  })

  app.server.get('/:host/:database/:table', function(req, res, next) {
    var host     = req.params.host
      , table    = req.params.table
      , database = req.params.database
      , locals   = res.locals

    locals.title = 'node-myadmin:'+ host +'/'+ database +'/'+ table

    var query = req.db.query('describe '+ table, function(err, data) {
      if (err) return next(err)

      locals.fields = data

      res.render('table', {'locals': locals})
    })
  })

  app.server.get('/:host/:database/:table/drop', function(req, res, next) {
    var query = req.db.query('DROP TABLE `'+ req.params.table +'`', function(err, data) {
      if (err) return next(err)

      res.redirect('/'+ req.params.host +'/'+ req.params.database)
    })
  })

  app.server.get('/:host/:database/:table/truncate', function(req, res, next){
    var query = req.db.query('TRUNCATE TABLE `'+ req.params.table +'`', function(err, data){
      if (err) return next(err)

      res.redirect('/'+ req.params.host +'/query/'+ req.params.database +'/'+ req.params.table)
    })
  })
}

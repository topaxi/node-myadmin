module.exports = function(app) {

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

module.exports = function(app){
  app.server.get('/:host/:database/:table', function(req, res) {
    var host     = req.params.host
      , table    = req.params.table
      , database = req.params.database
      , locals   = {
          'title': 'node-myadmin:'+ host +'/'+ database +'/'+ table
      }

    req.db.query('describe '+ table, function(err, result) {
      if(err) throw err

      locals.fields = result

      res.render('table', {'locals': locals})
    })
  })
}

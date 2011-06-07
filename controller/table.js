module.exports = function(app){

  app.server.get('/:host/:database/:table', function(req, res){
    var host     = req.params.host
      , table    = req.params.table
      , database = req.params.database
      , locals   = res.locals

    locals.title = 'node-myadmin:'+ host +'/'+ database +'/'+ table

    var query = req.db.query('describe '+ table, function(err, data){
      if(err) throw err

      locals.fields = data

      res.render('table', {'locals': locals})
    })
  })

  app.server.get('/:host/:database/:table/drop', function(req, res){
    var query = req.db.query('DROP TABLE `'+ req.params.table +'`', function(err, data){
      if(err) throw err

      res.redirect('/'+ db.host +'/'+ db.database)
    })
  })

  app.server.get('/:host/:database/:table/truncate', function(req, res){
    var query = req.db.query('TRUNCATE TABLE `'+ req.params.table +'`', function(err, data){
      if(err) throw err

      res.redirect('/'+ req.params.host +'/query/'+ req.params.database +'/'+ req.params.table)
    })
  })
}

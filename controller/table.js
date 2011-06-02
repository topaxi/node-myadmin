module.exports = function(app){
  app.server.get('/:host/:database/:table', function(req, res) {
    var host     = req.params.host
      , db       = app.getDB(host)
      , table    = req.params.table
      , database = req.params.database
      , locals   = {
          'title':   'node-myadmin:'+ host +'/'+ database +'/'+ table
        , 'host':     host
        , 'database': database
        , 'table':    table
      }

    db.database = database

    describeTable(db, table, function(err, result) {
      if(err) throw err

      locals.fields = result

      res.render('table', {'locals': locals})
    })
  })
}

function describeTable(db, table, callback) {
  db.useDatabase(db.database, function(err) {
    if(!err) db.query('describe '+ table, callback)
  })
}

function firstIndexName(obj) {
  for(var i in obj) return i
}

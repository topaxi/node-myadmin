module.exports = function(app){
  var db = app.db

  app.server.get('/:database/:table', function(req, res) {
    db.database = req.params.database

    var table  = req.params.table
      , locals = {
          'title':   'node-myadmin:'+ app.config.db.host +'/'+ db.database +'/'+ table
        , 'host':     app.config.db.host
        , 'database': db.database
        , 'table':    table
      }

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

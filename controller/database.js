module.exports = function(app){
  var db = app.db

  app.server.get('/:database', function(req, res) {
    db.database = req.params.database

    var locals = {
        'title':   'node-myadmin:'+ app.config.db.host +'/'+ db.database
      , 'content': 'Tables of '+ db.database +':'
      , 'host':     app.config.db.host
      , 'table':    undefined
    }

    showTables(db, function(err, result) {
      if(err) throw err

      // TODO: Describe each table async through socket.io?
      locals.tables = []
      for(var row in result){
        locals.tables.push(result[row][firstIndexName(result[row])])
      }

      locals.database = db.database

      res.render('database', {'locals': locals})
    })
  })
}

function showTables(db, callback) {
  db.useDatabase(db.database, function(err) {
    if(!err) db.query('show tables', callback)
  })
}

function firstIndexName(obj) {
  for(var i in obj) return i
}

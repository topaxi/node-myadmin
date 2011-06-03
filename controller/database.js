var utils = require('../lib/utils.js')

module.exports = function(app){
  app.server.get('/:host/:database', function(req, res) {
    var host     = req.params.host
      , db       = app.utils.getDB(host)
      , database = req.params.database
      , locals   = {
        'title':   'node-myadmin:'+ host +'/'+ database
      , 'content': 'Tables of '+ database +':'
    }

    db.database = database

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
  utils.useDatabase(db, function(err) {
    if(err) throw err

    db.query('show tables', callback)
  })
}

function firstIndexName(obj) {
  for(var i in obj) return i
}

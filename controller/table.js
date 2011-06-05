var utils = require('../lib/utils.js')

module.exports = function(app){
  app.server.get('/:host/:database/:table', function(req, res) {
    var host     = req.params.host
      , table    = req.params.table
      , database = req.params.database
      , locals   = {
          'title': 'node-myadmin:'+ host +'/'+ database +'/'+ table
      }

    app.utils.getDB(host, function(err, db) {
      db.database = database

      describeTable(db, table, function(err, result) {
        if(err) throw err

        locals.fields = result

        res.render('table', {'locals': locals})
      })
    })
  })
}

function describeTable(db, table, callback) {
  utils.useDatabase(db, function(err) {
    if(err) throw err

    db.query('describe '+ table, callback)
  })
}

function firstIndexName(obj) {
  for(var i in obj) return i
}

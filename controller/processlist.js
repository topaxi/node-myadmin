module.exports = function(app) {
  app.server.get('/:host/:database?/processlist', function(req, res, next) {
    var host     = req.params.host
      , database = req.params.database
      , locals   = {
          'title': 'node-myadmin:'+ host + (database ? '/'+ database : '') +'/processlist'
      }

    res.render('processlist', {'locals': locals})
  })
}

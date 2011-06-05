module.exports = function(err, req, res, next) {
  var locals = {
      'title':    'node-myadmin'
    , 'host':     undefined
    , 'database': undefined
    , 'table':    undefined
    , 'error':    err
    , 'url':      req.originalUrl
  }

  res.render('error', {'locals': locals})
}

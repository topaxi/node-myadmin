module.exports = function(err, req, res, next) {
  if (res.finished) {
    console.log(err.stack)

    return
  }

  if (req.xhr) {
    res.send({'err': err, 'data': null})
  }
  else {
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
}

#!/usr/bin/env node

var app      = { 'path': __dirname }
  , express  = app.express  = require('express')
  , config   = app.config   = require(app.path +'/config/config')
  , stylus   = app.stylus   = require('stylus')
  , jade     = app.jade     = require('jade')
  , utils    = app.utils    = require(app.path +'/lib/utils')
  , server
;

server = app.server = !config.server.key || !config.server.cert
  ? express.createServer()
  : express.createServer({
      'key':  config.server.key
    , 'cert': config.server.cert
  })

server.configure('development', function(){
  server.use(stylus.middleware({
      'debug': true
    , 'src':   app.path +'/public'
  }))

  server.use(express.errorHandler({
      'dumpExceptions': true
    , 'showStack':      true
  }))
})

server.configure('production', function(){
  server.use(stylus.middleware({
      'debug': false
    , 'src':   app.path +'/public'
  }))

  server.use(express.errorHandler())
})

server.configure(function() {
  server.set('view engine', config.server.viewEngine)
  server.use(express.bodyParser())
  server.use(express.static(app.path +'/public'))
  server.dynamicHelpers({
      'scripts':  function()    { return ['/js/jquery.js', '/js/global.js'] }
    , 'host':     function(req) { return req.params && req.params.host }
    , 'database': function(req) { return req.params && req.params.database }
    , 'table':    function(req) { return req.params && req.params.table }
  })

  server.param('host', function(req, res, next, name) {
    utils.getDB(name, function(err, db) {
      req.db = db

      next(err)
    })
  })

  server.param('database', function(req, res, next, name) {
    req.db.database = name

    utils.useDatabase(req.db, next)
  })
})

// Controller to load jade templates to client
loadController('template')

loadController('index')
loadController('query')
loadController('host')
loadController('database')
loadController('table')

server.error(require(app.path +'/lib/error.js'))

server.listen(config.server.port)
console.log('node-myadmin listening on port %d', server.address().port)

function loadController(controller){
  return require(config.controller.path +'/'+ controller)(app)
}

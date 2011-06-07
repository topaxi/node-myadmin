#!/usr/bin/env node

var app      = { 'path': __dirname }
  , jade     = app.jade    = require('jade')
  , stylus   = app.stylus  = require('stylus')
  , express  = app.express = require('express')
  , utils    = app.utils   = require(app.path +'/lib/utils')
  , config   = app.config  = require(app.path +'/config/config')
  , server
;

app.server = server = !config.server.key || !config.server.cert
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
  var conf = config.server

  server.set('view engine', conf.viewEngine)
  server.use(express.bodyParser())

  if(conf.auth && conf.auth.login && conf.auth.password){
    server.use(express.basicAuth(conf.auth.login, conf.auth.password))
  }

  server.use(express.static(app.path +'/public'))
  server.dynamicHelpers({
      'scripts':  function()    { return ['/js/jquery.js', '/js/global.js'] }
    , 'host':     function(req) { return req.params && req.params.host      }
    , 'database': function(req) { return req.params && req.params.database  }
    , 'table':    function(req) { return req.params && req.params.table     }
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

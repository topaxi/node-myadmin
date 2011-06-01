#!/usr/bin/env node

var app     = { 'path': __dirname }
  , express = app.express = require('express')
  , config  = app.config  = require(app.path +'/config/config')
  , db      = app.db      = require(app.path +'/lib/db/DB')(config.db)
  , stylus  = app.stylus  = require('stylus')
  , jade    = app.jade    = require('jade')
  , server  = app.server  = express.createServer()
;

server.configure('development', function(){
  server.use(stylus.middleware({
      'debug':   true
    , 'src':     app.path +'/public'
  }))

  server.use(express.errorHandler({ 'dumpExceptions': true, 'showStack': true }))
})

server.configure('production', function(){
  server.use(stylus.middleware({
      'debug':   false
    , 'src':     app.path +'/public'
  }))

  server.use(express.errorHandler())
})

server.configure(function() {
  server.set('view engine', config.server.viewEngine)
  server.use(express.bodyParser())
  server.use(express.static(app.path +'/public'))
})

// Controller to load jade templates to client
loadController('template')

loadController('index')
loadController('query')
loadController('database')
loadController('table')


server.listen(config.server.port)
console.log('node-myadmin listening on port %d', server.address().port)

function loadController(controller){
	return require(config.controller.path +'/'+ controller)(app)
}

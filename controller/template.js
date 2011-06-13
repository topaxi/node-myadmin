var fs       = require('fs')
  , jade     = require('jade')
  , Parser   = jade.Parser
  , Compiler = jade.Compiler

module.exports = function(app) {
  app.server.get('/template/:template', function(req, res, next) {
    var file = app.path +'/views/'+ req.params.template +'.jade'

    fs.readFile(file, function(err, data) {
      if (err) return next(err)

      res.send(compile(data, {'filename': file, 'debug': false}).toString())
    })
  })
}

function compile(str, options) {
  var fn = [
      'try{'
    , parse(String(str), options || {})
    , '}catch(_){if(console)console.log(_)}'
  ].join('\n')

  return new Function('locals', fn)
}

// The following methods are copied and modified from jade.js
function parse(str, options) {
  var filename = options.filename
    , utils    = require('jade').utils

  try {
    // Parse
    var parser = new Parser(str, filename)
    if(options.debug) parser.debug()

    // Compile
    var compiler = new (options.compiler || Compiler)(parser.parse(), options)
    compiler.line = function(){} // do not add line numbers here
    compiler.buffer = function(str, esc){
      var buf = this.buf

      if (esc) str = utils.escape(str)

      if (this.lastBufferedIndex == buf.length) {
        buf.pop()
        str = this.lastBufferedString + str
      }

      buf.push("buf.push('"+ str +"');")
      this.lastBufferedIndex  = buf.length
      this.lastBufferedString = str
    }
    var js = compiler.compile()

    // Debug compiler
    if (options.debug) {
      console.log('\n\x1b[1mCompiled Function\x1b[0m:\n\n%s', js.replace(/^/gm, ' '))
    }

    try {
      return ''
        + attrs.toString() +'\n'
        + escape.toString() +'\n'
        + 'var buf = [];\n'
        + (options.self
          ? 'var self = locals || {}, __ = __ || locals.__\n'+ js
          : 'with (locals || {}){'+ js +'}')
        + 'return buf.join("");'
    }
    catch (err) {
      process.compile(js, filename || 'Jade')

      return
    }
  }
  catch (err) {
    console.log(err)
  }
}

function attrs(obj) {
  var buf   = []
    , terse = obj.terse

  delete obj.terse

  var keys = Object.keys(obj)
    , len  = keys.length

  if (len) {
    buf.push('')

    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key]

      if (typeof val === 'boolean' || val === '' || val == null) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"')
        }
      }
      else {
        buf.push(key + '="' + escape(val) + '"')
      }
    }
  }

  return buf.join(' ')
}

function escape(html) {
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

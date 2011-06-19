var config = require('../config/config')
  , MySQL  = require('mysql')

exports.getDB = function getDB(host, cb) {
  var db

  if (!(host in config.hosts)) {
    cb(new Error(
        'jebús the host "'+ host +'" does not exist in my configuration!')
      , null
    )

    return
  }

  db = new MySQL.Client(config.hosts[host])

  db.on('error', function(err) { cb(err, db) })

  db.connect(connect)

  function connect(err) {
    if (err) {
      console.log('Can not connect to %s:%d'
        , db.host
        , db.port
      )

      db.end()
    }

    cb(err, db)
  }
}

exports.validDB = validDB
function validDB(host, database) {
  var databases = []

  for (var i in config.hosts) {
    if (config.hosts[i].host === host) {
      databases = config.hosts[i].databases || []; break
    }
  }

  return !databases.length || databases.indexOf(database) >= 0
}

exports.useDatabase = useDatabase
function useDatabase(client, callback) {
  if (!validDB(client.host, client.database)) {
    callback(new Error('You are not allowed to access '+ client.database))

    return
  }

  client.useDatabase(client.database, callback)
}

exports.getCharsets = getCharsets
function getCharsets(db, cb) {
  db.useDatabase('information_schema', function(err) {
    if (err) return cb(err, null)

    db.query('SELECT * FROM `CHARACTER_SETS` AS `cs` '
            +'JOIN `COLLATIONS` AS `c` '
            +'ON(`cs`.`CHARACTER_SET_NAME` = `c`.`CHARACTER_SET_NAME`) '
            +'ORDER BY `c`.`CHARACTER_SET_NAME` ASC'
                   +', `c`.`COLLATION_NAME` ASC', function(err, data) {
      if (err) return cb(err, null)

      var c = {}
        , row

      for (var i = 0; i < data.length; ++i) {
        row = data[i]

        if (!c[row.CHARACTER_SET_NAME]) c[row.CHARACTER_SET_NAME] = []

        c[row.CHARACTER_SET_NAME].push(row)
      }

      cb(null, c)
    })
  })
}

exports.getEngines = getEngines
function getEngines(db, cb) {
  db.query('SHOW ENGINES', function(err, data) {
    if (err) return cb(err, null)

    cb(null, data)
  })
}

exports.createTable = createTable
function createTable(db, options, cb) {
  var table     = options.table
    , collation = options.collation || 'utf8_general_ci'
    , charset   = /^(.*?)_/.exec(collation)[1]
    , engine    = options.engine
    , fields    = []
    , primary   = []

    toArray(options.fields).forEach(function(f, i) {
      var field = []

      field.push('`'+ f.name +'`')

      if (f.length) {
        f.type = f.type +'('+ f.length +')'
      }

      field.push(f.type)
      field.push(f.attributes.toUpperCase())

      field.push(f.null ? 'NULL' : 'NOT NULL')

      if (f.default) {
        switch (f.default) {
          case 'NULL':
          case 'CURRENT_TIMESTAMP':
          case 'NOW':
            break
          default:
            f.default = db.escape(f.default); break
        }

        field.push('DEFAULT '+ f.default)
      }

      if (f.auto_increment) field.push('AUTO_INCREMENT')

      if (f.index === 'PRIMARY') primary.push(field[0])
      if (f.index === 'UNIQUE')  field.push('UNIQUE')

      if (f.comment) field.push('COMMENT '+ db.escape(f.comment))

      fields.push(field.join(' '))
    })

    if (primary.length) fields.push('PRIMARY KEY ('+ primary.join(', ') +')')

    engine    = engine ? 'ENGINE = '+ engine : ''
    collation = charset && collation
      ? 'DEFAULT CHARACTER SET '+ charset +' COLLATE '+ collation
      : ''

    options = [collation, engine].join('\n')

    if (db.database) table = db.database +'`.`'+ table

    return db.query('CREATE TABLE `'+ table +'` (\n\t'+ fields.join(',\n\t') +'\n)\n'+ options, cb)
}

exports.toArray = toArray
function toArray(o) {
  var a = [], i

  for (i in o) a.push(o[i])

  return a
}

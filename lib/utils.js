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

    toArray(options.fields).forEach(function(field, i) {
      field.name = '`'+ field.name +'`'

      if (field.length) {
        field.type = field.type +'('+ field.length +')'
      }

      if (field.index === 'PRIMARY') primary.push(field.name)

      field.null    = field.null    ? 'NULL' : 'NOT NULL'
      field.default = field.default ? 'DEFAULT '+ db.escape(field.default) : ''
      field.comment = field.comment ? 'COMMENT '+ db.escape(field.comment) : ''

      fields.push([field.name
                  ,field.type
                  ,field.attributes
                  ,field.null
                  ,field.default
                  ,field.auto_increment     ? 'AUTO_INCREMENT' : ''
                  ,field.index === 'UNIQUE' ? 'UNIQUE'         : ''
                  ,field.comment
                  ].join(' '))
    })

    if (primary.length) fields.push('PRIMARY KEY ('+ primary.join(', ') +')')

    engine    = engine ? 'ENGINE = '+ engine : ''
    collation = charset && collation
      ? 'DEFAULT CHARACTER SET '+ charset +' COLLATE '+ collation
      : ''

    options = [collation, engine].join(' ')

    db.query('CREATE TABLE `'+ table +'` ('+ fields.join(', ') +') '+ options, cb)
}

exports.toArray = toArray
function toArray(o) {
  var a = [], i

  for (i in o) a.push(o[i])

  return a
}

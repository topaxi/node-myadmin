var app_path = __dirname.replace('/config', '')

module.exports = {
    'server': {
      'port':        8080
    , 'viewEngine': 'jade'
    // To enable SSL add path to key and certificate
    , 'key':        ''
    , 'cert':       ''
    // HTTP BasicAuth, set login and pw to restrict access
    , 'auth': {
        'login':    'admin'
      , 'password': ''
    }
  }
  , 'controller': {
      'path': app_path +'/controller'
  }
  , 'hosts': {
      'localhost': {
        'user':     'root'
      , 'password': '123qwe'
      , 'databases': []
      , 'host':     'localhost'
      , 'port':     3306
      , 'typeCast': true
      , 'debug':    false
    }
    , 'dev.gameswelt': {
        'user':     'root'
      , 'password': '123qwe'
      , 'databases': [
          'gameswelt_forum'
        , 'gameswelt_forum_fm'
        , 'gameswelt_portal'
      ]
      , 'host':     '192.168.56.251'
      , 'port':     3306
      , 'typeCast': true
      , 'debug':    false
    }
  }
}

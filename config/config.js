var app_path = __dirname.replace('/config', '');

module.exports = {
    'server': {
      'port':        8080
    , 'viewEngine': 'jade'
  }
  , 'controller': {
      'path': app_path + '/controller'
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

var app_path = __dirname.replace('/config', '');

module.exports = {
    'server': {
      'port':        8080
    , 'viewEngine': 'jade'
  }
  , 'controller': {
      'path': app_path + '/controller'
  }
  , 'db': {
      'user':     'root'
    , 'password': '123qwe'
    , 'database': ''
    , 'host':     '192.168.56.251'
    , 'port':     3306
    , 'typeCast': true
    , 'debug':    false
  }
}

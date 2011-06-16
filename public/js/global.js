;(function(window, undefined){

NodeMyadmin.Field = {
    NOT_NULL_FLAG:            1
  , PRI_KEY_FLAG:             2
  , UNIQUE_KEY_FLAG:          4
  , MULTIPLE_KEY_FLAG:        8
  , BLOB_FLAG:               16
  , UNSIGNED_FLAG:           32
  , ZERO_FILL_FLAG:          64
  , BINARY_FLAG:            128
  , ENUM_FLAG:              256
  , AUTO_INCREMENT_FLAG:    512
  , TIMESTAMP_FLAG:        1024
  , SET_FLAG:              2048
  , NO_DEFAULT_VALUE_FLAG: 4096
  , ON_UPDATE_NOW_FLAG:    8192
  //, PART_KEY_FLAG         16384 // internal mysql use only
  , NUM_FLAG:             32768
}

;(function(){
  var templates = {}

  function getTPL(tpl, callback){
    if(templates[tpl]) return void callback(templates[tpl])

    $.get('/template/'+ tpl, function(data){
      // function.toString() returns a string like:
      // function anonymous(variable) {
      //   // ... statements
      // }
      // return the anonymous function in a function constructor
      // to get the actual function assigned to the callback
      // parameter.
      callback(templates[tpl] = (new Function('return '+ data))())
    }, 'text')
  }
  NodeMyadmin.getTPL = getTPL
})()

})(window)

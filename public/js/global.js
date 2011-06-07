;(function(window, undefined){

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
  window.getTPL = getTPL
})()

})(window)

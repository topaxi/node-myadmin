jQuery(function($) {

var timeout = 2000
  , options = {'query':    'show processlist'
              ,'database': NodeMyadmin.database
              }

;(function processlist() {
  $.post('/'+ NodeMyadmin.host +'/query', options, function(data) {
    NodeMyadmin.getTPL('query-result', function(tpl){
      data.Field   = NodeMyadmin.Field
      data.rowLink = function() {}

      $('#results').html(tpl(data))

      setTimeout(processlist, timeout)
    })
  })
})()

})

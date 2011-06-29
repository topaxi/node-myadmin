jQuery(function($) {

var timer
  , options = {'query':    'show processlist'
              ,'database': NodeMyadmin.database
              }

  , $status  = $('#status').css('height', '16px')
  , $loading = $('<img src="/pictures/loading16.gif">')

;(function processlist() {
  $loading.appendTo($status)

  $.post('/'+ NodeMyadmin.host +'/query', options, function(data) {
    NodeMyadmin.getTPL('query-result', function(tpl) {
      var interval

      data.Field    = NodeMyadmin.Field
      data.rowLink  = function()  { }
      data.truncate = function(s) { return s }

      $('#results').html(tpl(data))

      interval = ($('#interval').val() || 2) * 1000

      timer = setTimeout(processlist, interval < 1000 ? 1000 : interval)

      $loading.remove()
    })
  })
})()

$('#fullprocesslist').click(function() {
  options.query = this.checked ? 'show full processlist' : 'show processlist'
})

})

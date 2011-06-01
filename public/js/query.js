jQuery(function($) {

var textareaHeight = $('textarea').height()

// Insert tab character on tab key
$('textarea').bind('keydown', function(e){
  if (e.keyCode === 9) {
    e.preventDefault()

    var value           = this.value
      , selectionEnd    = this.selectionEnd
      , beforeSelection = value.slice(0, selectionEnd)
      , afterSelection  = value.slice(selectionEnd)

    this.value        = beforeSelection +'\t'+ afterSelection
    this.selectionEnd = selectionEnd + 1
  }
})

$('#query').submit(function(e){
  e.preventDefault()
  hideTextarea()

  $.post('/query', $(this).serialize(), function(data) {
    getTPL('query-result', function(tpl) {
      $('#results').html(tpl(data))
    })
  })
})

function hideTextarea() {
  var $text = $('textarea').height(64)

  $text.one('focus', function() {
    $text.height(textareaHeight)
  })
}

;(function() {
  var matches
  if (matches = /^\/query\/(.*?)\/(.*?)$/.exec(location.pathname)) {
    var query = 'SELECT * FROM '+ matches[2] +' LIMIT 0, 10'

    $('textarea').val(query)

    $('#query').submit()
  }
})()

$('select[name=database]').change(function(){
  $('#tableList').attr('href', '/'+ this.value)
})

if(localStorage && JSON) {
  var queries = JSON.parse(localStorage.queries) || {}

  for(var i in queries) {
    $('#savedQueries').append('<li>'+ i +'</li>')
  }

  $('button.save').click(function() {
    var name = prompt('Save query as:')

    if(!queries[name]){
      $('#savedQueries').append('<li>'+ name +'</li>')
    }

    queries[name] = $('textarea').val()

    localStorage.queries = JSON.stringify(queries)
  })

  $('#savedQueries').delegate('li', 'click', function(){
    var value = ''

    if(!$(this).is(':first-child')){
      value = queries[this.innerHTML]
    }

    $('textarea').val(value)
  })
}
else $('#savedQueries').hide()

})

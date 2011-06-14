jQuery(function($){

var Field = {
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

function rowLink(query, row){
  var fields = query.fields
    , keys   = {}
    , l      = fields.length
    , i      = 0

  for(; i < l; ++i){
    if(fields[i].flags & Field.PRI_KEY_FLAG ||
        fields[i].flags & Field.UNIQUE_KEY_FLAG){
      (keys[fields[i].originalTable] = keys[fields[i].originalTable] || {})
        [fields[i].originalName] = row[fields[i].name]
    }
  }

  // We should not update / delete rows from multiple tables.
  // Currently the fields do not have flags for PRI / UNIQUE etc. for foreign
  // tables, so this check is not really necessary yet
  i = 0; for(l in keys) i++
  if(!i || i > 1) return

  return JSON.stringify(keys[l])

  console.log('/'+ $('#host').text() +'/'
      + query.database +'/'+ l +'/update?'+ $.param(keys[l]))
}

var textareaHeight = $('textarea').height()

// Insert tab character on tab key
$('textarea').bind('keydown', function(e){
  if(e.keyCode === 13 && e.ctrlKey){
    $(this.form).submit()

    return
  }

  if(e.keyCode === 9){
    e.preventDefault()

    var scrollTop       = this.scrollTop
      , value           = this.value
      , selectionEnd    = this.selectionEnd
      , beforeSelection = value.slice(0, selectionEnd)
      , afterSelection  = value.slice(selectionEnd)

    this.value        = beforeSelection +'\t'+ afterSelection
    this.selectionEnd = selectionEnd + 1
    this.scrollTop    = scrollTop
  }
})

$('#query').submit(function(e){
  e.preventDefault()

  var query   = $('textarea').val().trim()
    , matches = /^(drop|truncate)\s+(table|database)\s+`?([^\s`]+)/i.exec(query)
    , msg     = !matches ? '' : 'Do you really want to '+ matches[1].toLowerCase()
      +' the '+ matches[2].toLowerCase()
      +' `'+ matches[3] +'`?'

  // Warn user on drop or truncate queries
  if(matches && !confirm(msg)){
    return
  }

  hideTextarea()

  $('#results').html('<img src="/pictures/loading.gif" alt="loading...">')
  $.post(this.action, $(this).serialize(), function(data){
    getTPL('query-result', function(tpl){
      data.Field   = Field
      data.rowLink = rowLink

      $('#results').html(tpl(data))
    })
  })
})

function hideTextarea(){
  var $text = $('textarea').height(64)

  $text.one('focus', function(){
    $text.height(textareaHeight)
  })
}

;(function(){
  var matches
  if(matches = /\/query\/(.*?)\/(.*?)$/.exec(location.pathname)){
    var query = 'SELECT * FROM '+ matches[2] +' LIMIT 0, 10'

    $('textarea').val(query)

    $('#query').submit()
  }
})()

$('select[name=database]').change(function(){
  $('#tableList').attr('href', '/'+ $('#host').text() +'/'+ this.value)
})

if(localStorage && JSON){
  var queries = JSON.parse(localStorage.queries || null) || {}

  for(var i in queries){
    $('#savedQueries').append('<li class="clickable">'+ i +'</li>')
  }

  $('button.save').click(function(){
    var name = prompt('Save query as:')

    if(!queries[name]){
      $('#savedQueries').append('<li class="clickable">'+ name +'</li>')
    }

    queries[name] = $('textarea').val()

    localStorage.queries = JSON.stringify(queries)
  })

  $('#savedQueries').delegate('li', 'click', function(){
    var value = ''

    if(!$(this).is(':first-child')){
      value = queries[this.innerHTML]
    }
    else {
      $('input[name=parameters]').val('')
    }

    $('textarea').val(value)
  })
}
else $('#savedQueries').hide()

})

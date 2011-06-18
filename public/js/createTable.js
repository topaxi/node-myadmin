;(function(window, undefined){

var $ = window.jQuery

;(function(){
  var charsets

  NodeMyadmin.getCharsets = getCharsets
  function getCharsets(callback){
    if(charsets) return void callback(charsets)

    $.getJSON('/'+ NodeMyadmin.host +'/getCharsets', function(data){
      callback(charsets = data)
    })
  }
})()

$('.addField').click(function(e) {
  e.preventDefault()

  NodeMyadmin.getTPL('field', function(tpl){
    NodeMyadmin.getCharsets(function(charsets) {
      $('.fields').append($('<div class="field">').html(
        tpl({fields:NodeMyadmin.Field
            ,i:$('div.field').length
            ,charsets:charsets
            }
        )
      ))
    })
  })
})

})(window)

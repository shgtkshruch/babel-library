bookDetailTemplate = _.template $('#bookDetail-template').text()

$ '#addItem'
  .click ->
    $('.js-modal, .js-modal__form').show()

$ '.js-book'
  .click ->
    book =
      isbn: $(@).data('isbn')
      image: $(@).data('image')
      title: $(@).data('title')
      author: $(@).data('author')
      publisher: $(@).data('publisher')
      publicationDate: $(@).data('publicationDate')
      place: $(@).data('place')

    $ '.js-modal'
      .after bookDetailTemplate book
      .next()
        .css
          top: $(window).scrollTop() + $(window).height() / 2
        .end()
      .show()

$(document).on 'click', '.js-bookDetail__close, .js-modal', ->
  $('.js-bookDetail').remove()
  $('.js-modal').hide()
  $('.js-modal__form').hide()

$(document).on 'click', '.js-bookDetail__remove', ->
  isbn = $(@).parents('.js-bookDetail').data('isbn');

  $('[data-isbn=' + isbn + ']').remove()

  $('.js-modal').hide()

  $.ajax
    url: '/book'
    method: 'DELETE'
    data:
      isbn: isbn

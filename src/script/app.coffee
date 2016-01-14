bookDetailTemplate = _.template $('#bookDetail-template').text()

$ '#addItem'
  .click ->
    $('.js-modal, .js-modal__form').show()

$ '.js-book'
  .click ->
    book =
      isbn: $(@).data('isbn')
      image: $(@).data('image')
      detailPageURL: $(@).data('detailpageurl')
      title: $(@).data('title')
      author: $(@).data('author')
      publisher: $(@).data('publisher')
      publicationDate: $(@).data('publicationDate')
      price: $(@).data('price')
      page: $(@).data('page')
      place: $(@).data('place')
      booklist: $(@).data('booklist')

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
  isbn = $(@).parents('.js-bookDetail').data('isbn')

  $.ajax
    url: '/book'
    method: 'DELETE'
    data:
      isbn: isbn
    success: (data, status, xhr) ->
      $('[data-isbn=' + isbn + ']').remove()
      $('.js-modal').hide()

$(document).on 'change', '.js-bookDetail__place', ->
  isbn = $('.js-bookDetail').data('isbn')
  place = $(@).val()

  $.ajax
    url: '/book/place'
    method: 'PUT'
    data:
      isbn: isbn
      place: place
    success: (data, status, xhr) ->
      $('[data-isbn=' + isbn + ']').data('place', place)

$(document).on 'click', '#booklistBtn', ->
  booklist = $(@).parent().prev().find('textarea').val()
  isbn = $(@).parents('.js-bookDetail').data('isbn')

  $.ajax
    url: '/book/booklist'
    method: 'PUT'
    data:
      isbn: isbn
      booklist: booklist
    success: (data, status, xhr) ->
      $('[data-isbn=' + isbn + ']').data('booklist', booklist)

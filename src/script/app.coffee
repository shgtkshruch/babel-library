$book = $('.js-book')
bookDetailTemplate = _.template $('#bookDetail-template').text()

# add book
$ '#addItem'
  .click ->
    $('.js-modal, .js-modal__form').show()

$ '#form'
  .on 'submit', (e) ->
    e.preventDefault()

    isbn = $(@).find('input').val()
    place = $(@).find('select').val()
    booklist = $(@).find('textarea').val().trim().split(' ')

    $.ajax
      url: '/book'
      method: 'POST'
      data:
        isbn: isbn
        place: place
        booklist: booklist
        _csrf: csrf
      success: (data, status, xhr) ->
        location.reload()

      error: (xhr, status, error) ->
        console.log error

# show modal window to display detail infromation of book
$book.click ->
  book =
    isbn: $(@).attr('data-isbn')
    image: $(@).attr('data-image')
    detailPageURL: $(@).attr('data-detailpageurl')
    title: $(@).attr('data-title')
    author: $(@).attr('data-author')
    publisher: $(@).attr('data-publisher')
    publicationDate: $(@).attr('data-publication-date')
    price: $(@).attr('data-price')
    page: $(@).attr('data-page')
    place: $(@).attr('data-place')
    booklist: $(@).attr('data-booklist').split(',')

  $ '.js-modal'
    .after bookDetailTemplate book
    .next()
      .css
        top: $(window).scrollTop() + $(window).height() / 2
      .end()
    .show()

# hide modal window
$(document).on 'click', '.js-bookDetail__close, .js-modal', ->
  $('.js-bookDetail').remove()
  $('.js-modal').hide()
  $('.js-modal__form').hide()

# remove book
$(document).on 'click', '.js-bookDetail__remove', ->
  isbn = $(@).parents('.js-bookDetail').attr('data-isbn')

  $.ajax
    url: '/book'
    method: 'DELETE'
    data:
      isbn: isbn
      _csrf: csrf
    success: (data, status, xhr) ->
      $('[data-isbn=' + isbn + ']').remove()
      $('.js-modal').hide()

# update place of book
$(document).on 'change', '.js-bookDetail__place', ->
  isbn = $('.js-bookDetail').attr('data-isbn')
  place = $(@).val()

  $.ajax
    url: '/book/place'
    method: 'PUT'
    data:
      isbn: isbn
      place: place
      _csrf: csrf
    success: (data, status, xhr) ->
      $('[data-isbn=' + isbn + ']').attr('data-place', place)

# update booklist
$(document).on 'focusout', '.js-bookDetail__textarea', ->
  booklist = $(@).val().trim().split(' ')
  isbn = $(@).parents('.js-bookDetail').attr('data-isbn')

  $.ajax
    url: '/book/booklist'
    method: 'PUT'
    data:
      isbn: isbn
      booklist: booklist
      _csrf: csrf
    success: (data, status, xhr) ->
      $('[data-isbn=' + isbn + ']').attr('data-booklist', booklist)

# autocomplete
$(document).on 'keyup', 'textarea', ->
  booklistNames = $('main').attr('data-booklist').split(',')

  $(@).textcomplete [{
    match: /\b(\w{2,})$/
    search: (term, callback) ->
      callback($.map(booklistNames, (name) ->
        return if name.indexOf(term) is 0 then name else null
      ))
    index: 1
    replace: (word) ->
      return word + ' '
  }]

# filtering by place of book
$ '#placeController'
  .on 'change', ->
    place = $(@).val()
    if place is 'all'
      $book.show()
    else
      $book.hide()
      $('[data-place="' + place + '"]').show()

# filtering by booklist
$ '#booklistController'
  .on 'change', ->
    booklist = $(@).val()
    if booklist is 'all'
      $book.show()
    else
      $book.hide()
      $book.each (i, el) ->
        if $(el).attr('data-booklist').split(',').indexOf(booklist) isnt -1
          $(el).show()

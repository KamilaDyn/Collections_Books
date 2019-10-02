let form = document.querySelector("#form");
let btn = document.querySelector("#btn");
const author = document.querySelector('#author');
const title = document.querySelector('#title');
let searchByTitle = title.value.trim().replace(/[ ]/g, '+');
const printType = document.querySelector("[name = 'print-type']").value;
///=================search====================
const search = (e) => {
  e.preventDefault();
  let bookTitle = title.value.trim().replace(/[ ]/g, '+');
  let bookAuthor = author.value.trim().replace(/[ ]/g, '+');
  const printType = document.querySelector("[name = 'print-type']").value;


  ///STorage//////////
  let myObj = {
    title: title.value.trim().replace(/[ ]/g, '+'),
    autor: author.value.trim().replace(/[ ]/g, '+'),
  };
  sessionStorage.setItem('book-data', JSON.stringify(myObj));

  ///Attribute ////////////////////////////////////////
  title.setAttribute("data-title", bookTitle);
  author.setAttribute('data-author', bookAuthor)
  history.pushState({
    bookTitle,
    bookAuthor
  }, null, `?q=${bookTitle || "search"}+inauthor:${bookAuthor}&printType=${printType}&maxResults=40`)
  getBooks()

  document.forms['form'].reset();
}
form.addEventListener('submit', search)

//getItem from session storage/////////////////////////
let name = JSON.parse(sessionStorage.getItem('book-data'));
let nameAuthor = Object.values(name)[1];
let nameTitle = Object.values(name)[0];

///get BOOKS///////////////////////////////////////////

function getBooks() {
  const bookData = title.getAttribute('data-title');
  const bookAuthor = author.getAttribute('data-author');
  const printType = document.querySelector("[name = 'print-type']").value;

  axios.get((bookData === null && bookAuthor === null) ? `https://www.googleapis.com/books/v1/volumes?q=${nameTitle || "search"}+inauthor:${nameAuthor || ""}&printType=${printType}&maxResults=40` : `https://www.googleapis.com/books/v1/volumes?q=${bookData || "search"}+inauthor:${bookAuthor || ""}&printType=${printType}&maxResults=40`)

    .then((response) => {
      if (response.data.totalItems > 0) {

        console.log(response)
        let books = response.data.items;
        let output = '';
        books.forEach(function (book) {

          function image() {
            if (!('imageLinks' in book.volumeInfo)) {
              (book.volumeInfo['imageLinks'] = {
                thumbnail: src = 'https://via.placeholder.com/150'
              })
            }
          }
          image()

          output += `
        <div class='books'>
          <img class="books__img" src="${book.volumeInfo.imageLinks.thumbnail === 'undefined' ? image() : book.volumeInfo.imageLinks.thumbnail}">
          <div class="books__details"> 
            <h2 class="books__title">${book.volumeInfo.title}</h2>
            <ul class="books__items-list">
            <li class="books__item"><span>Author/s: </span>${book.volumeInfo.authors}</li>
            <li class="books__item"><span>Categories: </span>${book.volumeInfo.categories}</li>
            <li class="books__item"><span>Published: </span>${book.volumeInfo.publishedDate}</li>
            </ul>
            <a class="books__link" onClick="getId('${book.id}')" ><button  class="books__btn" ">Details</button></a>
          </div>
        </div>

        `
        })
        document.querySelector('.books-list').innerHTML = output;

      } else {
        alert('We are sorry, but we can not find your request, please try again');
        document.querySelector('.books-list').innerHTML = ''
      }

    })

    .catch((err) => {
      console.log('Something went wrong ' + err)
      alert('Website is unavailabele now, please refresh page, or try again')
    })

}


getBooks(nameTitle, nameAuthor)

/// popstate/// =====================================================

window.addEventListener('popstate', (event) => {
  console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
  event.preventDefault();

  let title = Object.values(event.state)[0]
  let author = Object.values(event.state)[1];

  function getBooks() {

    axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${title || "search"}+inauthor:${author || ""}&printType=${printType}&maxResults=40`)

      .then((response) => {

        console.log(response)
        let books = response.data.items;
        let output = '';
        books.forEach(function (book) {

          function image() {
            if (!('imageLinks' in book.volumeInfo)) {
              (book.volumeInfo['imageLinks'] = {
                thumbnail: src = 'https://via.placeholder.com/150'
              })
            }
          }
          image()

          output += `
            <div class='books'>
          <img class="books__img" src="${book.volumeInfo.imageLinks.thumbnail === 'undefined' ? image() : book.volumeInfo.imageLinks.thumbnail}">
          <div class="books__details"> 
            <h2 class="books__title">${book.volumeInfo.title}</h2>
            <ul class="books__items-list">
            <li class="books__item"><span>Author/s: </span>${book.volumeInfo.authors}</li>
            <li class="books__item"><span>Categories: </span>${book.volumeInfo.categories}</li>
            <li class="books__item"><span>Published: </span>${book.volumeInfo.publishedDate}</li>
            </ul>
            <a class="books__link" onClick="getId('${book.id}')" ><button  class="books__btn" ">Details</button></a>
          </div>
        </div>
  
          `
        })
        document.querySelector('.books-list').innerHTML = output;

      })

      .catch((err) => {
        console.log('Something went wrong ' + err)
      })

  }
  getBooks();

});



function getId(id) {
  sessionStorage.setItem("bookId", id);
  window.location = 'book.html';
  return false;
}
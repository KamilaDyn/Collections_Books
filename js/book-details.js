function getBook() {
  let bookid = sessionStorage.getItem('bookId');
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${bookid}`)

    .then((response) => {
      console.log(response)

      if (response.data.totalItems < 1) {
        let alert = `
      <h1 class="alert-info">We are sorry, but informations about this book are not available <br> Please, try other book</h1>
    `
        document.querySelector('.book-details').innerHTML = alert
      }

      let book = response.data.items[0].volumeInfo
      let info = response.data.items[0];
      let saleInfo = response.data.items[0].saleInfo;

      function image() {
        if (!('imageLinks' in book)) {
          (book['imageLinks'] = {
            thumbnail: 'https://via.placeholder.com/150'
          })
        }
      }
      image();

      function price() {
        if (!('listPrice' in saleInfo)) {
          (saleInfo['listPrice'] = {
            amount: 'no information',
            currencyCode: '?'
          })
        }
      }
      price();

      function textSnippet() {
        if (!('searchInfo' in info)) {
          (info['searchInfo'] = {
            textSnippet: 'No information'
          })
        }
      }
      textSnippet();


      let output = `
    <div class="book">
    
      <img class="book__img" src="${book.imageLinks.thumbnail === 'undefined' ? image() : book.imageLinks.thumbnail}">
      <div class="info">
        <h1 class="info__title"><span>Title: </span> ${book.title}</h1>
        <ul class="info__items-list">
        <li class="info__item"><span>Author/s: </span> ${book.authors  === undefined ? 'No information' : book.authors}</li>
        <li class="info__item"><span>Categories: </span>${book.categories  === undefined ? 'No information' : book.categories}</li>
        <li class="info__item"><span>Publisher: </span>${book.publisher  === undefined ? 'No information' : book.publisher}</li>
        </ul>
      </div>
    </div>
    <div class="description"><p class="description__info"><span>Description: </span>${book.description  === undefined ? 'No information' : book.description}</p>
    <p class="shortText__info"><span>Text Snippet: </span>${info.searchInfo.textSnippet === undefined ? textSnippet() : info.searchInfo.textSnippet}</p>
    </div>
    <div class="details-info">
      <ul class="details-info__list">
          <li class="details-info__item"><span>Published Date: ${book.publishedDate}</span> </li> 
          <li class="details-info__item"><span>Page Count: </span>${book.pageCount  === undefined ? 'No information' : book.pageCount}</li>
          <li class="details-info__item"><span>Type: </span>${book.printType  === undefined ? 'No information' : book.printType.toLowerCase()}</li>
          <li class="details-info__item"><span>Language: </span> ${book.language}</li>
          <li class="details-info__item" id="raiting" ><span>Ratings: </span>${book.ratingsCount === undefined ? 'No information' : book.ratingsCount} / 5 </li>
          <li class="details-info__item"><span>Country (buy): </span>  ${saleInfo.country}</li>
          <li class="details-info__item"><span>Saleability: </span>${info.saleInfo.saleability.replace(/[_]/g, " ").toLowerCase()} </li>
          <li class="details-info__item"><span>Price:  </span>${saleInfo.listPrice.amount === undefined ? price() : saleInfo.listPrice.amount}  <span> | </span> ${saleInfo.listPrice.currencyCode === undefined ? price() : saleInfo.listPrice.currencyCode.toLowerCase()} </li>
          <li class="details-info__item"><span>Web-reading: </span> <a href="${info.accessInfo.webReaderLink}" target="_blank"> Read a book </a> </li>
          <li class="details-info__item"><span>E-book available: ${!info.saleInfo.isEbook ? "no" : "yes" } </span> </li>
          <li class="details-info__item"><span>epub available: ${info.accessInfo.epub.isAvailable  ? "yes" : "no" } </span> </li>
          <li class="details-info__item"><span>pdf available: ${info.accessInfo.pdf.isAvailable  ? "yes" : "no" } </span> </li>   
                
      </ul>
    </div>
    
    `;

      document.querySelector('.book-details').innerHTML = output;
    })

    .catch((err) => console.log('something went wrong ' + err))
}
getBook();
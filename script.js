'use strict';
//1. Восстановить порядок книг.
const bookList = document.querySelector('.books');
const books = document.querySelectorAll('.book');
let orderedBooks = [...books].reduce((sortBooks, item) => {
  const key = +item.querySelector('h2 > a').textContent.trim()[6];
  sortBooks[key - 1] = item;
  return sortBooks;
}, []);
orderedBooks.forEach((book) => bookList.append(book));

//2. Заменить картинку заднего фона на другую из папки image
const body = document.querySelector('body');
body.style.backgroundImage = 'url(./image/you-dont-know-js.jpg)';

//3. Исправить заголовок в книге 3( Получится - "Книга 3. this и Прототипы Объектов")
document.querySelector('.book:nth-child(3) > h2 > a').textContent = 'Книга 3. this и Прототипы Объектов';

//4. Удалить рекламу со страницы
document.querySelector('.adv').remove();

//5. Восстановить порядок глав во второй и пятой книге (внимательно инспектируйте индексы элементов, поможет dev tools)
const book2 = document.querySelector('.book:nth-child(2)');
const book5 = document.querySelector('.book:nth-child(5)');

const sortTableOfContentsBook = (book) => {
  const tableOfContentsBook = book.querySelectorAll('li');
  let sortTableOfContents = [...tableOfContentsBook].reduce(
    (sortTableOfContents, item) => {
      if (item.textContent.trim().substring(0, 5) === 'Глава') {
        const key = +item.textContent.trim()[6];
        sortTableOfContents.chapters[key - 1] = item;
      } else if (item.textContent.trim().substring(0, 10) === 'Приложение') {
        const key = item.textContent.trim().substring(11, 12).charCodeAt();
        sortTableOfContents.appendixs[key] = item;
      }
      return sortTableOfContents;
    },
    { chapters: [], appendixs: {} }
  );

  const sortAppendixs = Object.keys(sortTableOfContents.appendixs)
    .sort()
    .map((item) => sortTableOfContents.appendixs[item]);

  let lastItem = tableOfContentsBook[1];

  sortTableOfContents.chapters.forEach((item) => {
    lastItem.after(item);
    lastItem = item;
  });

  sortAppendixs.forEach((item) => {
    lastItem.after(item);
    lastItem = item;
  });
};

sortTableOfContentsBook(book2);
sortTableOfContentsBook(book5);

//6. В шестой книге добавить главу “Глава 8: За пределами ES6” и поставить её в правильное место

const TableOfContentsBook6Items = document.querySelectorAll('.book:nth-child(6) li');
TableOfContentsBook6Items[8].insertAdjacentHTML('afterend', '<li>Глава 8: За пределами ES6</li>');

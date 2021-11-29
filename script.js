'use strict';

let question = prompt('Как называется ваш проект?');
let title = !!question ? question : 'Мой проект';

question = prompt('Какие типы экранов нужно разработать?(пример: "Простые, Сложные, Интерактивные")');
let screens = !!question ? question : 'Не определено';

question = prompt('Сколько будет стоить данная работа?');
let screenPrice = Number.isInteger(+question) ? +question : 0;
let adaptive = confirm('Нужен ли адаптив на сайте?');

let service1 = prompt('Какой дополнительный тип услуги нужен?');
question = prompt('Сколько это будет стоить?');
let servicePrice1 = Number.isInteger(+question) ? +question : 0;
let service2 = prompt('Какой дополнительный тип услуги нужен?');
question = prompt('Сколько это будет стоить?');
let servicePrice2 = Number.isInteger(+question) ? +question : 0;

let fullPrice = screenPrice + servicePrice1 + servicePrice2;

const rollback = 10;

let servicePercentPrice = fullPrice - (fullPrice * (rollback / 100));

console.log(`Итоговая стоимость - ${servicePercentPrice}`);

switch (true) {
    case fullPrice >= 30000:
        console.log('Даем скидку в 10%');
        break;
    case fullPrice >= 15000 && fullPrice < 30000:
        console.log('Даем скидку в 5%');
        break;
    case fullPrice >= 0 && fullPrice < 15000:
        console.log('Скидка не предусмотрена');
        break;
    case fullPrice < 0:
    default:
        console.log('Что то пошло не так');
        break;
}





// console.log(`var title: ${typeof title}`);
// console.log(`var fullPrice: ${typeof fullPrice}`);
// console.log(`var adaptive: ${typeof adaptive}`);

// console.log(`var screens length: ${screens.length}`);

// console.log(`Стоимость верстки экранов ${screenPrice} рублей`);
// console.log(`Стоимость разработки сайта ${fullPrice} рублей`);

// console.log(screens.toLowerCase().split(', '));

// console.log(`Процент отката - ${}`);
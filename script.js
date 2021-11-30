'use strict';

let question = prompt('Как называется ваш проект?', '  мой   проект  ');
let title = !!question ? question : 'Мой проект';

question = prompt('Какие типы экранов нужно разработать?(пример: "Простые, Сложные, Интерактивные")', 'Простые, Сложные, Интерактивные');
let screens = !!question ? question : 'Не определено';

question = prompt('Сколько будет стоить данная работа?', 0);
let screenPrice = Number.isInteger(+question) ? +question : 0;

let adaptive = confirm('Нужен ли адаптив на сайте?');

let service1 = prompt('Какой дополнительный тип услуги нужен?', 'Услуга 1');
question = prompt('Сколько это будет стоить?', 0);
let servicePrice1 = Number.isInteger(+question) ? +question : 0;

let service2 = prompt('Какой дополнительный тип услуги нужен?', 'Услуга 2');
question = prompt('Сколько это будет стоить?', 0);
let servicePrice2 = Number.isInteger(+question) ? +question : 0;

const rollback = 10;

const showTypeOf = function (variable) {
    console.log(variable, typeof variable);
}

const getAllServicePrices = function (price1, price2) {
    return price1 + price2;
}

function getFullPrice(screenPrice, allServicePrices) {
    return screenPrice + allServicePrices;
}


const getTitle = function (title) {
    const firstChar = title.trim().substring(0, 1).toUpperCase();
    const secondChars = title.trim().substring(1).toLowerCase();
    return firstChar + secondChars;
}

const getServicePercentPrices = function (price, rollback) {
    return price - (price * (rollback / 100));
}

const getRollBackMessage = function (price) {
    if (price >= 30000) {
        return 'Даем скидку в 10%';
    } else if (price >= 15000 && price < 30000) {
        return 'Даем скидку в 5%';
    } else if (price >= 0 && price < 15000) {
        return 'Скидка не предусмотрена';
    } else {
        return 'Что то пошло не так';
    }
}

title = getTitle(title);

let allServicePrices = getAllServicePrices(servicePrice1, servicePrice2);

let fullPrice = getFullPrice(screenPrice, allServicePrices);

let servicePercentPrice = getServicePercentPrices(fullPrice, rollback);

showTypeOf(title);
showTypeOf(fullPrice);
showTypeOf(adaptive);

console.log(screens.toLowerCase().replaceAll(' ', '').split(','));

console.log(getRollBackMessage(fullPrice));

console.log(servicePercentPrice);
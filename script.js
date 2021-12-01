'use strict';

let title;
let screens;
let screenPrice;
let adaptive;
let service1;
let service2;
let allServicePrices;
let fullPrice;
let servicePercentPrice;

const rollback = 10;

const isNumber = num => !isNaN(parseFloat(num)) && isFinite(num) && !num.includes(' ');
const isValidString = string => string ? !!string.trim() : false;

const getValue = function (question, defaultValue, check) {
    let value;
    do {
        value = prompt(question, defaultValue);
    } while (!check(value));
    return value;
}

const asking = function () {
    title = getValue('Как называется ваш проект?', '  мой   проект  ', isValidString);
    adaptive = confirm('Нужен ли адаптив на сайте?');
    screens = getValue('Какие типы экранов нужно разработать?(пример: "Простые, Сложные, Интерактивные")', 'Простые, Сложные, Интерактивные', isValidString);
    screenPrice = +getValue('Сколько будет стоить данная работа?', 0, isNumber);
}


const getAllServicePrices = function () {
    let sum = 0;
    let servicePrice;
    for (let i = 0; i < 2; i++) {
        if (i === 0) {
            service1 = prompt('Какой дополнительный тип услуги нужен?', 'Услуга 1');
        } else if (i === 1) {
            service2 = prompt('Какой дополнительный тип услуги нужен?', 'Услуга 2');
        }
        servicePrice = getValue('Сколько это будет стоить?', 0, isNumber);
        sum += +servicePrice;
    }
    return sum;
}

const showTypeOf = function (variable) {
    console.log(variable, typeof variable);
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

asking();

title = getTitle(title);

allServicePrices = getAllServicePrices();

console.log(screenPrice, allServicePrices);

fullPrice = getFullPrice(screenPrice, allServicePrices);

servicePercentPrice = getServicePercentPrices(fullPrice, rollback);

showTypeOf(title);
showTypeOf(fullPrice);
showTypeOf(adaptive);

console.log(screens.toLowerCase().replaceAll(' ', '').split(','));

console.log(getRollBackMessage(fullPrice));

console.log(servicePercentPrice);
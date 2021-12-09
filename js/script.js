'use strict';

const titleElement = document.getElementsByTagName('h1')[0];
const startBtn = document.getElementsByClassName('handler_btn')[0];
const resetBtn = document.getElementsByClassName('handler_btn')[1];
const screenBtn = document.querySelector('.screen-btn');
const otherItemsPercentElements = document.querySelectorAll('.other-items.percent');
const otherItemsNumberElements = document.querySelectorAll('.other-items.number');
const inputRollback = document.querySelector('.rollback input[type="range"]');
const rangeValueElement = document.querySelector('.rollback span');
const [
  inputTotal,
  inputTotalCount,
  inputTotalCountOther,
  inputTotalFullCount,
  inputTotalCountRollback,
] = document.getElementsByClassName('total-input');

let screenElement = document.querySelector('.screen');

console.log('titleElement: ', titleElement);
console.log('startBtn: ', startBtn);
console.log('resetBtn: ', resetBtn);
console.log('screenBtn: ', screenBtn);
console.log('otherItemsPercentElements: ', otherItemsPercentElements);
console.log('otherItemsNumberElements: ', otherItemsNumberElements);
console.log('inputRollback: ', inputRollback);
console.log('rangeValueElement: ', rangeValueElement);
console.log('screenElement: ', screenElement);

console.log(
  inputTotal,
  inputTotalCount,
  inputTotalCountOther,
  inputTotalFullCount,
  inputTotalCountRollback
);

const appData = {
  title: '',
  screens: [],
  screenPrice: 0,
  adaptive: true,
  rollback: 10,
  allServicePrices: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  numberOfServices: 2,
  services: {},

  start: () => {
    appData.asking();
    appData.addPrices();
    appData.getTitle();
    appData.getFullPrice();
    appData.getServicePercentPrices();
    appData.logger();
  },

  isNumber: (num) => !isNaN(parseFloat(num)) && isFinite(num) && !num.includes(' '),
  isValidString: (string) => (string && !appData.isNumber(string.trim()) ? !!string.trim() : false),
  getValue: function (question, defaultValue, check) {
    let value;
    do {
      value = prompt(question, defaultValue);
    } while (!check(value));
    return value;
  },

  asking: function () {
    appData.title = appData.getValue(
      'Как называется ваш проект?',
      '  мой   проект  ',
      appData.isValidString
    );
    appData.adaptive = confirm('Нужен ли адаптив на сайте?');

    for (let i = 0; i < 2; i++) {
      let name = appData.getValue(
        'Какие типы экранов нужно разработать?(пример: "Простые, Сложные, Интерактивные")',
        'Простой',
        appData.isValidString
      );
      let price = +appData.getValue('Сколько будет стоить данная работа?', 0, appData.isNumber);
      appData.screens.push({ id: i, name, price });
    }

    for (let i = 0; i < appData.numberOfServices; i++) {
      let name = appData.getValue(
        'Какой дополнительный тип услуги нужен?',
        'Услуга',
        appData.isValidString
      );
      let price = +appData.getValue('Сколько это будет стоить?', 0, appData.isNumber);
      /*УСЛОЖНЕННОЕ ЗАДАНИЕ
      Если пользователь введет одинаковый ответ на вопрос "Какой дополнительный тип услуги нужен?"
      то необходимо не перезаписывать, а сохранять оба ответа в appData.services, добавить каждому
      названию ключа уникальность!
      */
      let serviceNamePattern = new RegExp(`${name}[_0-9]*`, 'g');
      let serviceCount = Object.keys(appData.services).filter((service) =>
        serviceNamePattern.test(service)
      ).length;
      console.log(serviceNamePattern, serviceCount);
      name = serviceCount > 0 ? `${name}_${serviceCount}` : name;
      appData.services[name] = price;
    }
  },
  getServiceName: function (question, defaultValue) {
    let value;
    do {
      value = prompt(question, defaultValue);
    } while (!appData.isValidString(value));

    return value;
  },
  //УСЛОЖНЕННОЕ ЗАДАНИЕ
  //Посчитать свойство appData.screenPrice методом reduce
  addPrices: function () {
    appData.screenPrice = appData.screens.reduce((sum, screen) => sum + screen.price, 0);
    for (let serviceName in appData.services) {
      appData.allServicePrices += appData.services[serviceName];
    }
  },
  getFullPrice: function getFullPrice() {
    appData.fullPrice = appData.screenPrice + appData.allServicePrices;
  },
  getTitle: function () {
    appData.title =
      appData.title.trim().substring(0, 1).toUpperCase() +
      appData.title.trim().substring(1).toLowerCase();
  },
  getServicePercentPrices: function () {
    const { fullPrice, rollback } = appData;
    appData.servicePercentPrice = fullPrice - fullPrice * (rollback / 100);
  },
  getRollBackMessage: function (price) {
    if (price >= 30000) {
      return 'Даем скидку в 10%';
    } else if (price >= 15000 && price < 30000) {
      return 'Даем скидку в 5%';
    } else if (price >= 0 && price < 15000) {
      return 'Скидка не предусмотрена';
    } else {
      return 'Что то пошло не так';
    }
  },

  logger: () => {
    console.log(appData.fullPrice);
    console.log(appData.services);
    console.log(appData.servicePercentPrice);
    console.log(appData.screens);
    console.log(appData.screenPrice);
  },
};

// appData.start();

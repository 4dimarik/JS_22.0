'use strict';

const appData = {
  title: '',
  screens: '',
  screenPrice: 0,
  adaptive: true,
  rollback: 10,
  allServicePrices: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  service1: '',
  service2: '',
  isNumber: (num) => !isNaN(parseFloat(num)) && isFinite(num) && !num.includes(' '),
  isValidString: (string) => (string ? !!string.trim() : false),
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
    appData.screens = appData.getValue(
      'Какие типы экранов нужно разработать?(пример: "Простые, Сложные, Интерактивные")',
      'Простые, Сложные, Интерактивные',
      appData.isValidString
    );
    appData.screenPrice = +appData.getValue(
      'Сколько будет стоить данная работа?',
      0,
      appData.isNumber
    );
  },
  getAllServicePrices: function () {
    let sum = 0;
    let servicePrice;
    for (let i = 0; i < 2; i++) {
      if (i === 0) {
        appData.service1 = prompt('Какой дополнительный тип услуги нужен?', 'Услуга 1');
      } else if (i === 1) {
        appData.service2 = prompt('Какой дополнительный тип услуги нужен?', 'Услуга 2');
      }
      servicePrice = appData.getValue('Сколько это будет стоить?', 0, appData.isNumber);
      sum += +servicePrice;
    }
    return sum;
  },
  getFullPrice: function getFullPrice(screenPrice, allServicePrices) {
    return screenPrice + allServicePrices;
  },
  getTitle: function (title) {
    const firstChar = title.trim().substring(0, 1).toUpperCase();
    const secondChars = title.trim().substring(1).toLowerCase();
    return firstChar + secondChars;
  },
  getServicePercentPrices: function (price, rollback) {
    return price - price * (rollback / 100);
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
  start: () => {
    appData.asking();
    appData.title = appData.getTitle(appData.title);
    appData.allServicePrices = appData.getAllServicePrices();
    appData.fullPrice = appData.getFullPrice(appData.screenPrice, appData.allServicePrices);
    appData.servicePercentPrice = appData.getServicePercentPrices(
      appData.fullPrice,
      appData.rollback
    );
    appData.logger();
  },
  logger: () => {
    for (let key in appData) {
      console.log(appData[key]);
    }
  },
};

appData.start();

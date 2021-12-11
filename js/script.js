'use strict';

const titleElement = document.getElementsByTagName('h1')[0];
const startBtn = document.getElementsByClassName('handler_btn')[0];
const resetBtn = document.getElementsByClassName('handler_btn')[1];
const addScreenBtn = document.querySelector('.screen-btn');
const otherItemsPercentElements = document.querySelectorAll('.other-items.percent');
const otherItemsNumberElements = document.querySelectorAll('.other-items.number');
const inputRollback = document.querySelector('.rollback input[type="range"]');
const rangeValueElement = document.querySelector('.rollback span');
const [inputTotal, inputTotalCount, inputTotalCountOther, inputTotalFullCount, inputTotalCountRollback] =
  document.getElementsByClassName('total-input');

//let screens = document.querySelectorAll('.screen');

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
  services: [],

  init: function () {
    appData.addTitle();

    startBtn.addEventListener('click', appData.start);
    addScreenBtn.addEventListener('click', appData.addScreenBlock);
  },
  start: () => {
    appData.screens = [];
    appData.addScreens();
    appData.services = [];
    appData.addServices();
    appData.addPrices();
    appData.showResult();
    // appData.getServicePercentPrices();
    appData.logger();
  },
  showResult: () => {
    inputTotal.value = appData.screenPrice;
    inputTotalCountOther.value = appData.allServicePrices;
    inputTotalFullCount.value = appData.fullPrice;
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
  addTitle: () => {
    document.title = titleElement.textContent;
  },
  getScreens: () => {
    return document.querySelectorAll('.screen');
  },
  addScreens: () => {
    appData.getScreens().forEach((screen, id) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      const name = select.options[select.selectedIndex].textContent;
      const price = +select.value * +input.value;

      appData.screens.push({ id, name, price });
    });
  },
  addScreenBlock: () => {
    const cloneScreen = appData.getScreens()[0].cloneNode(true);
    cloneScreen.querySelector('select').value = '';
    cloneScreen.querySelector('input').value = null;

    addScreenBtn.before(cloneScreen);
  },
  addServices: () => {
    otherItemsPercentElements.forEach((element) => {
      const { isSelected, name, price } = appData.getServiceData(element);
      const priceType = 'percent';
      if (isSelected) appData.services.push({ name, priceType, price });
    });
    otherItemsNumberElements.forEach((element) => {
      const { isSelected, name, price } = appData.getServiceData(element);
      const priceType = 'number';
      if (isSelected) appData.services.push({ name, priceType, price });
    });
  },
  getServiceData: (service) => {
    return {
      isSelected: service.querySelector('input[type=checkbox]').checked,
      name: service.querySelector('label').textContent,
      price: +service.querySelector('input[type=text]').value,
    };
  },

  getServiceName: function (question, defaultValue) {
    let value;
    do {
      value = prompt(question, defaultValue);
    } while (!appData.isValidString(value));

    return value;
  },

  addPrices: function () {
    appData.screenPrice = appData.screens.reduce((sum, screen) => sum + screen.price, 0);
    appData.allServicePrices = appData.services.reduce((sum, service) => {
      if (service.priceType === 'percent') sum += appData.screenPrice * (service.price / 100);
      if (service.priceType === 'number') sum += service.price;
      return sum;
    }, 0);
    appData.fullPrice = appData.screenPrice + appData.allServicePrices;
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
    console.log('screens: ', appData.screens);
    console.log('services: ', appData.services);
    console.log('allServicePrices:', appData.allServicePrices);
    console.log('fullPrice: ', appData.fullPrice);

    console.log(appData);

    //
    // console.log(appData.servicePercentPrice);
    //
    // console.log(appData.screenPrice);
  },
};

appData.init();

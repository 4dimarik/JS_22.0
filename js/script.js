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
  rollback: 0,
  allServicePrices: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  numberOfScreens: 0,
  services: [],

  init: function () {
    appData.addTitle();

    startBtn.addEventListener('click', appData.start);
    addScreenBtn.addEventListener('click', appData.addScreenBlock);

    // 1) Запретить нажатие кнопки Рассчитать...
    startBtn.disabled = true;
    const screensBlock = document.querySelectorAll('.main-controls__views.element')[0];
    screensBlock.addEventListener('input', appData.screensValidation);

    // 2) Повесить на input[type=range] (в блоке с классом .rollback) обработчик...
    inputRollback.addEventListener('input', appData.rollbackChange);
  },

  start: () => {
    appData.screens = [];
    appData.addScreens();
    appData.services = [];
    appData.addServices();
    appData.addPrices();
    appData.showResult();
    appData.logger();
  },
  showResult: () => {
    inputTotal.value = appData.screenPrice;
    inputTotalCountOther.value = appData.allServicePrices;
    inputTotalFullCount.value = appData.fullPrice;
    inputTotalCountRollback.value = appData.servicePercentPrice;
    inputTotalCount.value = appData.numberOfScreens;
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
      const count = +input.value;
      const name = select.options[select.selectedIndex].textContent;
      const price = +select.value * count;

      appData.screens.push({ id, name, price, count });
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
    // 4) ... В методе addPrices посчитать общее количество экранов...
    const screenSumData = appData.screens.reduce(
      (sum, screen) => {
        sum.price += screen.price;
        sum.count += screen.count;
        return sum;
      },
      { price: 0, count: 0 }
    );
    appData.numberOfScreens = screenSumData.count;
    appData.screenPrice = screenSumData.price;
    appData.allServicePrices = appData.services.reduce((sum, service) => {
      if (service.priceType === 'percent') sum += appData.screenPrice * (service.price / 100);
      if (service.priceType === 'number') sum += service.price;
      return sum;
    }, 0);
    appData.fullPrice = appData.screenPrice + appData.allServicePrices;
    // 3) В нашем объекте присутствует метод getServicePercentPrice ...
    const { fullPrice, rollback } = appData;
    appData.servicePercentPrice = fullPrice - fullPrice * (rollback / 100);
  },
  screensValidation: () => {
    const alert = document.getElementById('alert');
    if (alert) alert.remove();
    const isValid = [...appData.getScreens()].some((screen) => {
      const selectValue = screen.querySelector('select').value;
      const inputValue = screen.querySelector('input').value;
      return selectValue !== '' && appData.isNumber(inputValue);
    });
    if (isValid) {
      startBtn.disabled = false;
    } else {
      const btnBlock = document.querySelector('.main-total__buttons');
      btnBlock.before(appData.getAlert('Параметры экранов заданы не корректно'));
    }
  },

  getAlert: (text) => {
    const alert = document.createElement('small');
    alert.id = 'alert';
    alert.style.color = 'red';
    alert.style.textAlign = 'center';
    alert.style.margin = '5px';
    alert.textContent = text;
    return alert;
  },
  rollbackChange: (event) => {
    let value = event.target.value;
    appData.rollback = +value;
    rangeValueElement.textContent = value + '%';
  },

  logger: () => {
    console.log('screens: ', appData.screens);
    console.log('services: ', appData.services);
    console.log('allServicePrices:', appData.allServicePrices);
    console.log('fullPrice: ', appData.fullPrice);
    console.log(appData.servicePercentPrice);

    console.log(appData);
  },
};

appData.init();

'use strict';

const titleElement = document.getElementsByTagName('h1')[0];
const startBtn = document.getElementsByClassName('handler_btn')[0];
const resetBtn = document.getElementsByClassName('handler_btn')[1];
const addScreenBtn = document.querySelector('.screen-btn');
const otherItemsPercentElements = document.querySelectorAll('.other-items.percent');
const otherItemsNumberElements = document.querySelectorAll('.other-items.number');
const inputRollback = document.querySelector('.rollback input[type="range"]');
const rangeValueElement = document.querySelector('.rollback span');
const hiddenCmsVariants = document.querySelector('hidden-cms-variants');
const [
  inputTotal,
  inputTotalCount,
  inputTotalCountOther,
  inputTotalFullCount,
  inputTotalCountRollback,
] = document.getElementsByClassName('total-input');

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
  isCalculated: false,

  elements: {
    screens: [],
  },
  initScreens: null,

  init: function () {
    this.addTitle();

    startBtn.addEventListener('click', this.start.bind(appData));
    resetBtn.addEventListener('click', this.reset.bind(appData));
    addScreenBtn.addEventListener('click', this.addScreenBlock.bind(appData));

    startBtn.disabled = true;
    const screensBlock = document.querySelectorAll('.main-controls__views.element')[0];
    screensBlock.addEventListener('input', this.screensValidation.bind(appData));

    inputRollback.addEventListener('input', this.rollbackChange.bind(appData));
    this.getScreensElements();

    this.initScreens = this.getScreens()[0].cloneNode(true);

    const cmsOpen = document.querySelector('#cms-open');
    cmsOpen.addEventListener('click', this.cmsOpen.bind(appData));
  },

  start: function () {
    this.screens = [];
    this.addScreens();
    this.services = [];
    this.addServices();
    this.addPrices();
    this.showResult();
    this.isCalculated = true;

    this.toggleMainControlsViews();
    this.toggleDispley(startBtn);
    this.toggleDispley(resetBtn);

    // this.logger();
  },
  reset: function () {
    this.getScreens().forEach((screen) => screen.remove());
    addScreenBtn.before(this.initScreens);

    [...document.getElementsByClassName('total-input')].forEach((input) => (input.value = ''));
    document
      .querySelectorAll('.main-controls__views.element input[type="checkbox"]')
      .forEach((checkbox) => (checkbox.checked = false));

    inputRollback.value = 0;
    inputRollback.dispatchEvent(new Event('input'));

    this.toggleDispley(startBtn);
    this.toggleDispley(resetBtn);
  },
  toggleDispley: function (element) {
    element.style.display = startBtn.style.display === 'none' ? 'block' : 'none';
  },
  cmsOpen: function () {},
  showResult: function () {
    inputTotal.value = this.screenPrice;
    inputTotalCountOther.value = this.allServicePrices;
    inputTotalFullCount.value = this.fullPrice;
    inputTotalCountRollback.value = this.servicePercentPrice;
    inputTotalCount.value = this.numberOfScreens;
  },
  getValue: function (question, defaultValue, check) {
    let value;
    do {
      value = prompt(question, defaultValue);
    } while (!check(value));
    return value;
  },
  addTitle: function () {
    document.title = titleElement.textContent;
  },
  getScreens: function () {
    return document.querySelectorAll('.screen');
  },
  addScreens: function () {
    this.getScreens().forEach((screen, id) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      const count = +input.value;
      const name = select.options[select.selectedIndex].textContent;
      const price = +select.value * count;

      this.screens.push({ id, name, price, count });
    });
  },
  addScreenBlock: function () {
    const cloneScreen = this.getScreens()[0].cloneNode(true);
    cloneScreen.querySelector('select').value = '';
    cloneScreen.querySelector('input').value = null;

    addScreenBtn.before(cloneScreen);
    this.getScreensElements();
  },
  getScreensElements: function () {
    this.elements.screens = [...this.getScreens()].reduce((elements, screen) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      elements.push(select, input);
      return elements;
    }, []);
  },
  toggleMainControlsViews: function () {
    this.elements.screens.forEach((element) => (element.disabled = !element.disabled));
    addScreenBtn.disabled = !addScreenBtn.disabled;
  },
  addServices: function () {
    otherItemsPercentElements.forEach((element) => {
      const { isSelected, name, price } = this.getServiceData(element);
      const priceType = 'percent';
      if (isSelected) this.services.push({ name, priceType, price });
    });
    otherItemsNumberElements.forEach((element) => {
      const { isSelected, name, price } = this.getServiceData(element);
      const priceType = 'number';
      if (isSelected) this.services.push({ name, priceType, price });
    });
  },
  getServiceData: function (service) {
    return {
      isSelected: service.querySelector('input[type=checkbox]').checked,
      name: service.querySelector('label').textContent,
      price: +service.querySelector('input[type=text]').value,
    };
  },
  addPrices: function () {
    const screenSumData = this.screens.reduce(
      (sum, screen) => {
        sum.price += screen.price;
        sum.count += screen.count;
        return sum;
      },
      { price: 0, count: 0 }
    );
    this.numberOfScreens = screenSumData.count;
    this.screenPrice = screenSumData.price;
    this.allServicePrices = this.services.reduce((sum, service) => {
      if (service.priceType === 'percent') sum += this.screenPrice * (service.price / 100);
      if (service.priceType === 'number') sum += service.price;
      return sum;
    }, 0);
    this.fullPrice = this.screenPrice + this.allServicePrices;

    const { fullPrice, rollback } = this;
    this.servicePercentPrice = fullPrice - fullPrice * (rollback / 100);
  },
  screensValidation: function () {
    // console.log('input');
    const isNumber = (num) => !isNaN(parseFloat(num)) && isFinite(num) && !num.includes(' ');
    // if (event.target.tagName === 'SELECT') {
    //   if (event.target.value !== '') {
    //     event.target.setCustomValidity('Укажите тип экрана');
    //   } else {
    //     event.target.setCustomValidity('');
    //   }
    // }
    // if (event.target.tagName === 'INPUT') {
    //   if (isNumber(event.target.value) !== '') {
    //     event.target.setCustomValidity('Укажите количество экранов');
    //   } else {
    //     event.target.setCustomValidity('');
    //   }
    // }
    const alert = document.getElementById('alert');
    if (alert) alert.remove();
    const isValid = [...this.getScreens()].some((screen) => {
      const selectValue = screen.querySelector('select').value;
      const inputValue = screen.querySelector('input').value;
      return selectValue !== '' && isNumber(inputValue);
    });
    if (isValid) {
      startBtn.disabled = false;
    } else {
      const btnBlock = document.querySelector('.main-total__buttons');
      btnBlock.before(this.getAlert('Параметры экранов заданы не корректно'));
    }
  },
  isValidScreens: function () {
    return this.elements.screens.reduce((isValid, element) => {
      return element.checkValidity() && isValid;
    }, true);
  },

  getAlert: function (text) {
    const alert = document.createElement('small');
    alert.id = 'alert';
    alert.style.color = 'red';
    alert.style.textAlign = 'center';
    alert.style.margin = '5px';
    alert.textContent = text;
    return alert;
  },
  rollbackChange: function (event) {
    let value = event.target.value;
    this.rollback = +value;
    rangeValueElement.textContent = value + '%';

    if (this.isCalculated) {
      this.servicePercentPrice = this.fullPrice - this.fullPrice * (this.rollback / 100);
      inputTotalCountRollback.value = this.servicePercentPrice;
    }
  },

  logger: function () {
    console.log('screens: ', this.screens);
    console.log('services: ', this.services);
    console.log('allServicePrices:', this.allServicePrices);
    console.log('fullPrice: ', this.fullPrice);
    console.log(this.servicePercentPrice);
    console.log(this.elements);

    console.log(this);
  },
};

appData.init();

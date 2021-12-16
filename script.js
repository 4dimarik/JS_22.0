'use strict';

const DomElement = function (tag = 'div', selector = null, text = '', { ...css } = {}) {
  this.tag = tag;
  this.selector = selector;
  this.css = css;
  this.text = text;

  this.moveSize = 10;

  this.elementInDom = null;

  this.currentTop = 0;
  this.currentLeft = 0;

  this.atRightBorder = false;
  this.atBottomBorder = false;

  this.render = function () {
    const element = document.createElement(this.tag);

    if (this.selector[0] === '.') {
      element.classList.add(this.selector.substring(1));
    } else if (this.selector[0] === '#') {
      element.id = this.selector.substring(1);
    }

    const cssText = Object.keys(this.css).reduce((style, attr) => {
      style += `${attr}: ${this.css[attr]};`;
      return style;
    }, '');
    element.style.cssText = `${cssText}`;

    element.textContent = this.text;
    return element;
  };
  this.append = function (element) {
    element.append(this.render());
    this.elementInDom = this.getElementFromDom();
    this.getCurrentPosition();
  };

  this.getElementFromDom = function () {
    return document.querySelector(`${this.selector}`);
  };

  this.getCurrentPosition = function () {
    const { top: currentTop, left: currentLeft } = getComputedStyle(this.elementInDom);
    this.currentTop = +currentTop.substring(0, currentTop.length - 2);
    this.currentLeft = +currentLeft.substring(0, currentLeft.length - 2);

    const { offsetHeight, offsetWidth } = document.querySelector('body');

    this.atRightBorder =
      offsetWidth - this.currentLeft === this.elementInDom.offsetWidth ? true : false;
    this.atBottomBorder =
      offsetHeight - this.currentTop === this.elementInDom.offsetHeight ? true : false;

    console.log(this.atRightBorder, this.atBottomBorder);
  };

  this.setPosition = function (top, left) {
    this.elementInDom.style.top = `${top}px`;
    this.elementInDom.style.left = `${left}px`;
    this.getCurrentPosition();
  };
  this.setTop = function (top) {
    this.elementInDom.style.top = `${top}px`;
    this.getCurrentPosition();
  };
  this.setLeft = function (left) {
    this.elementInDom.style.left = `${left}px`;
    this.getCurrentPosition();
  };

  this.move = function (direction) {
    if (direction === 'up') {
      this.elementInDom.style.top = `${this.currentTop - this.moveSize}px`;
    } else if (direction === 'right') {
      this.elementInDom.style.left = `${this.currentLeft + this.moveSize}px`;
    } else if (direction === 'down') {
      this.elementInDom.style.top = `${this.currentTop + this.moveSize}px`;
    } else if (direction === 'left') {
      this.elementInDom.style.left = `${this.currentLeft - this.moveSize}px`;
    }
    this.getCurrentPosition();
  };
};

const div = new DomElement('div', '.block', 'Это DIV', {
  height: '100px',
  width: '100px',
  background: 'red',
  'font-size': '16px',
  color: 'white',
  'text-align': 'center',
  padding: '1rem 0 0 0',
  'box-sizing': 'border-box',
  position: 'absolute',
});

document.addEventListener('DOMContentLoaded', () => {
  div.append(document.querySelector('body'));
});

window.addEventListener('resize', () => {
  const { offsetHeight, offsetWidth } = document.querySelector('body');

  if (div.atRightBorder && div.currentLeft + div.elementInDom.offsetWidth !== offsetWidth)
    div.setLeft(offsetWidth - div.elementInDom.offsetWidth);

  if (div.atBottomBorder && div.currentTop + div.elementInDom.offsetHeight !== offsetHeight)
    div.setTop(offsetHeight - div.elementInDom.offsetHeight);
});

document.querySelector('body').addEventListener('keydown', function (event) {
  const { offsetHeight, offsetWidth } = event.target;
  const key = event.key;
  if (key === 'ArrowUp') {
    if (div.currentTop - div.moveSize <= 0) {
      div.setTop(0);
    } else {
      div.move('up');
    }
  } else if (key === 'ArrowDown') {
    if (div.currentTop + div.moveSize >= offsetHeight - div.elementInDom.offsetHeight) {
      div.setTop(offsetHeight - div.elementInDom.offsetHeight);
    } else {
      div.move('down');
    }
  } else if (key === 'ArrowRight') {
    if (div.currentLeft + div.moveSize >= offsetWidth - div.elementInDom.offsetWidth) {
      div.setLeft(offsetWidth - div.elementInDom.offsetWidth);
    } else {
      div.move('right');
    }
  } else if (key === 'ArrowLeft') {
    if (div.currentLeft - div.moveSize <= 0) {
      div.setLeft(0);
    } else {
      div.move('left');
    }
  }
});

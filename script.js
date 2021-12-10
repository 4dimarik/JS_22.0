'use strict';
const btn = document.getElementById('btn');
const range = document.getElementById('range');
const rangeSpan = document.getElementById('range-span');
const inputText = document.getElementById('text');
const square = document.getElementById('square');
const circle = document.getElementById('circle');
const eBtn = document.getElementById('e_btn');

btn.addEventListener('click', () => {
  let color = inputText.value.trim();
  if (color) square.style.backgroundColor = color;
});

eBtn.style.display = 'none';

rangeSpan.textContent = range.value;

range.addEventListener('change', (event) => {
  let value = event.target.value;
  rangeSpan.textContent = value;
  let circleSize = value + '%';
  circle.style.width = circleSize;
  circle.style.height = circleSize;
});

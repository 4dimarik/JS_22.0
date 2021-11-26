const title = 'My Project';
const screens = 'Простые, Сложные, Интерактивные';
const screenPrice = 500;
const rollback = 10;
const fullPrice = 50000;
const adaptive = true;

console.log(`var title: ${typeof title}`);
console.log(`var fullPrice: ${typeof fullPrice}`);
console.log(`var adaptive: ${typeof adaptive}`);

console.log(`var screens length: ${screens.length}`);

console.log(`Стоимость верстки экранов ${screenPrice} рублей`);
console.log(`Стоимость разработки сайта ${fullPrice} рублей`);

console.log(screens.toLowerCase().split(', '));

console.log(`Процент отката - ${fullPrice * (rollback / 100)}`);
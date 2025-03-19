import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration); // Расширяем dayjs плагином

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(num = 100) {
  return Math.floor(Math.random() * num) + 1;
}

function getDateFormat(dueDate, format) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}

//Функция для получения разницы времени
function getDiffTime(dateFromvalue, dateTovalue) {
  // Преобразуем входные значения в объекты dayjs
  const dateFrom = dayjs(`${dateFromvalue.replace(/\.\d+Z$/, '')}Z`);
  const dateTo = dayjs(`${dateTovalue.replace(/\.\d+Z$/, '')}Z`);

  // Вычисляем разницу в виде объекта duration
  const diff = dayjs.duration(dateTo.diff(dateFrom));

  // Извлекаем дни, часы и минуты
  const days = diff.days();
  const hours = diff.hours();
  const mins = diff.minutes();

  // Форматируем результат
  let result = '';

  if (days > 0) {
    result += `${String(days).padStart(2, '0')}D `;
  }
  if (hours > 0 || days > 0) {
    result += `${String(hours).padStart(2, '0')}H `;
  }
  result += `${String(mins).padStart(2, '0')}M`;
  return result.trim();
}

function updateItem(items, update){
  return items.map((item) => item.id === update.id ? update : item);
}

export {
  getRandomArrayElement,
  getRandomNumber,
  getDateFormat,
  getDiffTime,
  updateItem,
};

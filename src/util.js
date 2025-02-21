import dayjs from 'dayjs';

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
  const dateFrom = dayjs(`${dateFromvalue.replace(/\.\d+Z$/, '')}Z`);
  const dateTo = dayjs(`${dateTovalue.replace(/\.\d+Z$/, '')}Z`);

  const diffInMinutes = dateTo.diff(dateFrom, 'minute');

  const days = Math.floor(diffInMinutes / 1440); // 1440 минут в сутках
  const hours = Math.floor((diffInMinutes % 1440) / 60); // Оставшиеся часы
  const mins = diffInMinutes % 60; // Оставшиеся минуты

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

export {getRandomArrayElement, getRandomNumber, getDateFormat, getDiffTime};

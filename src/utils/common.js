import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function getDateFormat(dueDate, format) {
  const date = dueDate ? dayjs(dueDate).format(format) : '';
  return date;
}

//Функция для получения разницы времени
function getDiffTime(dateFromvalue, dateTovalue) {
  const dateFrom = dayjs(`${dateFromvalue.replace(/\.\d+Z$/, '')}Z`);
  const dateTo = dayjs(`${dateTovalue.replace(/\.\d+Z$/, '')}Z`);


  const diffMs = dateTo.diff(dateFrom);
  const diff = dayjs.duration(diffMs);

  const totalMinutes = Math.floor(diff.asMinutes());
  const totalDays = Math.floor(diff.asDays());

  const days = totalDays;
  const hours = Math.floor((totalMinutes - days * 24 * 60) / 60);
  const mins = totalMinutes % 60;

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

const generateRandomToken = () => {
  const authorizationToken = Math.random().toString(36).substring(2, 15) +
                      Math.random().toString(36).substring(2, 15);
  return btoa(authorizationToken); // Кодируем в base64
};

export {
  getDateFormat,
  getDiffTime,
  generateRandomToken,
};

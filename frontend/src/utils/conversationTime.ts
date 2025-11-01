import dayjs from 'dayjs';

export const getConversationTimeStatus = (time?: string): string => {
  if (!time) {
    return '';
  }
  const timestamp = dayjs(time);
  if (!timestamp.isValid()) {
    return '';
  }
  const now = dayjs();
  const diffInSeconds = now.diff(timestamp, 'second');
  const diffInMinutes = now.diff(timestamp, 'minute');
  const diffInHours = now.diff(timestamp, 'hour');
  const diffInDays = now.diff(timestamp, 'day');

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays === 1) {
    return 'Hôm qua';
  } else {
    return timestamp.format('DD/MM/YYYY');
  }
};

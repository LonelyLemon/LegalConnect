import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import i18n from 'i18next';

export const loadDateFnsLocale = () => {
  const primaryTag = i18n.language.split('-')[0];
  dayjs.locale(primaryTag); // Set dayjs locale
};

export const formatDate = (date: string, dateFormat?: string) => {
  return dayjs(date).format(dateFormat ?? 'MMM DD, YYYY');
};

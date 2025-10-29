// filepath: d:\Intern\React Native\Nagaco\src\i18n\i18n.ts
import * as RNLocalize from 'react-native-localize'; // Thay thế expo-localization
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';

import en, {Translations} from './en';
import vi from './vi';

// Cấu hình ngôn ngữ mới ở đây
const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

const supportedLngs = Object.keys(resources); // Ví dụ: ['en', 'vi']
const fallbackLng = 'en'; // Đảm bảo 'en' là một key trong resources của bạn

// Xác định ngôn ngữ và hướng RTL dựa trên cài đặt của thiết bị
const bestLanguageMatch = RNLocalize.findBestLanguageTag(supportedLngs);

const initialLng = bestLanguageMatch?.languageTag ?? fallbackLng;
export let isRTL = bestLanguageMatch?.isRTL ?? false;

// Cài đặt RTL cho ứng dụng. Điều này nên được thực hiện sớm nhất có thể.
// Kiểm tra để tránh gọi không cần thiết có thể gây reload
if (I18nManager.isRTL !== isRTL) {
  I18nManager.allowRTL(isRTL);
  // forceRTL sẽ bắt buộc hướng RTL và có thể reload ứng dụng.
  // Đảm bảo bạn hiểu rõ tác động của nó.
  I18nManager.forceRTL(isRTL);
}

export const initI18n = async () => {
  await i18n.use(initReactI18next).init({
    resources,
    lng: initialLng,
    fallbackLng: fallbackLng,
    interpolation: {
      escapeValue: false, // React đã làm điều này
    },
    react: {
      useSuspense: false, // Hoặc true nếu bạn muốn sử dụng Suspense cho translations
    },
  });

  return i18n;
};

/**
 * Builds up valid keypaths for translations.
 */

export type TxKeyPath = RecursiveKeyOf<Translations>;

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `${TKey}`,
    true
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `${TKey}`,
    false
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string,
  IsFirstLevel extends boolean,
> = TValue extends any[]
  ? Text
  : TValue extends object
  ? IsFirstLevel extends true
    ? Text | `${Text}.${RecursiveKeyOfInner<TValue>}` // Thay đổi từ ':' thành '.'
    : Text | `${Text}.${RecursiveKeyOfInner<TValue>}` // Giữ nguyên '.' cho các cấp độ sâu hơn
  : Text;

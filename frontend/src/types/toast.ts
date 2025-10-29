import Toast, { ToastShowParams } from 'react-native-toast-message';

type Message = string;

export const showSuccess = (
  text1: Message,
  text2?: Message,
  props?: Partial<ToastShowParams>,
) => Toast.show({ type: 'success', text1, text2, ...props });

export const showError = (
  text1: Message,
  text2?: Message,
  props?: Partial<ToastShowParams>,
) => Toast.show({ type: 'error', text1, text2, ...props });

export const showInfo = (
  text1: Message,
  text2?: Message,
  props?: Partial<ToastShowParams>,
) => Toast.show({ type: 'info', text1, text2, ...props });

export default Toast;

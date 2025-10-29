import { useAppTheme } from '../../../theme/theme.provider';
import Toast, {
  ErrorToast,
  InfoToast,
  SuccessToast,
  ToastConfig,
} from 'react-native-toast-message';
import * as styles from './styles';

export default function ToastContainer() {
  const { themed } = useAppTheme();

  const toastConfig: ToastConfig = {
    success: (props: any) => (
      <SuccessToast
        {...props}
        text1Style={themed(styles.textStyles)}
        text2Style={themed(styles.textStyles)}
        contentContainerStyle={themed(styles.containerStyle)}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        text1Style={themed(styles.textStyles)}
        text2Style={themed(styles.textStyles)}
        contentContainerStyle={themed(styles.containerStyle)}
      />
    ),
    info: (props: any) => (
      <InfoToast
        {...props}
        text1Style={themed(styles.textStyles)}
        text2Style={themed(styles.textStyles)}
        contentContainerStyle={themed(styles.containerStyle)}
      />
    ),
  };

  return <Toast config={toastConfig} />;
}

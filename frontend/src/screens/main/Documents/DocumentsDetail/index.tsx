import { ActivityIndicator, ScrollView, Text } from 'react-native';
import Header from '../../../../components/layout/header';
import { useAppTheme } from '../../../../theme/theme.provider';
import { useAppDispatch, useAppSelector } from '../../../../redux/hook';
import { useEffect } from 'react';
import { fetchDocumentById } from '../../../../stores/document.slice';
import { useRoute } from '@react-navigation/native';
import * as styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DocumentsDetail = () => {
  const { themed } = useAppTheme();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const document = useAppSelector((state: any) => state.document.documents);
  const isLoading = useAppSelector((state: any) => state.document.isLoading);
  const error = useAppSelector((state: any) => state.document.error);
  useEffect(() => {
    dispatch(fetchDocumentById(id));
  }, [dispatch, id, document]);
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <SafeAreaView style={themed(styles.container)} edges={['top', 'bottom']}>
      <Header title={document.title} showBackButton={true} />
      <ScrollView style={themed(styles.scrollView)}>
        <Text style={themed(styles.title)}>{document.title}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

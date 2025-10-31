import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../../theme/theme.provider';
import Header from '../../../../components/layout/header';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../redux/hook';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import { Alert } from 'react-native';
import {
  fetchDocuments,
  selectDocuments,
  selectIsLoading,
  deleteDoc,
} from '../../../../stores/document.slice';
import * as styles from './styles';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import { formatDate } from '../../../../utils/formatDate';
import CreateDocumentModal from '../CreateDocumentModal';
import { Document } from '../../../../types/document';

const Separator = () => <View style={{ height: moderateScale(12) }} />;
export default function DocumentListScreen() {
  const { themed, theme } = useAppTheme();
  const documents = useAppSelector(selectDocuments);
  const isLoading = useAppSelector(selectIsLoading);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const getDocuments = async () => {
    await dispatch(fetchDocuments());
    console.log('documents: ', documents);
  };
  useEffect(() => {
    getDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteDoc({ id }) as any);
            await getDocuments();
          },
        },
      ],
    );
  };

  const handleEdit = (item: Document) => {
    setEditingDocument(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDocument(null);
  };

  const handleModalSuccess = async () => {
    await getDocuments();
  };

  const renderDocumentItem = ({ item }: { item: any }) => (
    <View style={themed(styles.documentCard)}>
      <TouchableOpacity
        style={themed(styles.documentIconContainer)}
        onPress={() =>
          navigation.navigate('PdfViewer', {
            url: item.file_url,
            title: item.display_name,
          })
        }
      >
        <Ionicons
          name="document-text-outline"
          size={moderateScale(24)}
          color={themed(({ colors }) => colors.onSurfaceVariant)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={themed(styles.documentInfo)}
        onPress={() =>
          navigation.navigate('PdfViewer', {
            url: item.file_url,
            title: item.display_name,
          })
        }
      >
        <Text style={themed(styles.documentName)}>{item.display_name}</Text>
        <Text style={themed(styles.documentTime)}>
          {formatDate(item.created_at)}
        </Text>
      </TouchableOpacity>
      <View style={themed(styles.actionRow)}>
        <TouchableOpacity
          style={themed(styles.actionBtn)}
          onPress={() => handleEdit(item)}
        >
          <Icon
            name="create-outline"
            size={moderateScale(18)}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={themed(styles.actionBtn)}
          onPress={() => handleDelete(item.id)}
        >
          <Icon
            name="trash-outline"
            size={moderateScale(18)}
            color={theme.colors.error}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={themed(styles.container)} edges={['top', 'bottom']}>
      <Header title="Document List" />
      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={themed(styles.listContent)}
        ItemSeparatorComponent={Separator}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getDocuments} />
        }
      />
      <CreateDocumentModal
        visible={showModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        document={editingDocument}
      />
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import FilePicker, { File } from '../../../../components/common/filePicker';
import { showError, showSuccess } from '../../../../types/toast';
import * as styles from './styles';
import { useAppDispatch } from '../../../../redux/hook';
import { addDocument } from '../../../../stores/document.slice';

interface CreateDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateDocumentModal(props: CreateDocumentModalProps) {
  const { visible, onClose, onSuccess } = props;
  const { themed, theme } = useAppTheme();
  const [displayName, setDisplayName] = useState('');
  const [file, setFileState] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const validateForm = () => {
    if (!displayName.trim()) {
      setError('Display name is required');
      return false;
    }
    if (displayName.length > 255 || displayName.length < 1) {
      setError('Display name must be 1-255 characters');
      return false;
    }
    if (!file) {
      setError('Please select a PDF file');
      return false;
    }
    if (!file.type || !file.type.includes('pdf')) {
      setError('Only PDF files are allowed');
      return false;
    }
    setError(null);
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm() || !file) return;
    setLoading(true);
    setError(null);
    try {
      dispatch(addDocument({ title: displayName, document: file }));
      showSuccess('Document created successfully!');
      setDisplayName('');
      setFileState(null);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        'Error uploading document';
      showError('Upload failed', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setDisplayName('');
    setFileState(null);
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={themed(styles.modalOverlay)}>
        <View style={themed(styles.modalBox)}>
          <Text style={themed(styles.modalTitle)}>Create a new document</Text>
          <Text style={themed(styles.fieldLabel)}>Display Name *</Text>
          <TextInput
            placeholder="Enter document name"
            value={displayName}
            onChangeText={setDisplayName}
            style={themed(styles.input)}
            maxLength={255}
            placeholderTextColor={theme.colors.outline}
          />
          <FilePicker
            fileType="file"
            value={file}
            onChange={v => setFileState(v as File | null)}
            label="PDF Document *"
            required
            error={error && !file ? error : undefined}
          />
          {error && <Text style={themed(styles.errorText)}>{error}</Text>}
          <View style={themed(styles.buttonRow)}>
            <TouchableOpacity
              onPress={resetAndClose}
              style={themed(styles.cancelButton)}
            >
              <Text style={themed(styles.cancelButtonText)}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSubmit}
              style={themed(styles.submitBtn)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  color={theme.colors.onPrimary}
                  size="small"
                />
              ) : (
                <Text style={themed(styles.submitBtnText)}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

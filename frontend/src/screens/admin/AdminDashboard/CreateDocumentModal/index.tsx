import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import FilePicker, {
  File as PickedFile,
} from '../../../../components/common/filePicker';
import { showError, showSuccess } from '../../../../types/toast';
import * as styles from './styles';
import { useAppDispatch } from '../../../../redux/hook';
import { addDocument, updateDoc } from '../../../../stores/document.slice';
import { Document } from '../../../../types/document';

interface CreateDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  document?: Document | null; // Document để edit (nếu có)
}

export default function CreateDocumentModal(props: CreateDocumentModalProps) {
  const { visible, onClose, onSuccess, document } = props;
  const { themed, theme } = useAppTheme();
  const isEditMode = !!document;

  const [displayName, setDisplayName] = useState('');
  const [file, setFileState] = useState<PickedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Prefill form khi edit
  useEffect(() => {
    if (document) {
      setDisplayName(document.display_name || '');
      // File không cần set vì đã có trên server
    } else {
      setDisplayName('');
      setFileState(null);
    }
    setError(null);
  }, [document, visible]);
  const validateForm = () => {
    if (!displayName.trim()) {
      setError('Display name is required');
      return false;
    }
    if (displayName.length > 255 || displayName.length < 1) {
      setError('Display name must be 1-255 characters');
      return false;
    }

    // Khi tạo mới: bắt buộc phải có file
    // Khi edit: file là optional (nếu không đổi file thì giữ nguyên)
    if (!isEditMode && !file) {
      setError('Please select a PDF file');
      return false;
    }

    // Nếu có chọn file mới thì validate
    if (file && file.type && !file.type.includes('pdf')) {
      setError('Only PDF files are allowed');
      return false;
    }

    setError(null);
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && document) {
        // Edit mode: update document
        await dispatch(
          updateDoc({
            id: document.id,
            title: displayName,
            document: file ? (file as unknown as File) : undefined, // Chỉ gửi file nếu có chọn file mới
          }),
        ).unwrap();
        showSuccess('Document updated successfully!');
      } else {
        // Create mode: add new document
        if (!file) {
          setError('Please select a PDF file');
          return;
        }
        await dispatch(
          addDocument({ title: displayName, document: file }),
        ).unwrap();
        showSuccess('Document created successfully!');
      }

      setDisplayName('');
      setFileState(null);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        `Error ${isEditMode ? 'updating' : 'uploading'} document`;
      showError(`${isEditMode ? 'Update' : 'Upload'} failed`, message);
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
          <Text style={themed(styles.modalTitle)}>
            {isEditMode ? 'Edit document' : 'Create a new document'}
          </Text>

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
            onChange={v => setFileState(v as PickedFile | null)}
            label={`PDF Document ${
              isEditMode ? '(Optional - leave empty to keep current file)' : '*'
            }`}
            required={!isEditMode}
            error={error && !file && !isEditMode ? error : undefined}
          />

          {isEditMode && document?.file_url && !file && (
            <Text style={themed(styles.fieldLabel)}>
              Current file: {document.original_filename || 'Document.pdf'}
            </Text>
          )}

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
                <Text style={themed(styles.submitBtnText)}>
                  {isEditMode ? 'Update' : 'Submit'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

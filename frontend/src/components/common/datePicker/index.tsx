import { useAppTheme } from '../../../theme/theme.provider';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import * as styles from './styles';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  label: string;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
}

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  label,
  error,
  minimumDate,
  maximumDate,
  disabled = false,
}: DatePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const { themed } = useAppTheme();

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false); // Luôn ẩn picker sau khi chọn
    if (event.type === 'set' && selectedDate) {
      // Chỉ cập nhật khi người dùng xác nhận
      onChange(selectedDate);
    }
  };

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) {
      return placeholder;
    }
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return new Date(date).toISOString().split('T')[0];
  };

  const getDisplayDate = () => {
    if (!value) {
      return placeholder;
    }
    return formatDate(value);
  };

  return (
    <View style={themed(styles.container)}>
      <Text style={themed(styles.fieldName)}>{label}</Text>
      <TouchableOpacity
        style={[
          themed(styles.input),
          error && themed(styles.inputError),
          disabled && themed(styles.inputDisabled),
        ]}
        onPress={() => setShowPicker(true)}
        disabled={disabled}
      >
        <Text
          style={[
            themed(styles.dateText),
            disabled && themed(styles.dateTextDisabled),
          ]}
        >
          {getDisplayDate()}
        </Text>
        {/* <Icon name="calendar-outline" size={20} color="#666" /> */}
      </TouchableOpacity>
      {error && (
        <Text style={themed(styles.errorText)}>
          {error || 'Trường này là bắt buộc.'}
        </Text>
      )}

      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DatePicker;

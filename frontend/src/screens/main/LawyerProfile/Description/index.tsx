import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import * as styles from '../styles';
import { Lawyer } from '../../../../types/lawyer';

const Description = ({ lawyer }: { lawyer: Lawyer }) => {
  const { themed } = useAppTheme();
  return (
    <View style={themed(styles.content)}>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Name:</Text>
        <Text style={themed(styles.infoValue)}>
          {lawyer?.display_name || '-'}
        </Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Experience:</Text>
        <Text style={themed(styles.infoValue)}>
          {lawyer?.years_of_experience != null
            ? `${lawyer.years_of_experience} years`
            : '-'}
        </Text>
      </View>
      {!!lawyer?.office_address && (
        <View style={themed(styles.infoSection)}>
          <Text style={themed(styles.infoLabel)}>Province:</Text>
          <Text style={themed(styles.infoValue)}>{lawyer.office_address}</Text>
        </View>
      )}

      {!!lawyer?.education && (
        <View style={themed(styles.paragraphSection)}>
          <Text style={themed(styles.paragraphTitle)}>
            Professional Summary
          </Text>
          <Text style={themed(styles.paragraphText)}>{lawyer.education}</Text>
        </View>
      )}
    </View>
  );
};

export default Description;

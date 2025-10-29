import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import * as styles from '../styles';
import { getLawyerById } from '../../../../services/lawyer';
import { Lawyer } from '../../../../types/lawyer';

const Description = ({ lawyerId }: { lawyerId: number }) => {
  const { themed } = useAppTheme();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await getLawyerById(lawyerId);
        if (isMounted) setLawyer(data);
      } catch (e) {
        // noop
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [lawyerId]);

  return (
    <View style={themed(styles.content)}>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Name:</Text>
        <Text style={themed(styles.infoValue)}>{lawyer?.name || '-'}</Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Experience:</Text>
        <Text style={themed(styles.infoValue)}>
          {lawyer?.years_experience != null
            ? `${lawyer.years_experience} years`
            : '-'}
        </Text>
      </View>
      {!!lawyer?.province && (
        <View style={themed(styles.infoSection)}>
          <Text style={themed(styles.infoLabel)}>Province:</Text>
          <Text style={themed(styles.infoValue)}>{lawyer.province}</Text>
        </View>
      )}

      {!!lawyer?.bio && (
        <View style={themed(styles.paragraphSection)}>
          <Text style={themed(styles.paragraphTitle)}>
            Professional Summary
          </Text>
          <Text style={themed(styles.paragraphText)}>{lawyer.bio}</Text>
        </View>
      )}
    </View>
  );
};

export default Description;

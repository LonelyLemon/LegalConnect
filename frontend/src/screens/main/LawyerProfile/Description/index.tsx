import { Text, View } from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import * as styles from '../styles';
const Description = () => {
  const { themed } = useAppTheme();
  return (
    <View style={themed(styles.content)}>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Name:</Text>
        <Text style={themed(styles.infoValue)}>Akhil Mirza</Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Title:</Text>
        <Text style={themed(styles.infoValue)}>Senior Corporate Lawyer</Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Law Firm:</Text>
        <Text style={themed(styles.infoValue)}>
          Akhil Mirza & Partners Legal Consultancy
        </Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Experience:</Text>
        <Text style={themed(styles.infoValue)}>
          10+ years in Corporate and Commercial Law
        </Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Email:</Text>
        <Text style={themed(styles.infoValue)}>
          akhilmirza.lawfirm@gmail.com
        </Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Phone:</Text>
        <Text style={themed(styles.infoValue)}>+84 912 456 789</Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Office Address:</Text>
        <Text style={themed(styles.infoValue)}>
          25 Nguyen Du Street, District 1, Ho Chi Minh City, Vietnam
        </Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Website:</Text>
        <Text style={themed(styles.infoValue)}>www.akhilmirzalaw.com</Text>
      </View>
      <View style={themed(styles.infoSection)}>
        <Text style={themed(styles.infoLabel)}>Languages:</Text>
        <Text style={themed(styles.infoValue)}>Vietnamese, English</Text>
      </View>

      <View style={themed(styles.paragraphSection)}>
        <Text style={themed(styles.paragraphTitle)}>Professional Summary</Text>
        <Text style={themed(styles.paragraphText)}>
          Akhil Mirza is a dedicated legal professional with over a decade of
          experience in corporate, commercial, and business law. She specializes
          in contracts, mergers, acquisitions, and corporate governance,
          ensuring clients receive comprehensive legal guidance while
          maintaining the highest standards of ethical practice.
        </Text>
      </View>

      <View style={themed(styles.paragraphSection)}>
        <Text style={themed(styles.paragraphTitle)}>Approach to Law</Text>
        <Text style={themed(styles.paragraphText)}>
          Her client-centric approach focuses on tailored legal strategies that
          align with long-term business growth. With strong negotiation and
          communication skills, she ensures precise, transparent, and timely
          legal guidance that empowers clients to make informed decisions.
        </Text>
      </View>

      <View style={themed(styles.paragraphSection)}>
        <Text style={themed(styles.paragraphTitle)}>Community Involvement</Text>
        <Text style={themed(styles.paragraphText)}>
          Passionate about promoting legal literacy and empowering young
          professionals, she actively participates in workshops and legal aid
          programs to make legal services accessible. Her mission is to help
          clients navigate complex legal challenges with confidence and
          integrity.
        </Text>
      </View>
    </View>
  );
};

export default Description;

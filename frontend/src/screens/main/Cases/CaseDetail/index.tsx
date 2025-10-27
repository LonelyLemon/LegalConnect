import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../../components/layout/header';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import * as styles from './styles';

export const CaseDetail = () => {
  const { themed } = useAppTheme();

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header title="CV-2025-0123" showBackButton={true} />
      <ScrollView
        style={themed(styles.scrollView)}
        contentContainerStyle={themed(styles.scrollContent)}
      >
        <Text style={themed(styles.caseTitle)}>Smith vs. Johnson Inc</Text>

        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>Description</Text>
          <Text style={themed(styles.descriptionText)}>
            I need to hire a lawyer for my wrongful termination case. My former
            employer, Johnson Inc, fired me me just two weeks after I reported
            several safety violations. I had no prior disciplinary issues and
            had always received excellent performance reviews. They told me my
            termination was part of a "restructuring," but no one else in my
            department was let go. I believe they fired me because I spoke up,
            and now I need legal help to get my job back and recover my lost
            wages and emotional distress.
          </Text>
        </View>

        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>Contact information</Text>
          <Text style={themed(styles.contactText)}>Victim: John Smith</Text>
          <Text style={themed(styles.contactText)}>
            Phone number: +1 (555) 123-4567
          </Text>
          <Text style={themed(styles.contactText)}>
            Email: johnsmith@gmail.com
          </Text>
        </View>

        <Pressable style={themed(styles.requestButton)}>
          <Text style={themed(styles.requestButtonText)}>
            Request case file
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

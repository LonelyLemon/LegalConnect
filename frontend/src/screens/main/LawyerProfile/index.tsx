import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';

type TabType = 'description' | 'review' | 'cases';

export default function LawyerProfileScreen() {
  const { themed } = useAppTheme();
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'review', label: 'Review (30)' },
    { key: 'cases', label: 'Featured cases' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <View style={themed(styles.content)}>
            <View style={themed(styles.infoSection)}>
              <Text style={themed(styles.infoLabel)}>Name:</Text>
              <Text style={themed(styles.infoValue)}>Akhil Mirza</Text>
            </View>
            <View style={themed(styles.infoSection)}>
              <Text style={themed(styles.infoLabel)}>Title:</Text>
              <Text style={themed(styles.infoValue)}>
                Senior Corporate Lawyer
              </Text>
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
              <Text style={themed(styles.infoValue)}>
                www.akhilmirzalaw.com
              </Text>
            </View>
            <View style={themed(styles.infoSection)}>
              <Text style={themed(styles.infoLabel)}>Languages:</Text>
              <Text style={themed(styles.infoValue)}>Vietnamese, English</Text>
            </View>

            <View style={themed(styles.paragraphSection)}>
              <Text style={themed(styles.paragraphTitle)}>
                Professional Summary
              </Text>
              <Text style={themed(styles.paragraphText)}>
                Akhil Mirza is a dedicated legal professional with over a decade
                of experience in corporate, commercial, and business law. She
                specializes in contracts, mergers, acquisitions, and corporate
                governance, ensuring clients receive comprehensive legal
                guidance while maintaining the highest standards of ethical
                practice.
              </Text>
            </View>

            <View style={themed(styles.paragraphSection)}>
              <Text style={themed(styles.paragraphTitle)}>Approach to Law</Text>
              <Text style={themed(styles.paragraphText)}>
                Her client-centric approach focuses on tailored legal strategies
                that align with long-term business growth. With strong
                negotiation and communication skills, she ensures precise,
                transparent, and timely legal guidance that empowers clients to
                make informed decisions.
              </Text>
            </View>

            <View style={themed(styles.paragraphSection)}>
              <Text style={themed(styles.paragraphTitle)}>
                Community Involvement
              </Text>
              <Text style={themed(styles.paragraphText)}>
                Passionate about promoting legal literacy and empowering young
                professionals, she actively participates in workshops and legal
                aid programs to make legal services accessible. Her mission is
                to help clients navigate complex legal challenges with
                confidence and integrity.
              </Text>
            </View>
          </View>
        );
      case 'review':
        return (
          <View style={themed(styles.content)}>
            <Text style={themed(styles.placeholderText)}>
              Reviews will be displayed here
            </Text>
          </View>
        );
      case 'cases':
        return (
          <View style={themed(styles.content)}>
            <Text style={themed(styles.placeholderText)}>
              Featured cases will be displayed here
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <View style={themed(styles.header)}>
        <TouchableOpacity style={themed(styles.backButton)}>
          <Text style={themed(styles.backIcon)}>←</Text>
        </TouchableOpacity>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop',
          }}
          style={themed(styles.avatar)}
        />
        <Text style={themed(styles.name)}>Akhil Mirza</Text>
        <Text style={themed(styles.tagline)}>
          Willing to change the world with the power of knowledge.
        </Text>

        <View style={themed(styles.statsContainer)}>
          <View style={themed(styles.statItem)}>
            <Text style={themed(styles.statValue)}>4.8 ★</Text>
            <Text style={themed(styles.statLabel)}>Customer reviews</Text>
          </View>
          <View style={themed(styles.statItem)}>
            <Text style={themed(styles.statValue)}>48</Text>
            <Text style={themed(styles.statLabel)}>Successful cases</Text>
          </View>
          <View style={themed(styles.statItem)}>
            <Text style={themed(styles.statValue)}>15</Text>
            <Text style={themed(styles.statLabel)}>Years of experience</Text>
          </View>
        </View>

        <TouchableOpacity style={themed(styles.editButton)}>
          <Text style={themed(styles.editButtonText)}>Edit Profile</Text>
          <Text style={themed(styles.editIcon)}>✏️</Text>
        </TouchableOpacity>
      </View>

      <View style={themed(styles.tabContainer)}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={themed(styles.tab(activeTab === tab.key))}
            onPress={() => setActiveTab(tab.key as TabType)}
          >
            <Text style={themed(styles.tabText(activeTab === tab.key))}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={themed(styles.scrollContainer)}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

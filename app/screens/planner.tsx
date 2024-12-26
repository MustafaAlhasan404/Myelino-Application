import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import PlanOptions from '@/components/Scroll';
import { Plan } from '@/components/Plan';
import Timeline from '@/components/PlannedDate';
import SearchBar from '@/components/SearchBar';
import SavedEventsComponent from '@/components/savedEvents';

const Header = React.memo(({ onBack, topInset }: { onBack: () => void; topInset: number }) => {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  return (
    <View>
      <View style={[styles.header, { marginTop: topInset }]}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={onBack}
          hitSlop={{
            top: 40,
            bottom: 40,
            left: 40,
            right: 40,
          }}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planner</Text>
      </View>
      <View style={styles.greetingContainer}>
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.greetingText}>{greeting}</Text>
      </View>
      <SearchBar />
      <Text style={styles.planText}>Plan</Text>
    </View>
  );
});

const PlannerScreen = React.memo(() => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, []);

  const handleBack = useCallback(() => {
    // Not Optimal But Given the Back Option Button and Since it the only previous screen
    // router.push('/');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.staticContent}>
        <Header onBack={handleBack} topInset={top} />
        <PlanOptions />
      </View>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <SavedEventsComponent />
        <View style={styles.planSection}>
          <Plan />
        </View>
        <View style={styles.timelineSection}>
          <Timeline />
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  staticContent: {
    backgroundColor: '#FFF',
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  planSection: {
    paddingBottom: 10,
  },
  timelineSection: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  circleButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'RobotoBold',
    color: '#000',
  },
  greetingContainer: {
    marginLeft: 25,
    marginVertical: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#151718',
    fontFamily: 'RobotoBold',
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    fontFamily: 'RobotoBold',
  },
  planText: {
    marginTop: 10,
    marginLeft: 25,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'RobotoBold',
  },
});

export default PlannerScreen;

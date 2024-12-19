import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import PlanOptions from '@/components/Scroll';
import { Plan } from '@/components/Plan';
import Timeline from '@/components/PlannedDate';

const Header = React.memo(({ onBack, topInset }: { onBack: () => void; topInset: number }) => (
  <View>
    <View style={[styles.header, { marginTop: topInset }]}>
      <TouchableOpacity 
        style={styles.circleButton}
        onPress={onBack}
        hitSlop={{
          top: 40, bottom: 40, left: 40, right: 40
        }}
      >
        <Ionicons name="chevron-back-outline" size={24} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Planner</Text>
    </View>
    <Text style={styles.plantText}>Plan</Text>
  </View>
));

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
      <Header onBack={handleBack} topInset={top} />
      <PlanOptions />
      <View style={styles.planSection}>
        <Plan />
      </View>
      <View style={styles.timelineSection}>
        <Timeline />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  planSection: {
    flex: 0.325,
  },
  timelineSection: {
    flex: 0.725,
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
  plantText: {
    marginLeft: 25,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'RobotoBold',
  },
});

export default PlannerScreen;

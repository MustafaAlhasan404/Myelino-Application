import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import PlanOptions from '@/components/Scroll';
import { QuickPlan } from '@/components/QuickPlanExpiration';
import { usePlanStore } from '@/services/planStore';

interface GroupedPlans {
  [key: number]: any[];
}

const Header = ({ onBack, topInset }: { onBack: () => void; topInset: number }) => (
  <View>
    <View style={[styles.header, { marginTop: topInset }]}>
      <TouchableOpacity 
        style={styles.circleButton} 
        onPress={onBack}
        hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
      >
        <Ionicons name="chevron-back-outline" size={24} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Quick Plans</Text>
    </View>
    <Text style={styles.plantText}>Plan {'>'} Quick Plans</Text>
  </View>
);

export default function QuickPlansScreen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const { plans, fetchPlans } = usePlanStore();
  const [uniqueExpiryDays, setUniqueExpiryDays] = useState<number[]>([]);

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
    fetchPlans();
  }, []);

  useEffect(() => {
    if (plans.length > 0) {
      const today = new Date();
      
      // Calculate expiry days for each plan and get unique values
      const expiryDays = plans
        .map(plan => {
          const planDate = new Date(plan.date);
          const diffTime = planDate.getTime() - today.getTime();
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        })
        .filter(days => days > 0) // Only include future dates
        .sort((a, b) => a - b); // Sort in ascending order

      // Remove duplicates
      const uniqueDays = [...new Set(expiryDays)];
      setUniqueExpiryDays(uniqueDays);
    }
  }, [plans]);
  
  const handleBack = () => {
    router.push('/screens/planner');
  };

  return (
    <View style={styles.container}>
      <Header onBack={handleBack} topInset={top} />
      <PlanOptions />
      <ScrollView 
        style={styles.planSection}
        showsVerticalScrollIndicator={false}
      >
        {uniqueExpiryDays.map((days) => (
          <QuickPlan 
            key={days}
            expiresIn={days}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  planSection: {
    flex: 1,
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

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ImageSourcePropType, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlanStore } from '@/services/planStore';

type IconName = keyof typeof Ionicons.glyphMap;

interface Event {
  id: string;
  name: string;
  icon: IconName;
  type: 'activity' | 'cost';
}

const formatTitle = (title: string): string => {
  return title
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ExpirationAlert = ({ days }: { days: number }) => (
  <View style={styles.alertContainer}>
    <View style={styles.alertIconContainer}>
      <View style={styles.alertOuterCircle}>
        <View style={styles.alertInnerCircle} />
      </View>
    </View>
    <Text style={styles.alertText}>Expires in {days} {days === 1 ? 'day' : 'days'}!</Text>
  </View>
);

const IconGroup = ({ icons, type }: { icons: Event[]; type: 'activity' | 'cost' }) => (
  <View style={styles.iconGroup}>
    {icons.filter(event => event.type === type).map((event) => (
      <Ionicons key={event.id} name={event.icon} size={18} color="#666" />
    ))}
  </View>
);

const PlanCard = ({ title, events, image, onPress }: {
  title: string;
  events: Event[];
  image: ImageSourcePropType;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.planCard} onPress={onPress}>
    <Image source={image} style={styles.planImage} />
    <View style={styles.planDetails}>
      <Text style={styles.planTitle}>{title}</Text>
      <View style={styles.iconContainer}>
        <IconGroup icons={events} type="activity" />
        <IconGroup icons={events} type="cost" />
      </View>
    </View>
  </TouchableOpacity>
);

export const QuickPlan = ({ expiresIn }: { expiresIn: number }) => {
  const { plans, deletePlan } = usePlanStore();

  const getPlansForExpiryDay = () => {
    const today = new Date();
    return plans.filter(plan => {
      const planDate = new Date(plan.date);
      const diffTime = planDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return daysDiff === expiresIn && plan.plan === "Quick";
    });
  };

  const quickPlansForThisDate = getPlansForExpiryDay();

  const handleDeletePlan = (planId: string) => {
    Alert.alert(
      "Delete Plan",
      "Are you sure you want to delete this plan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deletePlan(planId)
        }
      ]
    );
  };

  if (quickPlansForThisDate.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ExpirationAlert days={expiresIn} />
      <View style={styles.plansContainer}>
        {quickPlansForThisDate.map((plan) => (
          <PlanCard 
            key={plan._id}
            title={formatTitle(plan.plan)}
            events={[
              { id: '1', name: 'Friends', icon: 'heart', type: 'activity' },
              { id: '2', name: 'Gym', icon: 'fitness', type: 'activity' },
              { id: '3', name: 'Cost', icon: 'cash-outline', type: 'cost' },
            ]}
            image={{ uri: plan.place?.photos[0]?.url || plan.myelin?.file?.url }}
            onPress={() => handleDeletePlan(plan._id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: -12,
    paddingVertical: 8,
    gap: 8,
  },
  alertIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertOuterCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 12,
    backgroundColor: '#FF0000',
  },
  alertText: {
    fontSize: 18,
    color: '#FF0000',
    fontFamily: 'RobotoMedium',
  },
  plansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 12,
    justifyContent: 'space-between',
  },
  planCard: {
    width: '48%',
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  planDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  planTitle: {
    fontSize: 16,
    fontFamily: 'RobotoBold',
    color: '#FFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 4,
    borderRadius: 12,
  }
});

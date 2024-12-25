import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ImageSourcePropType, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlanStore } from '@/services/planStore';

type IconName = keyof typeof Ionicons.glyphMap;

interface Event {
  id: string;
  name: string;
  icon: IconName;
  type: 'activity' | 'cost';
}

interface PlanType {
  id: string;
  title: string;
  events: Event[];
  image: ImageSourcePropType;
  expiryDays: number;
  planType: string;
  date: Date;
}

interface GroupedPlans {
  [key: string]: PlanType[];
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
    <Text style={styles.alertText}>Next plan expires in {days} {days === 1 ? 'day' : 'days'}!</Text>
  </View>
);

const IconGroup = ({ icons, type }: { icons: Event[]; type: 'activity' | 'cost' }) => (
  <View style={styles.iconGroup}>
    {icons.filter(event => event.type === type).map((event) => (
      <View key={event.id} style={styles.iconWithLabel}>
        <Ionicons name={event.icon} size={18} color="#666" />
        <Text style={styles.iconLabel}>{event.name}</Text>
      </View>
    ))}
  </View>
);

const PlanCard = ({ title, events, image, onPress, isPlaceholder }: {
  title: string;
  events: Event[];
  image?: ImageSourcePropType;
  onPress?: () => void;
  isPlaceholder?: boolean;
}) => {
  if (isPlaceholder) {
    return (
      <TouchableOpacity style={[styles.planCard, styles.placeholderCard]} onPress={onPress}>
        <View style={styles.seeMoreCircle}>
          <Ionicons name="arrow-forward" size={18} color="#666666" />
        </View>
        <Text style={styles.placeholderText}>See all</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.planCard} onPress={onPress}>
      <Image source={image!} style={styles.planImage} />
      <View style={styles.planDetails}>
        <Text style={styles.planTitle}>{title}</Text>
        <View style={styles.iconContainer}>
          <IconGroup icons={events} type="activity" />
          <IconGroup icons={events} type="cost" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MonthSection = ({ month, plans, onDeletePlan }: {
  month: string;
  plans: PlanType[];
  onDeletePlan: (id: string) => void;
}) => (
  <View style={styles.monthSection}>
    <Text style={styles.monthTitle}>{month}</Text>
    <View style={styles.monthPlansContainer}>
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          title={plan.title}
          events={plan.events}
          image={plan.image}
          onPress={() => onDeletePlan(plan.id)}
        />
      ))}
    </View>
  </View>
);

const AllPlansModal = ({ visible, onClose, groupedPlans, onDeletePlan }: {
  visible: boolean;
  onClose: () => void;
  groupedPlans: GroupedPlans;
  onDeletePlan: (id: string) => void;
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>All Plans</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {Object.entries(groupedPlans).map(([month, plans]) => (
            <MonthSection
              key={month}
              month={month}
              plans={plans}
              onDeletePlan={onDeletePlan}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const groupPlansByMonth = (plans: PlanType[]): GroupedPlans => {
  return plans.reduce((groups, plan) => {
    const monthYear = new Date(plan.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(plan);
    return groups;
  }, {} as GroupedPlans);
};

export const Plan = () => {
  const { plans, isLoading, fetchPlans, deletePlan } = usePlanStore();
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    fetchPlans();
  }, []);

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

  const getProcessedPlans = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return plans
      .map(plan => {
        const expiryDate = new Date(plan.date);
        expiryDate.setHours(0, 0, 0, 0);
        const diffTime = expiryDate.getTime() - today.getTime();
        const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          id: plan._id,
          title: formatTitle(plan.plan),
          expiryDays: daysUntilExpiry,
          planType: plan.plan,
          date: expiryDate,
          events: plan.events || [],
          image: { 
            uri: plan.place?.photos[0]?.url || 
                 plan.myelin?.file?.thumbnailUrl || 
                 plan.myelin?.file?.url 
          },
        } as PlanType;
      })
      .filter(plan => plan.expiryDays > 0)
      .sort((a, b) => a.expiryDays - b.expiryDays);
  };

  const allPlans = getProcessedPlans();
  const upcomingPlans = allPlans.filter(plan => plan.expiryDays <= 30).slice(0, 2);
  const groupedPlans = groupPlansByMonth(allPlans);
  const nearestExpiryDays = upcomingPlans[0]?.expiryDays || 0;

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {upcomingPlans.length > 0 && <ExpirationAlert days={nearestExpiryDays} />}
      <View style={styles.plansContainer}>
        {upcomingPlans.map((plan) => (
          <PlanCard 
            key={plan.id}
            title={plan.title}
            events={plan.events}
            image={plan.image}
            onPress={() => handleDeletePlan(plan.id)}
          />
        ))}
        {allPlans.length > 2 && (
          <PlanCard 
            title="" 
            events={[]} 
            isPlaceholder 
            onPress={() => setModalVisible(true)} 
          />
        )}
      </View>
      <AllPlansModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        groupedPlans={groupedPlans}
        onDeletePlan={handleDeletePlan}
      />
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
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 12,
  },
  planCard: {
    width: 150,
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
  },
  placeholderCard: {
    right: 5,
    width: '22.5%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    flexDirection: 'column',
    gap: 4
  },
  seeMoreCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'RobotoLight',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 25,
    paddingHorizontal: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'RobotoBold',
  },
  modalPlansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  monthSection: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: 'RobotoBold',
    marginBottom: 12,
  },
  monthPlansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'RobotoRegular',
  }
});

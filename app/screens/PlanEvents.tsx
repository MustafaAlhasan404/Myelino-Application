import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlanStore } from '@/services/planStore';
import { planService } from '@/services/planService';

const Header = ({ title, onBack, topInset }: { title: string; onBack: () => void; topInset: number }) => (
  <View>
    <View style={[styles.header, { marginTop: topInset }]}>
      <TouchableOpacity
        style={[styles.circleButton, { zIndex: 1 }]}
        onPress={onBack}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back-outline" size={24} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
    <Text style={styles.plantText}>Plan {'>'} {title}</Text>
  </View>
);

const IconGroup = ({ likes, amount }: { likes: number; amount: number }) => (
  <View style={styles.iconContainer}>
    <View style={styles.iconGroup}>
      <Ionicons name="people" size={18} color="#666" />
      <Text style={styles.iconText}>{likes}</Text>
    </View>
    <View style={styles.iconGroup}>
      <Ionicons name="cash-outline" size={18} color="#666" />
      <Text style={styles.iconText}>{amount}</Text>
    </View>
  </View>
);

const formatTitle = (title: string): string => {
  return title
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const PlanCard = ({ image, likes, amount, title, planId, onDelete }: { 
  image: string; 
  likes: number;
  amount: number;
  title: string;
  planId: string;
  onDelete: () => void;
}) => {
  const handlePress = () => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await planService.deleteEvent(planId);
              onDelete();
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete event");
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.planCard} onPress={handlePress}>
      <Image source={{ uri: image }} style={styles.planImage} />
      <View style={styles.planDetails}>
        <Text style={styles.planTitle}>{title}</Text>
        <IconGroup likes={likes} amount={amount} />
      </View>
    </TouchableOpacity>
  );
};

const PlanEvents = () => {
  const { top } = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { plans, fetchPlans } = usePlanStore();

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleDelete = () => {
    fetchPlans();
  };

  const currentPlan = plans.find(p => p._id === id);
  const media = plans
    .filter(plan => 
      plan.plan === currentPlan?.plan && 
      new Date(plan.date).toISOString().split('T')[0] === new Date(currentPlan?.date).toISOString().split('T')[0]
    )
    .flatMap(plan => [
      ...(plan.place?.photos || []).map(photo => ({
        url: photo.url,
        title: plan.place?.placeName?.title || '',
        likes: plan.myelin?.likes?.length || 0,
        amount: plan.myelin?.amountPaid || 0,
        id: plan._id
      })),
      ...(plan.myelin?.file ? [{
        url: plan.myelin.file.thumbnailUrl || plan.myelin.file.url,
        title: plan.myelin?.placeName?.title || '',
        likes: plan.myelin?.likes?.length || 0,
        amount: plan.myelin?.amountPaid || 0,
        id: plan._id
      }] : [])
    ]);

  return (
    <View style={styles.container}>
      <Header 
        title={currentPlan ? formatTitle(currentPlan.plan) : ''} 
        onBack={handleBack} 
        topInset={top} 
      />
      <View style={styles.plansContainer}>
        {media.map((item, index) => (
          <PlanCard
            key={index}
            image={item.url}
            title={item.title}
            likes={item.likes}
            amount={item.amount}
            planId={item.id}
            onDelete={handleDelete}
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
    elevation: 3,
    zIndex: 1,
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
  plansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 12,
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
    alignItems: 'center',
  },
  iconText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'RobotoMedium',
  }
});

export default PlanEvents;

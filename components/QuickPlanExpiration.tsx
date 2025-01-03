import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlanStore } from '@/services/planStore';

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

const PlanCard = ({ title, images, onPress, likes = 0, amount = 0 }: {
  title: string;
  images: string[];
  onPress?: () => void;
  likes?: number;
  amount?: number;
}) => (
  <TouchableOpacity style={styles.planCard} onPress={onPress}>
    {images.length > 0 && (
      <Image source={{ uri: images[0] }} style={styles.planImage} />
    )}
    <View style={styles.planDetails}>
      <Text style={styles.planTitle}>{title}</Text>
      <IconGroup likes={likes} amount={amount} />
    </View>
  </TouchableOpacity>
);

export const QuickPlan = ({ expiresIn }: { expiresIn: number }) => {
  const { plans, deletePlan } = usePlanStore();

  const getPlansForExpiryDay = () => {
    const today = new Date();
    const planMap = new Map();

    plans.forEach(plan => {
      if (plan.plan !== "Quick") return;

      const planDate = new Date(plan.date);
      const diffTime = planDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (daysDiff !== expiresIn) return;

      const dateString = planDate.toISOString().split('T')[0];
      const planKey = `${plan.plan}_${dateString}`;
      
      const images = [];
      if (plan.place?.photos) {
        images.push(...plan.place.photos.map(photo => photo.url));
      }
      if (plan.myelin?.file) {
        images.push(plan.myelin.file.thumbnailUrl || plan.myelin.file.url);
      }

      const likes = plan.myelin?.likes?.length || 0;
      const amount = plan.myelin?.amountPaid || 0;

      if (!planMap.has(planKey)) {
        planMap.set(planKey, {
          id: plan._id,
          title: formatTitle(plan.plan),
          images,
          likes,
          amount
        });
      } else {
        const existingPlan = planMap.get(planKey);
        existingPlan.images = [...existingPlan.images, ...images];
        existingPlan.likes += likes;
        existingPlan.amount += amount;
      }
    });

    return Array.from(planMap.values());
  };

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

  const quickPlansForThisDate = getPlansForExpiryDay();

  if (quickPlansForThisDate.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ExpirationAlert days={expiresIn} />
      <View style={styles.plansContainer}>
        {quickPlansForThisDate.map((plan) => (
          <PlanCard 
            key={plan.id}
            title={plan.title}
            images={plan.images}
            likes={plan.likes}
            amount={plan.amount}
            onPress={() => handleDeletePlan(plan.id)}
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

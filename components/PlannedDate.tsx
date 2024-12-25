import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { usePlanStore } from "@/services/planStore";
import { planService } from "@/services/planService";

const formatTitle = (title: string): string => {
  return title
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const MonthHeader = ({ month }: { month: string }) => (
  <View style={styles.monthHeader}>
    <View style={styles.monthCircle}>
      <View style={styles.blackCircle} />
    </View>
    <Text style={styles.monthText}>{month}</Text>
  </View>
);

interface Photo {
  url: string;
}

interface EventDetails {
  title: string;
  description: string;
  mainTag: string;
  subTags: string[];
  photos: Photo[];
  eventCount: number;
}

const TimelineComponent = () => {
  const { plans, setPlans, refreshPlans } = usePlanStore();

  const handleEventDelete = (eventId: string, eventTitle: string) => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${eventTitle}"?`,
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
              await planService.deleteEvent(eventId);
              setPlans(plans.filter(plan => plan._id !== eventId));
              refreshPlans();
            } catch (error) {
              Alert.alert("Error", "Failed to delete event");
            }
          }
        }
      ]
    );
  };

  const getEventDetails = (plan: any): EventDetails | null => {
    let eventCount = 0;
    let photos: Photo[] = [];
    let details = null;

    if (plan.place) {
      eventCount += plan.place.subTags?.length || 0;
      photos = plan.place.photos || [];
      details = {
        title: plan.place.placeName.title,
        description: plan.place.description,
        mainTag: plan.place.mainTag,
        subTags: plan.place.subTags,
        photos,
        eventCount
      };
    }

    if (plan.myelin) {
      eventCount += plan.myelin.subTags?.length || 0;
      const myelinPhoto = plan.myelin.file?.thumbnailUrl || plan.myelin.file?.url;
      if (myelinPhoto) {
        photos = [{ url: myelinPhoto }];
      }
      details = {
        title: plan.myelin.placeName.title,
        description: plan.myelin.description,
        mainTag: plan.myelin.mainTag,
        subTags: plan.myelin.subTags,
        photos,
        eventCount
      };
    }

    // Ensure at least one event is counted if there are any details
    if (details && eventCount === 0) {
      details.eventCount = 1;
    }

    return details;
  };

  const groupPlansByMonth = () => {
    const groupedPlans = new Map();
    
    plans.forEach(plan => {
      const date = new Date(plan.date);
      const month = date.toLocaleString('default', { month: 'long' });
      
      if (!groupedPlans.has(month)) {
        groupedPlans.set(month, []);
      }
      groupedPlans.get(month).push(plan);
    });

    return Array.from(groupedPlans.entries());
  };

  return (
    <ScrollView style={styles.container}>
      {groupPlansByMonth().map(([month, monthPlans]) => (
        <View key={month}>
          <MonthHeader month={month} />
          {monthPlans.map((plan: any, index: number) => {
            const eventDetails = getEventDetails(plan);
            if (!eventDetails) return null;

            return (
              <View key={index} style={styles.planContainer}>
                <View style={styles.timeline}>
                  <View style={styles.outerCircle}>
                    <View style={styles.circle} />
                  </View>
                  <View style={styles.verticalLine} />
                  <View style={styles.planConnector} />
                </View>
                <View style={styles.planWrapper}>
                  <Text style={[styles.planTitle, styles.planTitleOutside]}>
                    {formatTitle(plan.plan)}
                  </Text>
                  <TouchableOpacity
                    style={styles.eventCard}
                    onLongPress={() => handleEventDelete(plan._id, eventDetails.title)}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.eventsSection}>
                        <Text style={styles.eventText}>Events</Text>
                        <Text style={styles.eventCount}>
                          {eventDetails.eventCount}
                        </Text>
                      </View>
                      <View style={styles.verticalSeparator} />
                      <Text style={styles.eventTitle}>{eventDetails.title}</Text>
                      <View style={styles.verticalSeparator} />
                      <View style={styles.imageStack}>
                        {eventDetails.photos.slice(0, 3).map((photo: Photo, photoIndex: number) => (
                          <Image
                            key={photoIndex}
                            style={[
                              styles.eventImage,
                              {
                                width: 75 - (photoIndex * 10),
                                height: 75 - (photoIndex * 10),
                                zIndex: 3 - photoIndex,
                                right: photoIndex * 30,
                              }
                            ]}
                            source={{ uri: photo.url }}
                          />
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  monthCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  blackCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "black",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  planContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  planWrapper: {
    flex: 1,
  },
  timeline: {
    width: 20,
    alignItems: "center",
    position: "relative",
  },
  outerCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#008080",
  },
  verticalLine: {
    width: 2,
    position: "absolute",
    top: -20,
    left: 8.5,
    height: "120%",
    backgroundColor: "#ccc",
    zIndex: -2,
  },
  planConnector: {
    width: 2.5,
    height: 20,
    backgroundColor: "#ccc",
    position: "absolute",
    right: -12,
    top: 4,
    transform: [{ rotate: "90deg" }],
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 10,
  },
  planTitle: {
    color: "#008080",
    fontSize: 14,
    fontWeight: "600",
  },
  planTitleOutside: {
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 24,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  eventsSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  eventCount: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    width: 36,
    height: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#008080',
    borderRadius: 12,
    lineHeight: 36,
    overflow: 'hidden',
    marginTop: 4,
  },
  verticalSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E5E5',
    marginHorizontal: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginHorizontal: 10,
  },
  imageStack: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 85,
    width: 95,
    marginLeft: 20,
  },
  eventImage: {
    position: 'absolute',
    right: 0,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default TimelineComponent;

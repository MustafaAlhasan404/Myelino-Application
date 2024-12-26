import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { usePlanStore } from "@/services/planStore";

interface Photo {
  url: string;
}

interface Plan {
  place?: {
    photos?: Photo[];
    subTags?: string[];
  };
  myelin?: {
    file?: {
      thumbnailUrl?: string;
      url?: string;
    };
    subTags?: string[];
  };
}

const SavedEventsComponent = () => {
  const { plans } = usePlanStore();

  const totalEvents = plans.reduce((total: number, plan: Plan) => {
    const placeEvents = plan.place?.subTags?.length || 0;
    const myelinEvents = plan.myelin?.subTags?.length || 0;
    return total + Math.max(placeEvents + myelinEvents, 1);
  }, 0);

  const allPhotos = plans.reduce((photos: Photo[], plan: Plan) => {
    const placePhotos = plan.place?.photos || [];
    const myelinPhoto = plan.myelin?.file?.thumbnailUrl || plan.myelin?.file?.url;
    
    const newPhotos = [...photos, ...placePhotos];
    if (myelinPhoto) {
      newPhotos.push({ url: myelinPhoto });
    }
    return newPhotos;
  }, [] as Photo[]);

  return (
    <View style={styles.container}>
      <View style={styles.planContainer}>
        <TouchableOpacity style={styles.eventCard}>
          <View style={styles.cardContent}>
            <View style={styles.eventsSection}>
              <Text style={styles.eventText}>Events</Text>
              <Text style={styles.eventCount}>{totalEvents}</Text>
            </View>
            <View style={styles.verticalSeparator} />
            <Text style={styles.eventTitle}>All Saved Events</Text>
            <View style={styles.verticalSeparator} />
            <View style={styles.imageStack}>
              {allPhotos.slice(0, 3).map((photo: Photo, photoIndex: number) => (
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
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  planContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    flex: 1,
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
    fontSize: 18,
    fontWeight: "600",
    color: "#008080",
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

export default SavedEventsComponent;

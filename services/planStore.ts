import { create } from 'zustand';
import { planService } from '@/services/planService';
import { errorHandler } from '@/helpers/errorHandler';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Image } from 'react-native';

interface User {
  id: string;
  email: string;
  name: string;
}

interface PlaceInfo {
  placeName: {
    title: string;
    address: string;
  };
  description: string;
  mainTag: string;
  subTags: string[];
}

interface Place extends PlaceInfo {
  photos: Array<{ url: string }>;
}

interface Myelin extends PlaceInfo {
  file: {
    url: string;
    thumbnailUrl?: string;
  };
}

interface Plan {
  _id: string;
  plan: string;
  userId: string;
  date: string;
  place?: Place;
  myelin?: Myelin;
  events?: Array<{
    id: string;
    name: string;
    icon: string;
    type: 'activity' | 'cost';
  }>;
}

interface PlanStore {
  user: User | null;
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  setPlans: (plans: Plan[]) => void;
  fetchPlans: () => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  logout: () => void;
  refreshPlans: () => Promise<void>;
}

const thumbnailCache = new Map<string, string>();

const generateThumbnail = async (videoUrl: string) => {
  if (thumbnailCache.has(videoUrl)) {
    return thumbnailCache.get(videoUrl);
  }
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
      time: 0,
      quality: 0.5,
    });
    thumbnailCache.set(videoUrl, uri);
    return uri;
  } catch (e) {
    return null;
  }
};

const optimizeMediaQuality = (url: string, width = 300) => {
  return `${url}?width=${width}&quality=75`;
};

const preloadNextBatch = async (plans: Plan[]) => {
  const upcomingPlans = plans.slice(0, 5);
  upcomingPlans.forEach(plan => {
    if (plan.myelin?.file?.url) {
      Image.prefetch(optimizeMediaQuality(plan.myelin.file.url));
    }
    if (plan.place?.photos) {
      plan.place.photos.forEach(photo => Image.prefetch(optimizeMediaQuality(photo.url)));
    }
  });
};

const processMediaForPlan = async (plan: Plan) => {
  if (plan.myelin?.file?.url) {
    const isVideo = plan.myelin.file.url.match(/\.(mp4|mov|avi|wmv)$/i);
    if (isVideo) {
      const thumbnail = await generateThumbnail(plan.myelin.file.url);
      if (thumbnail) {
        return {
          ...plan,
          myelin: {
            ...plan.myelin,
            file: {
              ...plan.myelin.file,
              thumbnailUrl: thumbnail
            }
          }
        };
      }
    }
  }
  return plan;
};

const loadMediaInBatches = async (plans: Plan[], batchSize = 3) => {
  const results = [];
  for (let i = 0; i < plans.length; i += batchSize) {
    const batch = plans.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(plan => processMediaForPlan(plan))
    );
    results.push(...batchResults);
  }
  return results;
};

export const usePlanStore = create<PlanStore>((set) => ({
  user: null,
  plans: [],
  isLoading: false,
  error: null,

  setUser: (user: User) => set({ user }),
  setPlans: (plans: Plan[]) => set({ plans }),

  fetchPlans: async () => {
    if (usePlanStore.getState().plans.length === 0) {
      set({ isLoading: true });
    }
    try {
      const response = await planService.getAll();

      const userPlans = response.data.allplans
        .filter((plan: Plan) => plan.userId === usePlanStore.getState().user?.id)
        .filter((plan: Plan, index: number, self: Plan[]) =>
          index === self.findIndex((p) => (
            p.plan === plan.plan && p.date === p.date
          ))
        );

      const processedPlans = await loadMediaInBatches(userPlans);
      await preloadNextBatch(processedPlans);

      set({ plans: processedPlans, isLoading: false });
    } catch (error) {
      set({ error: errorHandler(error), isLoading: false });
    }
  },

  refreshPlans: async () => {
    try {
      const response = await planService.getAll();
      const userPlans = response.data.allplans
        .filter((plan: Plan) => plan.userId === usePlanStore.getState().user?.id)
        .filter((plan: Plan, index: number, self: Plan[]) =>
          index === self.findIndex((p) => (
            p.plan === plan.plan && p.date === p.date
          ))
        );

      const processedPlans = await loadMediaInBatches(userPlans);
      await preloadNextBatch(processedPlans);

      set({ plans: processedPlans });
    } catch (error) {
      set({ error: errorHandler(error) });
    }
  },

  deletePlan: async (id: string) => {
    try {
      await planService.deletePlans([id]);
      set((state) => ({
        plans: state.plans.filter(plan => plan._id !== id)
      }));
    } catch (error) {
      set({ error: errorHandler(error) });
    }
  },

  logout: () => {
    thumbnailCache.clear();
    set({
      user: null,
      plans: [],
      error: null
    });
  }
}));

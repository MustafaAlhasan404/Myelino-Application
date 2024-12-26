import { create } from 'zustand';
import { planService } from '@/services/planService';
import { errorHandler } from '@/helpers/errorHandler';
import * as VideoThumbnails from 'expo-video-thumbnails';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string; // Optional avatar URL
  fullName?: string; // Optional full name
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
  amountPaid?: number; // Added amountPaid
  currency?: string; // Added currency
  views?: number; // Added views
  likes?: string[]; // Added likes
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
  user?: User; // Added user information
}

interface PlanAnalysis {
  planId: string;
  planName: string;
  eventCount: number;
  mediaUrls: string[];
}

interface PlanStore {
  user: User | null;
  plans: Plan[];
  plansAnalysis: PlanAnalysis[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  setPlans: (plans: Plan[]) => void;
  fetchPlans: () => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  logout: () => void;
  refreshPlans: () => Promise<void>;
}

const generateThumbnail = async (videoUrl: string) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
      time: 0,
      quality: 0.5,
    });
    return uri;
  } catch (e) {
    return null;
  }
};

const analyzePlans = (plans: Plan[]): PlanAnalysis[] => {
  return plans.map(plan => {
    const eventCount = plan.events?.length || 0;
    const photoUrls = plan.place?.photos?.map(photo => photo.url) || [];
    const videoUrl = plan.myelin?.file?.url;
    
    return {
      planId: plan._id,
      planName: plan.plan,
      eventCount,
      mediaUrls: [...photoUrls, videoUrl].filter((url): url is string => url !== undefined)
    };
  });
};

export const usePlanStore = create<PlanStore>((set) => ({
  user: null,
  plans: [],
  plansAnalysis: [],
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
      console.log('API Response Plans:', response.data.allplans); // Log only the plans
  
      const userPlans = response.data.allplans
        .filter((plan: Plan) => plan.userId === usePlanStore.getState().user?.id)
        .filter((plan: Plan, index: number, self: Plan[]) =>
          index === self.findIndex((p) => (
            p.plan === plan.plan && p.date === plan.date
          ))
        );
  
      const plansWithThumbnails = await Promise.all(
        userPlans.map(async (plan: Plan) => {
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
        })
      );
  
      const analysis = analyzePlans(plansWithThumbnails);
  
      set({ 
        plans: plansWithThumbnails, 
        plansAnalysis: analysis,
        isLoading: false 
      });
    } catch (error) {
      set({ error: errorHandler(error), isLoading: false });
    }
  },
  
  refreshPlans: async () => {
    try {
      const response = await planService.getAll();
      console.log('API Response Plans:', response.data.allplans); // Log only the plans
      const userPlans = response.data.allplans
        .filter((plan: Plan) => plan.userId === usePlanStore.getState().user?.id)
        .filter((plan: Plan, index: number, self: Plan[]) =>
          index === self.findIndex((p) => (
            p.plan === plan.plan && p.date === plan.date
          ))
        );
  
      const plansWithThumbnails = await Promise.all(
        userPlans.map(async (plan: Plan) => {
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
        })
      );
  
      const analysis = analyzePlans(plansWithThumbnails);
      console.log('Plans Analysis:', analysis); // Log the analysis of plans
  
      set({ 
        plans: plansWithThumbnails,
        plansAnalysis: analysis
      });
    } catch (error) {
      set({ error: errorHandler(error) });
    }
  },  

  deletePlan: async (id: string) => {
    try {
      await planService.deletePlans([id]);
      set((state) => ({
        plans: state.plans.filter(plan => plan._id !== id),
        plansAnalysis: state.plansAnalysis.filter(analysis => analysis.planId !== id)
      }));
    } catch (error) {
      set({ error: errorHandler(error) });
    }
  },

  logout: () => {
    set({
      user: null,
      plans: [],
      plansAnalysis: [],
      error: null
    });
  }
}));

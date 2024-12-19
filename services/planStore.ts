import { create } from 'zustand';
import { planService } from '@/services/planService';
import { errorHandler } from '@/helpers/errorHandler';

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
  };
}

interface Plan {
  _id: string;
  plan: string;
  userId: string;
  date: string;
  place?: Place;
  myelin?: Myelin;
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
            p.plan === plan.plan && p.date === plan.date
          ))
        );

      const seenEvents = new Set();

      userPlans.forEach((plan: Plan) => {
        if (plan.place) {
          const eventKey = `${plan.place.placeName.title}-${plan.place.placeName.address}`;
          if (!seenEvents.has(eventKey)) {
            seenEvents.add(eventKey);
            console.log('Place Event:', {
              title: plan.place.placeName.title,
              address: plan.place.placeName.address,
              description: plan.place.description,
              mainTag: plan.place.mainTag,
              subTags: plan.place.subTags
            });
          }
        }
        if (plan.myelin) {
          const eventKey = `${plan.myelin.placeName.title}-${plan.myelin.placeName.address}`;
          if (!seenEvents.has(eventKey)) {
            seenEvents.add(eventKey);
            console.log('Myelin Event:', {
              title: plan.myelin.placeName.title,
              address: plan.myelin.placeName.address,
              description: plan.myelin.description,
              mainTag: plan.myelin.mainTag,
              subTags: plan.myelin.subTags
            });
          }
        }
      });

      set({ plans: userPlans, isLoading: false });
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
            p.plan === plan.plan && p.date === plan.date
          ))
        );
      set({ plans: userPlans });
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
    set({
      user: null,
      plans: [],
      error: null
    });
  }
}));

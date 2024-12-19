import { axiosClient } from '@/config/axiosClient';

export const planService = {
  getAll: () => axiosClient.get('/plan'),
  deleteEvent: (eventId: string) => axiosClient.delete(`/plan/event/${eventId}`),
  deletePlans: (planIds: string[]) => axiosClient.delete('/plan', { data: { plans: planIds } }),
  clearPlanner: () => axiosClient.delete('/plan/clear-planner'),
  loadMockData: () => axiosClient.get('/plan/load-data')
};

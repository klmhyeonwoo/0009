import { api } from './index';

export interface DashboardData {
  numOfTask: number;
  numOfRestTask: number;
  numOfDoneTask: number;
}

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>('/api/dashboard');
  return data;
}

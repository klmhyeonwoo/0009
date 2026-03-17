import { api } from './index';

export interface TaskItem {
  id: string;
  title: string;
  memo: string;
  status: 'TODO' | 'DONE';
}

export interface TaskListResponse {
  data: TaskItem[];
  hasNext: boolean;
}

export interface TaskDetail {
  title: string;
  memo: string;
  registerDatetime: string;
}

export async function getTaskList(page: number): Promise<TaskListResponse> {
  const { data } = await api.get<TaskListResponse>(`/api/task?page=${page}`);
  return data;
}

export async function getTaskDetail(id: string | number): Promise<TaskDetail> {
  const { data } = await api.get<TaskDetail>(`/api/task/${id}`);
  return data;
}

export async function deleteTask(id: string | number): Promise<void> {
  await api.delete(`/api/task/${id}`);
}

import { useQuery } from '@tanstack/react-query';
import { getTaskDetail } from '@/api/task';

export function useTaskDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskDetail(id!),
    retry: false,
  });
}

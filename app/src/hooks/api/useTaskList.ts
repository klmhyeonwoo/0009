import { useInfiniteQuery } from "@tanstack/react-query";
import { getTaskList } from "@/api/task";

export function useTaskList() {
  return useInfiniteQuery({
    queryKey: ["tasks"],
    queryFn: ({ pageParam }) => getTaskList(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasNext ? lastPageParam + 1 : undefined,
  });
}

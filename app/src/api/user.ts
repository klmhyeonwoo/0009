import { api } from "./index";

export interface UserProfile {
  name: string;
  memo: string;
}

export async function getUser(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/api/user");
  return data;
}

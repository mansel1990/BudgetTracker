import { useQuery } from "@tanstack/react-query";

export const useUserSettings = () => {
  return useQuery({
    queryKey: ["userSettings"],
    queryFn: async () => {
      const response = await fetch("/api/user-settings");
      if (!response.ok) {
        throw new Error("Failed to fetch user settings");
      }
      return response.json();
    },
  });
};

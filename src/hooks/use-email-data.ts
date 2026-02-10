import { useQuery } from "@tanstack/react-query";
import { getEmails } from "@/lib/actions/communication.actions";

export const useEmails = (email: string) => {
  return useQuery({
    queryKey: ["emails", email],
    queryFn: async () => {
      if (!email) return [];
      const response = await getEmails(email);
      return response?.success ? response.data : [];
    },
    enabled: !!email,
    staleTime: 60 * 1000, // 1 minute
  });
};

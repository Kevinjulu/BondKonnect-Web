import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getUserPortfolios, 
  addNewPortfolio, 
  updatePortfolio,
  exportPortfolioToExcel
} from "@/lib/actions/portfolio.actions";
import { getStatsTable } from "@/lib/actions/market.actions";
import { useToast } from "@/hooks/use-toast";

export const useStatsTable = () => {
  return useQuery({
    queryKey: ["stats-table"],
    queryFn: async () => {
      const response = await getStatsTable();
      return Array.isArray(response) ? response : [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserPortfolios = (email: string) => {
  return useQuery({
    queryKey: ["user-portfolios", email],
    queryFn: async () => {
      if (!email) return [];
      const response = await getUserPortfolios(email);
      return response?.success ? response.data : [];
    },
    enabled: !!email,
    staleTime: 2 * 60 * 1000,
  });
};

export const usePortfolioMutations = (email: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: any) => addNewPortfolio(data),
    onSuccess: (response) => {
      if (response?.success) {
        toast({ title: "Success", description: "Portfolio created successfully" });
        queryClient.invalidateQueries({ queryKey: ["user-portfolios", email] });
      } else {
        toast({ title: "Error", description: response?.message || "Failed to create portfolio", variant: "destructive" });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updatePortfolio(data),
    onSuccess: (response) => {
      if (response?.success) {
        toast({ title: "Success", description: "Portfolio updated successfully" });
        queryClient.invalidateQueries({ queryKey: ["user-portfolios", email] });
      } else {
        toast({ title: "Error", description: response?.message || "Failed to update portfolio", variant: "destructive" });
      }
    },
  });

  return {
    createPortfolio: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePortfolio: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllUsers, 
  getRoles, 
  suspendUser, 
  reactivateUser,
  register 
} from "@/lib/actions/api.actions";
import { useToast } from "@/hooks/use-toast";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getAllUsers();
      return response?.success ? response.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await getRoles();
      return response?.success ? response.data : [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const suspendMutation = useMutation({
    mutationFn: (userId: number) => suspendUser(userId),
    onSuccess: (response) => {
      if (response?.success) {
        toast({ title: "Account Suspended", description: "The user account has been deactivated." });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        toast({ title: "Error", description: response?.message || "Failed to suspend user", variant: "destructive" });
      }
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: (userId: number) => reactivateUser(userId),
    onSuccess: (response) => {
      if (response?.success) {
        toast({ title: "Account Reactivated", description: "The user account is now active." });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        toast({ title: "Error", description: response?.message || "Failed to reactivate user", variant: "destructive" });
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => register(data),
    onSuccess: (response) => {
      if (response?.success) {
        toast({ title: "User Created", description: "New user account successfully registered." });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        toast({ title: "Error", description: response?.message || "Failed to create user", variant: "destructive" });
      }
    },
  });

  return {
    suspendUser: suspendMutation.mutateAsync,
    isSuspending: suspendMutation.isPending,
    reactivateUser: reactivateMutation.mutateAsync,
    isReactivating: reactivateMutation.isPending,
    createUser: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};

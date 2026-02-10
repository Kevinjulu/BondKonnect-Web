import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "@/store/apps/auth/AuthSlice";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { useEffect } from "react";
import { AppState } from "@/store/store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, userRole } = useSelector((state: AppState) => state.auth);

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const userData = await getCurrentUserDetails();
        return userData;
      } catch (error) {
        return null;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setUser(query.data));
    } else if (query.isError || (query.isSuccess && !query.data)) {
      dispatch(logout());
    }
  }, [query.data, query.isError, query.isSuccess, dispatch]);

  return {
    user,
    isAuthenticated,
    userRole,
    isLoading: query.isLoading,
    refetch: query.refetch,
    error: query.error
  };
};

export const useHasPermission = (permission: string) => {
  const { user } = useSelector((state: AppState) => state.auth);
  
  if (!user || !user.roles) return false;
  
  return user.roles.some(role => 
    role.role_permissions.some(p => p.permission_name === permission && p.allowed)
  );
};

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AuthUser, LoginPayload, RegisterPayload } from "@/features/auth/domain/types";
import { login, register } from "@/features/auth/infra/authApi";

const AUTH_QUERY_KEY = ["auth", "currentUser"];

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    }
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    }
  });
}

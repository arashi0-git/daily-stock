import type { AuthUser, LoginPayload, RegisterPayload } from "@/features/auth/domain/types";

const API_BASE = "/api";

async function handleResponse(response: Response, fallbackMessage: string) {
  if (response.ok) {
    const { password: ignoredPassword, ...user } = (await response.json()) as AuthUser & {
      password?: string;
    };
    void ignoredPassword;
    return user;
  }

  try {
    const errorBody = (await response.json()) as { message?: string };
    throw new Error(errorBody.message ?? fallbackMessage);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(fallbackMessage);
    }
    throw error;
  }
}

export async function login(payload: LoginPayload) {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return handleResponse(response, "ログインに失敗しました");
}

export async function register(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return handleResponse(response, "ユーザー登録に失敗しました");
}

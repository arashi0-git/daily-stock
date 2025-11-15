export type AuthUser = {
  userId: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  gender: string;
  email: string;
  password: string;
};

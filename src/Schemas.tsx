export type Pagination = {
  limit: number;
  offset: number;
  count: number;
  total: number;
}

export type Paginated<T> = {
  pagination: Pagination;
  data: Array<T>;
}

export type UserSchema = {
  id: number;
  url: string;
  username: string;
  email: string;
  has_password: boolean;
  avatar_url: string;
  about_me: string;
  first_seen: string;
  last_seen: string;
  posts_url: string;
}

export type NewUserSchema = {
  username: string;
  email: string;
  password: string;
}

export type UpdateUserSchema = {
  username: string;
  email: string;
  about_me: string;
}

export type PostSchema = {
  id: number;
  url: string;
  text: string;
  timestamp: string;
  author: UserSchema;
}

export type NewPostSchema = {
  text: string;
}

export type PasswordResetRequestSchema = {
  email: string;
}

export type PasswordResetSchema = {
  token: string;
  new_password: string;
}

export type PasswordChangeSchema = {
  old_password: string;
  password: string;
}
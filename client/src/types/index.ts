export interface IUser {
  user_id: number;
  username: string;
  email: string;
  project_id?: number | null;
  sprint_id?: number | null;
  company_id?: number | null;
}

export interface IHomeUser extends IUser {
  token?: string;
}

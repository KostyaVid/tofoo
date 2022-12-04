import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IUser {
  user_id: number;
  username: string;
  email: string;
  project_id?: number | null;
  sprint_id?: number | null;
  company_id?: number | null;
}

export const userHomeSlice = createApi({
  reducerPath: 'userHome',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getHomeUser: builder.query<IUser, null>({
      query: () => '/login',
    }),
  }),
});

export const { useGetHomeUserQuery } = userHomeSlice;

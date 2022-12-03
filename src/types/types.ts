import session from 'express-session';

export interface IParamsServer {
  host: string;
  port: number;
  backlog: number;
}

export type sessionPassportParams = {
  passport: {
    user: {
      user_id: number;
      project_id: number | null;
      sprint_id: number | null;
      company_id: number | null;
    };
  };
};

export type sessionPassportParamsWithCompany = {
  passport: {
    user: {
      user_id: number;
      project_id: number | null;
      sprint_id: number | null;
      company_id: number;
    };
  };
};

export type Status = 0 | 1 | 2;
export type StatusTodo = 0 | 1 | 2 | 3;

export type sessionParams = session.Session & Partial<session.SessionData> & sessionPassportParams;
export type sessionParamsWithCompany = session.Session &
  Partial<session.SessionData> &
  sessionPassportParamsWithCompany;

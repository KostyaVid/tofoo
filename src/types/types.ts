import session from "express-session";

export interface ParamsServer {
  host: string;
  port: number;
  backlog: number;
}

export type sessionPassportParams = {
  passport: {
    user: {
      user_id: number;
      email: string;
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
      email: string;
      project_id: number | null;
      sprint_id: number | null;
      company_id: number;
    };
  };
};

export type Status = "Opened" | "In Progress" | "Done";
export type StatusTodo =
  | "Opened"
  | "In Progress"
  | "Reviewer"
  | "Done"
  | "Reopened";

export type sessionParams = session.Session &
  Partial<session.SessionData> &
  sessionPassportParams;
export type sessionParamsWithCompany = session.Session &
  Partial<session.SessionData> &
  sessionPassportParamsWithCompany;

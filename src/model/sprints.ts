import { Status } from "./../types/types";
import {
  spliceString,
  toMySqlDate,
  validateID,
  validateIDNotNull,
  validateStatus,
} from "./../utils/helper";
import db from "./db";

export interface ISprint {
  sprint_id: number;
  project_id: number;
  company_id: number;
  name: string;
  status: Status;
  create_date: string;
  end_date: string;
}

export class Sprint implements ISprint {
  sprint_id: number;
  project_id: number;
  company_id: number;
  name: string;
  status: Status;
  create_date: string;
  end_date: string;
  private constructor(sprint: ISprint) {
    this.sprint_id = sprint.sprint_id;
    this.project_id = sprint.project_id;
    this.company_id = sprint.company_id;
    this.name = sprint.name;
    this.status = sprint.status;
    this.create_date = sprint.create_date;
    this.end_date = sprint.end_date;
  }

  static async create(sprint: {
    project_id: number;
    company_id: number;
    name: string;
    end_date: string;
  }) {
    try {
      const sprintValid = Sprint.validate(sprint);

      //SQL QUERY
      const sqlQuery = `INSERT INTO sprint (project_id, name, end_date, company_id) VALUES (${sprintValid.project_id}, '${sprintValid.name}', '${sprintValid.end_date}', ${sprintValid.company_id});`;

      await db.create(sqlQuery);
      const [springIndex] = await db.get("SELECT LAST_INSERT_ID();");
      return Sprint.get(
        springIndex["LAST_INSERT_ID()"],
        sprintValid.company_id
      );
    } catch (error) {
      return;
    }
  }

  static async get(sprint_id: number, company_id: number) {
    if (!validateID(sprint_id)) return;
    const sqlQuery = `SELECT * FROM sprint WHERE sprint_id=${sprint_id} AND company_id=${company_id}`;
    const [sprintOut] = await db.get(sqlQuery);
    return new Sprint(sprintOut as ISprint);
  }

  static async getAllByProject(project_id: number, company_id: number) {
    if (!validateID(project_id)) return [];
    const sqlQuery = `SELECT * FROM sprint WHERE project_id=${project_id} AND company_id=${company_id}  AND (NOT (status=2))`;
    const sprintsOut = await db.get(sqlQuery);
    return sprintsOut as ISprint[];
  }

  static async setStatus(
    status: Status,
    sprint_id: number,
    company_id: number
  ) {
    if (!validateID(sprint_id)) return false;
    const sqlQuery = `UPDATE sprint SET status=${validateStatus(
      status
    )} WHERE sprint_id=${sprint_id} AND company_id=${company_id}`;
    await db.update(sqlQuery);
    return true;
  }

  static async isExistInProject(
    sprint_id: number,
    project_id: number,
    company_id: number
  ) {
    if (!validateID(sprint_id) || !validateID(project_id)) return false;
    const sqlQuery = `SELECT sprint_id FROM sprint WHERE project_id=${project_id} AND sprint_id=${sprint_id} AND company_id=${company_id}`;
    const sprintOut = await db.get(sqlQuery);
    return Boolean(sprintOut.length);
  }

  static validate(spring: {
    project_id: number;
    company_id: number;
    name: string;
    end_date: string;
  }) {
    return {
      project_id: validateIDNotNull(spring.project_id),
      company_id: validateIDNotNull(spring.company_id),
      name: spliceString(spring.name, 50),
      end_date: toMySqlDate(spring.end_date),
    };
  }
}

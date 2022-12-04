import { Status } from './../types/types';
import { spliceString, toMySqlDate, validateID, validateIDNotNull } from './../utils/helper';
import db from './db';

export interface IProject {
  project_id: number;
  name: string;
  status: Status;
  create_date: string;
  end_date: string;
  company_id: number;
}

export class Project implements IProject {
  project_id: number;
  name: string;
  status: Status;
  create_date: string;
  end_date: string;
  company_id: number;
  private constructor(project: IProject) {
    this.project_id = project.project_id;
    this.name = project.name;
    this.status = project.status;
    this.create_date = project.create_date;
    this.end_date = project.end_date;
    this.company_id = project.company_id;
  }

  static async create(project: { name: string; end_date: string; company_id: number }) {
    try {
      const projectValid = Project.validate(project);

      //SQL QUERY
      const sqlQuery = `INSERT INTO project (name, end_date, company_id) VALUES ('${projectValid.name}', '${projectValid.end_date}', ${projectValid.company_id});`;

      await db.create(sqlQuery);
      const [projectIndex] = await db.get('SELECT LAST_INSERT_ID();');
      return Project.get(projectIndex['LAST_INSERT_ID()'], projectValid.company_id);
    } catch (err) {
      return;
    }
  }

  static async get(project_id: number, company_id: number) {
    if (!validateID(project_id)) return;
    const sqlQuery = `SELECT * FROM project WHERE project_id=${project_id} AND company_id=${company_id}`;
    const [projectOut] = await db.get(sqlQuery);
    return new Project(projectOut as IProject);
  }

  static async getAllByCompany(company_id: number) {
    if (!validateID(company_id)) return [];
    const sqlQuery = `SELECT * FROM project WHERE company_id=${company_id} AND company_id=${company_id} AND (NOT (status=2))`;
    const projectsOut = await db.get(sqlQuery);
    return projectsOut as IProject[];
  }

  static async setStatus(status: Status, project_id: number, company_id: number) {
    if (!validateID(project_id) || !(status === 0 || status === 1 || status === 2)) return false;
    const sqlQuery = `UPDATE project SET status=${status} WHERE project_id=${project_id} AND company_id=${company_id}`;
    await db.update(sqlQuery);
    return true;
  }

  static async isExistInCompany(project_id: number, company_id: number) {
    if (!validateID(company_id) || !validateID(project_id)) return false;
    const sqlQuery = `SELECT project_id FROM project WHERE project_id=${project_id} AND company_id=${company_id}`;
    const projectOut = await db.get(sqlQuery);
    return Boolean(projectOut.length);
  }

  static validate(project: { name: string; end_date: string; company_id: number }) {
    return {
      name: spliceString(project.name, 50),
      end_date: toMySqlDate(project.end_date),
      company_id: validateIDNotNull(project.company_id),
    };
  }
}

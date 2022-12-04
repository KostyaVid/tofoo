import { InvalidArgError } from './../utils/error';
import { spliceString, validateID } from './../utils/helper';
import db from './db';

export interface ICompany {
  company_id: number;
  name: string;
  create_date: string;
}

export class Company implements ICompany {
  company_id: number;
  name: string;
  create_date: string;

  private constructor(company: ICompany) {
    this.company_id = company.company_id;
    this.name = company.name;
    this.create_date = company.create_date;
  }

  static async create(name: string) {
    const nameValid = Company.validate(name);

    //SQL QUERY
    const sqlQuery = `INSERT INTO company (name) VALUES ('${nameValid}');`;

    await db.create(sqlQuery);
    const [companyIndex] = await db.get('SELECT LAST_INSERT_ID();');

    return await this.get(companyIndex['LAST_INSERT_ID()']);
  }

  static async get(company_id: number) {
    if (!validateID(company_id)) throw new InvalidArgError('validate id');
    const sqlQuery = `SELECT * FROM company WHERE company_id=${company_id}`;
    const [companyOut] = await db.get(sqlQuery);
    return new Company(companyOut as ICompany);
  }

  static validate(name: string): string {
    return spliceString(name, 50);
  }
}

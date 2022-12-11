import db from './db';
import escape from 'escape-html';
import * as EmailValidator from 'email-validator';
import { AuthenticationError, BaseError, EmailExistError, ValidateError } from '../utils/error';
import { getCryptoPassword } from '../utils/crypto';

export interface IUser {
  user_id: number;
  username: string;
  email: string;
  project_id?: number | null;
  sprint_id?: number | null;
  company_id?: number | null;
}

export class User {
  static readonly maxLengthUserName = 30;
  static readonly minLengthUserName = 3;
  static readonly maxLengthPassword = 20;
  static readonly minLengthPassword = 4;

  project_id?: number | null;
  sprint_id?: number | null;
  company_id?: number | null;

  constructor(public readonly user_id: number, public username: string, public email: string) {
    this.project_id = null;
    this.sprint_id = null;
    this.company_id = null;
  }

  /**
   * Create new user in the database
   * @param username
   * @param password hash
   * @param email
   * @returns User | throw error EmailExistError | error ValidateError
   */
  static async create(username: string, password: string, email: string) {
    //Validate username, password, email. Throw Exception ValidateError
    this.validate(username, password, email);

    //find user with email in the database
    const isUserExist = await db.get(`SELECT user_id FROM user WHERE email='${email}'`);

    if (isUserExist.length > 0) throw new EmailExistError('Email does exist');

    //Insert new user to the database
    const hashPassword = getCryptoPassword(password);
    const sqlQuery = `INSERT INTO user(username, password, email, project_id, sprint_id, company_id) VALUES ('${escape(
      username,
    )}', '${hashPassword.toString()}', '${email}', null, null, null)`;
    await db.create(sqlQuery);

    const userMeta = await db.get(
      `SELECT user_id, username, email,  project_id, sprint_id, company_id FROM user WHERE email='${email}'`,
    );

    //return new user
    if (userMeta !== undefined) {
      const user: IUser = (userMeta as [IUser])[0];
      return new User(user.user_id, user.username, user.email);
    }
    throw new BaseError('Error server', `What's wrong`);
  }

  static async deleteUser(email: string) {
    const mail = escape(email);
    const isUserExist = await db.get(`SELECT email FROM user WHERE email='${mail}'`);

    if (isUserExist.length === 0) return false;

    const sqlQuery = `DELETE FROM user WHERE email='${mail}'`;
    await db.delete(sqlQuery);
    return true;
  }

  static async setCompany(company_id: number | null, user_id: number) {
    const sqlQuery = `UPDATE user SET company_id=${company_id} WHERE user_id=${user_id}`;
    await db.update(sqlQuery);
  }

  static async setProject(project_id: number, user_id: number) {
    const sqlQuery = `UPDATE user SET project_id=${project_id} WHERE user_id=${user_id}`;
    await db.update(sqlQuery);
  }

  static async setSprint(sprint_id: number, user_id: number) {
    const sqlQuery = `UPDATE user SET sprint_id=${sprint_id} WHERE user_id=${user_id}`;
    await db.update(sqlQuery);
  }

  static async get(user_id: number, company_id: number) {
    const sqlQuery = `SELECT * FROM user INNER JOIN company USING(company_id) WHERE company_id=${company_id} AND user_id=${user_id}`;
    const usersOut = await db.get(sqlQuery);
    console.log(usersOut[0]);

    if (usersOut.length === 0) return false;
    return usersOut[0] as IUser;
  }

  static async getWithoutCompany(user_id: number) {
    const sqlQuery = `SELECT user_id, username, email, project_id, sprint_id, company_id  FROM user WHERE user_id=${user_id}`;
    const usersOut = await db.get(sqlQuery);
    if (usersOut.length === 0) return false;
    return usersOut[0] as IUser;
  }

  static async getAllByCompany(company_id: number) {
    const sqlQuery = `SELECT user_id, username, email, project_id, sprint_id, company_id FROM user WHERE company_id=${company_id}`;
    const usersOut = await db.get(sqlQuery);
    return usersOut as IUser[];
  }

  static async getAllByProject(project_id: number) {
    const sqlQuery = `SELECT user_id, username, email, project_id, sprint_id, company_id FROM user WHERE project_id=${project_id}`;
    const usersOut = await db.get(sqlQuery);
    return usersOut as IUser[];
  }

  static async getAllBySprint(sprint_id: number) {
    const sqlQuery = `SELECT user_id, username, email, project_id, sprint_id, company_id FROM user WHERE sprint_id=${sprint_id}`;
    const usersOut = await db.get(sqlQuery);
    return usersOut as IUser[];
  }

  /**
   * Check User with email and password
   * @param email
   * @param password the password will be encoded
   * @return Promise<IUser> | AuthenticationError
   */
  static async checkAuthLocal(email: string, password: string): Promise<IUser> {
    const hashPassword = getCryptoPassword(password);
    const mail = escape(email);
    const user = await db.get(
      `SELECT user_id, username, password, email, project_id, sprint_id, company_id, company.name as company_name FROM user LEFT JOIN company USING(company_id) WHERE email='${mail}'`,
    );
    if (user.length === 0) {
      throw new AuthenticationError('Wrong login or password');
    }

    if (user[0].password === hashPassword.toString()) {
      delete user[0].password;
      return user[0] as IUser;
    }
    throw new AuthenticationError('Wrong login or password');
  }

  /**
   * Check User with id and password
   * @param user_id
   * @param password the password will be encoded
   * @return IUser | AuthenticationError
   */
  static async checkAuthLocalByID(user_id: number, password: string) {
    const hashPassword = getCryptoPassword(password);
    const user = await db.get(`SELECT user_id, password FROM user WHERE user_id='${user_id}'`);
    if (user.length === 0) {
      throw new AuthenticationError('Wrong login or password');
    }

    if (user[0].password === hashPassword.toString()) {
      return user[0];
    }
    throw new AuthenticationError('Wrong login or password');
  }

  static async findUserByID(user_id: number) {
    const user = await db.get(
      `SELECT user_id, username, email, project_id, sprint_id, company_id, company.name as company_name FROM user LEFT JOIN company USING(company_id) WHERE user_id=${user_id}`,
    );
    if (user.length === 0) {
      throw new AuthenticationError('Wrong login or password');
    }
    return user[0] as User;
  }

  private static validate(username: string, password: string, email: string) {
    if (!EmailValidator.validate(email)) throw new ValidateError('Wrong format email');

    if (username.length < User.minLengthUserName)
      throw new ValidateError('Name must contain at least 3 characters');

    if (username.length > User.maxLengthUserName)
      throw new ValidateError('Name must contain no more than 40 characters');

    if (password.length < User.minLengthPassword)
      throw new ValidateError('Password must contain at least 3 characters');

    if (password.length > User.maxLengthPassword)
      throw new ValidateError('Password must contain no more than 40 characters');
  }
}

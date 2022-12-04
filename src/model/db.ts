import config from 'config';
import mysql from 'mysql2/promise';
import { BaseError } from '../utils/error';

class Database {
  private db: mysql.Pool;

  constructor() {
    const param: mysql.PoolOptions = config.get('db') || {
      database: 'test',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'example',
    };
    this.db = mysql.createPool(param);
  }

  /**
   * call before calling other methods
   */
  async init() {
    await this.db.query(
      `CREATE TABLE IF NOT EXISTS company (company_id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50), create_date DATETIME DEFAULT NOW())`,
    );

    await this.db.query(
      `CREATE TABLE IF NOT EXISTS project (project_id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50), status INT DEFAULT 0, create_date DATETIME DEFAULT NOW(), end_date DATETIME, company_id INT, FOREIGN KEY (company_id) REFERENCES company (company_id) ON DELETE CASCADE)`,
    );

    await this.db.query(
      `CREATE TABLE IF NOT EXISTS sprint (sprint_id INT PRIMARY KEY AUTO_INCREMENT, project_id INT, name VARCHAR(50), status INT DEFAULT 0, create_date DATETIME DEFAULT NOW(), end_date DATETIME, company_id INT, FOREIGN KEY (company_id) REFERENCES company (company_id) ON DELETE CASCADE, FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE SET NULL)`,
    );

    await this.db.query(
      `CREATE TABLE IF NOT EXISTS user (user_id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(30), password VARCHAR(255), email VARCHAR(40), sprint_id INT, company_id INT, project_id INT, FOREIGN KEY (sprint_id) REFERENCES sprint (sprint_id) ON DELETE SET NULL, FOREIGN KEY (company_id) REFERENCES company (company_id) ON DELETE SET NULL, FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE SET NULL, UNIQUE (email))`,
    );
    await this.db.query(
      `CREATE TABLE IF NOT EXISTS todo (todo_id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(50), body VARCHAR(1000), status INT DEFAULT 0, create_date DATETIME DEFAULT NOW(), deadline DATETIME, author_id INT, assignee_id INT, reviewer_id INT, project_id INT, sprint_id INT, company_id INT, FOREIGN KEY (author_id) REFERENCES user (user_id) ON DELETE SET NULL, FOREIGN KEY (assignee_id) REFERENCES user (user_id) ON DELETE SET NULL, FOREIGN KEY (reviewer_id) REFERENCES user (user_id) ON DELETE SET NULL,  FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE CASCADE, FOREIGN KEY (sprint_id) REFERENCES sprint (sprint_id) ON DELETE SET NULL, FOREIGN KEY (company_id) REFERENCES company (company_id) ON DELETE CASCADE);`,
    );
  }

  /**
   * call before exit the app
   */
  async close() {
    await this.db.end();
  }

  async create(sqlQuery: string) {
    return await this.db.query(sqlQuery);
    throw new BaseError('Error server', `What's wrong`);
  }

  async get(sqlQuery: string) {
    const [dbObject] = await this.db.query(sqlQuery);
    return dbObject as mysql.RowDataPacket[];
    throw new BaseError('Error server', `What's wrong`);
  }

  async delete(sqlQuery: string) {
    return await this.db.query(sqlQuery);
    throw new BaseError('Error server', `What's wrong`);
  }

  async update(sqlQuery: string) {
    await this.db.query(sqlQuery);
    throw new BaseError('Error server', `What's wrong`);
  }
}

export default new Database();

import { spliceString, toMySqlDate, validateID, validateIDNotNull } from './../utils/helper';
import db from './db';
import escape from 'escape-html';
import { StatusTodo } from './../types/types';

export interface ITodo {
  todo_id?: number;
  title: string;
  body: string | null;
  status?: StatusTodo;
  create_date?: string;
  deadline: string | null;
  author_id: number | null;
  assignee_id: number | null;
  reviewer_id: number | null;
  project_id: number;
  sprint_id: number | null;
  company_id: number;
}

export default class Todo implements ITodo {
  todo_id?: number;
  title: string;
  body: string | null;
  status?: StatusTodo;
  create_date?: string;
  deadline: string | null;
  author_id: number | null;
  assignee_id: number | null;
  reviewer_id: number | null;
  project_id: number;
  sprint_id: number | null;
  company_id: number;
  constructor(todo: ITodo) {
    this.todo_id = todo.todo_id;
    this.title = todo.title;
    this.body = todo.body;
    this.status = todo.status;
    this.create_date = todo.create_date;
    this.deadline = todo.deadline;
    this.author_id = todo.author_id;
    this.assignee_id = todo.assignee_id;
    this.reviewer_id = todo.reviewer_id;
    this.project_id = todo.project_id;
    this.sprint_id = todo.sprint_id;
    this.company_id = todo.company_id;
  }

  static async create(todo: ITodo) {
    try {
      const todoValidate = this.validate(todo);

      //SQL QUERY
      const sqlQuery = `INSERT INTO todo (title, body, deadline, author_id, assignee_id, reviewer_id, project_id, sprint_id, company_id) VALUES (${
        todoValidate.title
      }, ${todoValidate.body}, ${todoValidate.deadline}, ${String(
        todoValidate.author_id,
      )}, ${String(todoValidate.assignee_id)}, ${String(todoValidate.reviewer_id)}, ${
        todoValidate.project_id
      }, ${todoValidate.sprint_id}, ${todoValidate.company_id})`;

      await db.create(sqlQuery);
      const [todoIndex] = await db.get('SELECT LAST_INSERT_ID();');
      return Todo.get(todoIndex['LAST_INSERT_ID()'], todoValidate.company_id);
    } catch (err) {
      return;
    }
  }

  static async get(todo_id: number, company_id: number) {
    if (!validateID(todo_id)) return;
    const sqlQuery = `SELECT * FROM todo WHERE todo_id=${todo_id} AND company_id=${company_id}`;
    const [todoOut] = await db.get(sqlQuery);
    return new Todo(todoOut as ITodo);
  }

  static async getAndProject(todo_id: number, project_id: number, company_id: number) {
    if (!validateID(todo_id)) return;
    const sqlQuery = `SELECT * FROM todo WHERE todo_id=${todo_id} AND company_id=${company_id} AND project_id=${project_id}`;
    const [todoOut] = await db.get(sqlQuery);
    return new Todo(todoOut as ITodo);
  }

  static async getAndProjectAndSprint(
    todo_id: number,
    project_id: number,
    sprint_id: number,
    company_id: number,
  ) {
    if (!validateID(todo_id)) return;
    const sqlQuery = `SELECT * FROM todo WHERE todo_id=${todo_id} AND company_id=${company_id} AND project_id=${project_id} AND sprint_id=${sprint_id}`;
    const [todoOut] = await db.get(sqlQuery);
    return new Todo(todoOut as ITodo);
  }

  static async getAllByProject(project_id: number, company_id: number) {
    if (!validateID(project_id)) return [];
    const sqlQuery = `SELECT * FROM todo WHERE project_id=${project_id} AND company_id=${company_id}`;
    const todosOut = await db.get(sqlQuery);
    return todosOut as ITodo[];
  }

  static async getAllBySprint(sprint_id: number, company_id: number) {
    if (!validateID(sprint_id)) return [];
    const sqlQuery = `SELECT * FROM todo WHERE sprint_id=${sprint_id} AND company_id=${company_id}`;
    const todosOut = await db.get(sqlQuery);
    return todosOut as ITodo[];
  }

  static async setAssignee(assignee_id: number, todo_id: number, company_id: number) {
    if (!validateID(assignee_id) || !validateID(todo_id)) return false;
    const sqlQuery = `UPDATE todo SET assignee_id=${assignee_id} WHERE todo_id=${todo_id} AND company_id=${company_id}`;
    await db.update(sqlQuery);
    return true;
  }

  static async setReviewer(reviewer_id: number, todo_id: number, company_id: number) {
    if (!validateID(reviewer_id) || !validateID(todo_id)) return false;
    const sqlQuery = `UPDATE todo SET reviewer_id=${reviewer_id} WHERE todo_id=${todo_id} AND company_id=${company_id}`;
    await db.update(sqlQuery);
    return true;
  }

  static async setSprint(sprint_id: number, todo_id: number, company_id: number) {
    if (!validateID(sprint_id) || !validateID(todo_id)) return false;
    const sqlQuery = `UPDATE todo SET sprint_id=${sprint_id} WHERE todo_id=${todo_id} AND company_id=${company_id}`;
    await db.update(sqlQuery);
    return true;
  }

  static async setStatus(status: StatusTodo, todo_id: number, company_id: number) {
    if (!validateID(todo_id) || !(status === 0 || status === 1 || status === 2 || status === 3))
      return false;
    const sqlQuery = `UPDATE todo SET status=${status} WHERE todo_id=${todo_id} AND company_id=${company_id}`;
    await db.update(sqlQuery);
    return true;
  }

  static async setTitle(title: string, todo_id: number, company_id: number) {
    if (!validateID(todo_id)) return false;
    const sqlQuery = `UPDATE todo SET title=${escape(
      title,
    )} WHERE todo_id=${todo_id} AND company_id=${company_id}`;
    await db.update(sqlQuery);
    return true;
  }

  static async setBody(body: string, todo_id: number, company_id: number) {
    if (!validateID(todo_id)) return false;
    const sqlQuery = `UPDATE todo SET body=${escape(
      body,
    )} WHERE todo_id=${todo_id} AND company_id=${company_id}`;
    await db.update(sqlQuery);
    return true;
  }

  static async setDeadline(deadline: string, todo_id: number, company_id: number) {
    if (!validateID(todo_id)) return false;
    try {
      const date = toMySqlDate(deadline);
      const sqlQuery = `UPDATE todo SET deadline=${date} WHERE todo_id=${todo_id} AND company_id=${company_id}`;
      await db.update(sqlQuery);
      return true;
    } catch (err) {
      throw err;
    }
  }

  static validate(todo: ITodo): ITodo {
    return {
      title: `'${spliceString(todo.title, 50)}'`,
      body: todo.body === null ? 'null' : `'${spliceString(todo.body, 1000)}'`,
      deadline: todo.deadline ? `'${toMySqlDate(todo.deadline)}'` : 'null',
      author_id: validateID(todo.author_id),
      assignee_id: validateID(todo.assignee_id),
      reviewer_id: validateID(todo.reviewer_id),
      project_id: validateIDNotNull(todo.project_id),
      sprint_id: validateID(todo.sprint_id),
      company_id: validateIDNotNull(todo.company_id),
    };
  }
}

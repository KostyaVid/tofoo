import { Company } from "./company";
import { Project } from "./project";
import { Sprint } from "./sprints";
import escape from "escape-html";
import db from "./db";
import { User } from "./user";
import Todo, { ITodoBase } from "./todo";

let userGlobal: User;
let companyGlobal: Company;
beforeAll(async () => {
  return await db.init();
});

afterAll(async () => {
  return await db.close();
});

describe("DataBase ", () => {
  describe("DataBase todo", () => {
    it("Create new todo", async () => {
      const todoData: ITodoBase = {
        title: "title",
        body: "body",
        deadline: null,
        author_id: 1,
        assignee_id: null,
        reviewer_id: null,
        project_id: 2,
        company_id: 1,
        sprint_id: 3,
      };
      const todo = await Todo.create(todoData);
      expect(todo?.title).toEqual(todoData?.title);

      await db.delete(`DELETE FROM todo WHERE todo_id=${todo?.todo_id}`);
    });
  });

  describe("DataBase User", () => {
    it("Create new user", async () => {
      await User.create("test", "password", "testemail@google.com");
      const sqlQuery = `SELECT * FROM user WHERE email = '${escape(
        "testemail@google.com"
      )}'`;
      const [user] = await db.get(sqlQuery);
      expect(user.username).toEqual("test");
      await db.delete(
        `DELETE FROM user WHERE email='${"testemail@google.com"}'`
      );
    });

    it("Delete user", async () => {
      await db.create(
        `INSERT INTO user(username, password, email, project_id, sprint_id, company_id) VALUES ('test', 'password', '${escape(
          "testemail@google.com"
        )}', null, null, null)`
      );
      await User.deleteUser("testemail@google.com");
      const sqlQuery = `SELECT * FROM user WHERE email = '${escape(
        "testemail@google.com"
      )}'`;
      const user = await db.get(sqlQuery);
      expect(user.length).toEqual(0);
    });
  });

  describe("DataBase sprint", () => {
    it("Create new sprint", async () => {
      const sprintData = {
        project_id: 2,
        company_id: 1,
        name: "test Sprint",
        end_date: new Date(Date.now() + 360000).toString(),
      };
      const sprint = await Sprint.create(sprintData);
      expect(sprint?.name).toEqual(sprintData.name);

      await db.delete(
        `DELETE FROM sprint WHERE sprint_id=${sprint?.sprint_id}`
      );
    });
  });

  describe("DataBase project", () => {
    it("Create new project", async () => {
      const projectData = {
        name: "test Project",
        end_date: new Date(Date.now() + 3600000).toString(),
        company_id: 1,
      };
      const project = await Project.create(projectData);
      expect(project?.name).toEqual(projectData.name);

      await db.delete(
        `DELETE FROM project WHERE project_id=${project?.project_id}`
      );
    });
  });

  describe("DataBase company", () => {
    it("Create new company", async () => {
      const companyName = "test Company";
      const company = await Company.create(companyName);
      expect(company.name).toEqual(companyName);

      await db.delete(
        `DELETE FROM company WHERE company_id=${company.company_id}`
      );
    });
  });
});

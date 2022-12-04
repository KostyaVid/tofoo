import express from 'express';
import { User } from './../model/user';
import passport from './../middlewares/auth';
import { createJWTToken } from './../utils/crypto';
import { Company } from './../model/company';
import { sessionParams, sessionParamsWithCompany, Status, StatusTodo } from './../types/types';
import { Project } from './../model/project';
import { Sprint } from './../model/sprints';
import Todo from './../model/todo';

const router = express.Router();

router
  .get('/login', passport.authenticate('jwt', { session: true }), function (req, res, next) {
    try {
      res.status(200).send({ session: 'start' });
    } catch (err) {
      next(err);
    }
  })
  .post('/login', async (req, res, next) => {
    try {
      if ('email' in req.body && 'password' in req.body) {
        const user = await User.checkAuthLocal(req.body.email, req.body.password);
        const JWTToken = createJWTToken(user.user_id, user.email);
        res.status(200).send({ JWTToken });
      } else {
        res.status(401).send({ message: 'Form not completed' });
      }
    } catch (err) {
      next(err);
    }
  });

router.post('/signup', async (req, res, next) => {
  try {
    if ('email' in req.body && 'password' in req.body && 'username' in req.body) {
      const user = await User.create(req.body.username, req.body.password, req.body.email);
      const JWTToken = createJWTToken(user.user_id, user.email);
      res.status(200).send({ JWTToken });
    } else {
      res.status(401).send({ message: 'Form not completed' });
    }
  } catch (err) {
    next(err);
  }
});

router.use(async (req, res, next) => {
  try {
    if ('passport' in req.session) {
      if ('user' in <Record<string, object>>req.session.passport) {
        next();
      } else {
        res.status(401).send({ message: 'AuthenticationError' });
      }
    } else {
      res.status(401).send({ message: 'AuthenticationError' });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    res.statusCode = 200;
    res.send('hello');
  } catch (err) {
    next(err);
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.status(200).send({ message: 'Logout Success' });
    }
  });
});

router.post('/company', async (req, res, next) => {
  const name = req.body?.name;
  if (!name || !(req.session as sessionParams)?.passport?.user?.user_id) {
    res.status(400).send({ message: 'invalid request' });
    return;
  }
  if ((req.session as sessionParams).passport.user.company_id) {
    res.status(400).send({ message: 'You are already a member of the company' });
    return;
  }
  try {
    const company = await Company.create(name);
    if (typeof company !== 'undefined' && typeof company.company_id !== 'undefined') {
      await User.setCompany(
        company.company_id,
        (req.session as sessionParams).passport.user.user_id,
      );
      res.status(200).send(company);
    }
  } catch (err) {
    next(err);
  }
});

router.use('/*', async (req, res, next) => {
  if ((req.session as sessionParams)?.passport?.user?.company_id) {
    next();
  } else {
    res.status(400).send({ message: 'You have not a company' });
  }
});

router.post('/project', async (req, res, next) => {
  const name: string = req.body?.name;
  const end_date: string = req.body?.end_date;
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  if (!name || !end_date) {
    res.status(400).send({ message: 'Invalid arguments' });
    return;
  }
  try {
    const project = await Project.create({ name, end_date, company_id });
    res.status(200).send(project);
  } catch (err) {
    next(err);
  }
});

router.post('/project/:project/sprint', async (req, res, next) => {
  const name: string = req.body?.name;
  const end_date: string = req.body?.end_date;
  const project_id = Number(req.params.project);
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  if (!name || !end_date || !project_id) {
    res.status(400).send({ message: 'Invalid arguments' });
    return;
  }
  try {
    if (!(await Project.isExistInCompany(project_id, company_id))) {
      res.status(400).send({ message: 'This project does not exist' });
      return;
    }
    const sprint = await Sprint.create({ name, end_date, project_id, company_id });
    res.status(200).send(sprint);
  } catch (err) {
    next(err);
  }
});

router.post('/project/:project/todo', async (req, res, next) => {
  const title: string = req.body?.title;
  const body: string = req.body?.body;
  const author_id: number = (req.session as sessionParams)?.passport?.user?.user_id;
  const deadline: string = req.body?.deadline;
  const project_id = Number(req.params.project);
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  if (!title || !body || !author_id || !deadline || !project_id) {
    res.status(400).send({ message: 'Invalid arguments' });
    return;
  }
  try {
    if (!(await Project.isExistInCompany(project_id, company_id))) {
      res.status(400).send({ message: 'This project does not exist' });
      return;
    }
    const todo = await Todo.create({
      title,
      body,
      project_id,
      author_id,
      deadline,
      company_id,
      assignee_id: null,
      reviewer_id: null,
      sprint_id: null,
    });
    res.status(200).send(todo);
  } catch (err) {
    next(err);
  }
});

router.post('/project/:project/sprint/:sprint/todo', async (req, res, next) => {
  const title: string = req.body?.title;
  const body: string = req.body?.body;
  const author_id: number = (req.session as sessionParams)?.passport?.user?.user_id;
  const deadline: string = req.body?.deadline;
  const project_id = Number(req.params.project);
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const sprint_id = Number(req.params.sprint);
  if (!title || !body || !author_id || !deadline || !project_id || !sprint_id || !company_id) {
    res.status(400).send({ message: 'Invalid arguments' });
    return;
  }
  try {
    if (!(await Sprint.isExistInProject(sprint_id, project_id, company_id))) {
      res.status(400).send({ message: 'This sprint does not exist in this project' });
      return;
    }
    const todo = await Todo.create({
      title,
      body,
      project_id,
      author_id,
      deadline,
      sprint_id,
      company_id,
      assignee_id: null,
      reviewer_id: null,
    });
    res.status(200).send(todo);
  } catch (err) {
    next(err);
  }
});

router.get('/project', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  try {
    const projects = await Project.getAllByCompany(company_id);
    res.status(200).send({ projects });
  } catch (err) {
    next(err);
  }
});

router.get('/project/:project', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const project_id = Number(req.params.project);
  try {
    const project = await Project.get(project_id, company_id);
    res.status(200).send(project);
  } catch (err) {
    next(err);
  }
});

router.get('/project/:project/sprint', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const project_id = Number(req.params.project);
  try {
    const sprints = await Sprint.getAllByProject(project_id, company_id);
    res.status(200).send({ sprints });
  } catch (err) {
    next(err);
  }
});

router.get('/project/:project/sprint/:sprint', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const sprint_id = Number(req.params.sprint);
  try {
    const sprint = await Sprint.get(sprint_id, company_id);
    res.status(200).send(sprint);
  } catch (err) {
    next(err);
  }
});

router.get('/project/:project/todo', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const project_id = Number(req.params.project);
  try {
    const todos = await Todo.getAllByProject(project_id, company_id);
    res.status(200).send({ todos });
  } catch (err) {
    next(err);
  }
});

router.get('/project/:project/sprint/:sprint/todo', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const sprint_id = Number(req.params.sprint);
  try {
    const todos = await Todo.getAllBySprint(sprint_id, company_id);
    res.status(200).send({ todos });
  } catch (err) {
    next(err);
  }
});

router.get('/project/:project/todo/:todo', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const project_id = Number(req.params.project);
  const todo_id = Number(req.params.todo);
  try {
    const todo = await Todo.getAndProject(todo_id, project_id, company_id);
    res.status(200).send(todo);
  } catch (err) {
    next(err);
  }
});

router.get('/project/:project/sprint/:sprint/todo/:todo', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const project_id = Number(req.params.project);
  const todo_id = Number(req.params.todo);
  const sprint_id = Number(req.params.sprint);
  try {
    const todo = await Todo.getAndProjectAndSprint(todo_id, project_id, sprint_id, company_id);
    res.status(200).send(todo);
  } catch (err) {
    next(err);
  }
});

router.patch('/project/:project/status', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const project_id = Number(req.params.project);
  const status: Status = Number(req.body.status) as Status;
  try {
    if (await Project.setStatus(status, project_id, company_id)) {
      res.status(200).send({ message: 'success' });
    } else {
      res.status(400).send({ message: 'Invalid arguments' });
    }
  } catch (err) {
    next(err);
  }
});

router.patch('/project/:project/sprint/:sprint/status', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const sprint_id = Number(req.params.sprint);
  const status: Status = Number(req.body.status) as Status;
  try {
    if (await Sprint.setStatus(status, sprint_id, company_id)) {
      res.status(200).send({ message: 'success' });
    } else {
      res.status(400).send({ message: 'Invalid arguments' });
    }
  } catch (err) {
    next(err);
  }
});

router.patch('/project/*/todo/:todo/status', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const todo_id = Number(req.params.todo);
  const status: StatusTodo = Number(req.body.status) as StatusTodo;
  try {
    if (await Todo.setStatus(status, todo_id, company_id)) {
      res.status(200).send({ message: 'success' });
    } else {
      res.status(400).send({ message: 'Invalid arguments' });
    }
  } catch (err) {
    next(err);
  }
});

router.patch('/project/*/todo/:todo/assignee', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const todo_id = Number(req.params.todo);
  const assignee_id = Number(req.body.assignee);
  try {
    if (!(await User.get(assignee_id, company_id))) {
      res.status(400).send({ message: 'Invalid arguments' });
      return;
    }
    if (await Todo.setAssignee(assignee_id, todo_id, company_id)) {
      res.status(200).send({ message: 'success' });
    } else {
      res.status(400).send({ message: 'Invalid arguments' });
    }
  } catch (err) {
    next(err);
  }
});

router.patch('/project/*/todo/:todo/reviewer', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const todo_id = Number(req.params.todo);
  const reviewer_id = Number(req.body.reviewer);
  try {
    if (!(await User.get(reviewer_id, company_id))) {
      res.status(400).send({ message: 'Invalid arguments' });
      return;
    }
    if (await Todo.setReviewer(reviewer_id, todo_id, company_id)) {
      res.status(200).send({ message: 'success' });
    } else {
      res.status(400).send({ message: 'Invalid arguments' });
    }
  } catch (err) {
    next(err);
  }
});

router.patch('/project/*/todo/:todo/body', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const todo_id = Number(req.params.todo);
  const body: string = req.body.body;
  try {
    if (await Todo.setBody(body, todo_id, company_id)) {
      res.status(200).send({ message: 'success' });
    } else {
      res.status(400).send({ message: 'Invalid arguments' });
    }
  } catch (err) {
    next(err);
  }
});

router.patch('/project/*/todo/:todo/title', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const todo_id = Number(req.params.todo);
  const title: string = req.body.title;
  try {
    if (await Todo.setTitle(title, todo_id, company_id)) {
      res.status(200).send({ message: 'success' });
    } else {
      res.status(400).send({ message: 'Invalid arguments' });
    }
  } catch (err) {
    next(err);
  }
});

router.patch('/project/*/todo/:todo/sprint', async (req, res, next) => {
  const company_id = (req.session as sessionParamsWithCompany)?.passport?.user?.company_id;
  const todo_id = Number(req.params.todo);
  const sprint_id = Number(req.body.sprint);
  try {
    if (await Todo.setSprint(sprint_id, todo_id, company_id)) {
      res.status(200).send({ message: 'success' });
    } else {
      res.status(400).send({ message: 'Invalid arguments' });
    }
  } catch (err) {
    next(err);
  }
});

export default router;

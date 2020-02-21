const express = require('express');

const server = express();
const projects = [];
let numRequests = 0;

// count number of requests
const requestCounter = (req, res, next) => {
  numRequests++;
  console.log('Requests counter:', numRequests);

  next();
}

// verify project id
const checkProjectId = (req, res, next) => {
  const projectIndex = projects.findIndex(project => project.id == req.params.id);
  if(projectIndex === -1)
    return res.status(404).json({ error: "Project doesn't exists" });

  req.projectIndex = projectIndex;

  next();
}

server.use(express.json());
server.use(requestCounter);

// create a new project
server.post('/projects', (req, res) => {
  const projectIndex = projects.findIndex(project => project.id == req.body.id);
  if(projectIndex != -1)
    return res.status(403).json({ error: "Project id already exists" })

  projects.push(req.body);

  return res.json(projects);
})

// get all projects
server.get('/projects', (req, res) => {
  return res.json(projects);
})

// update project data
server.put('/projects/:id', checkProjectId, (req, res) => {
  projects[req.projectIndex].title = req.body.title;

  return res.json(projects);
})

// remove projects 
server.delete('/projects/:id', checkProjectId, (req, res) => {
  projects.splice(req.projectIndex, 1);

  return res.json(projects);
})

// create tasks for projects
server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
  const { title } = req.body;
  projects[req.projectIndex].tasks.push(title);

  return res.json(projects);
})

server.listen(3000);
const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/repositories/:id", checkRepositories);

const repositories = [];

function checkRepositories(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  request.repoIndex = repositoryIndex;
  request.repoId = id;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { repoId, repoIndex } = request;
  const { title, url, techs } = request.body;

  const repository = {
    id: repoId,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { repoIndex } = request;

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repoIndex } = request;

  repositories[repoIndex].likes++;

  return response.json(repositories[repoIndex]);
});

module.exports = app;

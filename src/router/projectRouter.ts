import express from "express";
import {
  addProject,
  deleteProject,
  getProjects,
  getSingleProject,
  updateProject,
} from "../controllers/projectAPI.js";

const projectRouter = express.Router();

projectRouter.post("/add-project", addProject);
projectRouter.get("/get-project", getProjects);
projectRouter.patch("/update-project/:id", updateProject);
projectRouter.delete("/delete-project/:id", deleteProject);
projectRouter.get("/get-project/:id", getSingleProject);

export default projectRouter;

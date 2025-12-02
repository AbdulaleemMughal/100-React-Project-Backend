import type { Response, Request } from "express";
import { Project } from "../model/Project.model.js";

export const addProject = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      languages,
      sourceCode,
      liveDemo,
      image,
      popularity,
    } = req.body;

    const newProject = new Project({
      name,
      description,
      languages,
      sourceCode,
      liveDemo,
      image,
      popularity,
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      message: "Project Added Successfully!",
      data: newProject,
    });
  } catch (err) {
    res.status(400).json({
      message:
        err instanceof Error ? err.message : "Error while adding the project.",
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const allProjects = await Project.find({});

    res.status(201).json({
      success: true,
      message: "All Project Getted.",
      data: allProjects,
    });
  } catch (err) {
    res.status(400).json({
      message:
        err instanceof Error ? err.message : "Error while getting the project.",
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      languages,
      sourceCode,
      liveDemo,
      image,
      popularity,
    } = req.body;

    const projectToUpdate = await Project.findById({ _id: id });

    if (!projectToUpdate) {
      throw new Error("No Project Found.");
    }

    if (name !== undefined) projectToUpdate.name = name;
    if (description !== undefined) projectToUpdate.description = description;
    if (languages !== undefined) projectToUpdate.languages = languages;
    if (sourceCode !== undefined) projectToUpdate.sourceCode = sourceCode;
    if (liveDemo !== undefined) projectToUpdate.liveDemo = liveDemo;
    if (image !== undefined) projectToUpdate.image = image;
    if (popularity !== undefined) projectToUpdate.popularity = popularity;

    await projectToUpdate.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      data: projectToUpdate,
    });
  } catch (err) {
    res.status(400).json({
      message:
        err instanceof Error
          ? err.message
          : "Error while Updating the project.",
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const projectToDelete = await Project.findByIdAndDelete({ _id: id });

    if (!projectToDelete) {
      throw new Error("No Project Found");
    }

    res
      .status(200)
      .json({ success: true, message: "Project deleting successfully!" });
  } catch (err) {
    res.status(400).json({
      message:
        err instanceof Error
          ? err.message
          : "Error while Updating the project.",
    });
  }
};

export const getSingleProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const singleProject = await Project.findById({ _id: id });

    if (!singleProject) {
      throw new Error("No Project Found");
    }

    res.status(200).json({
      success: true,
      message: "Project getted successfully!",
      data: singleProject,
    });
  } catch (err) {
    res.status(400).json({
      message:
        err instanceof Error
          ? err.message
          : "Error while getting single project.",
    });
  }
};

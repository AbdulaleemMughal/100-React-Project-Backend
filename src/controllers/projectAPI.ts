import type { Response, Request } from "express";
import { Project } from "../model/Project.model.js";
import type { UploadedFile } from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary environment variables");
}

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const addProject = async (req: Request, res: Response) => {
  try {
    const { name, description, languages, sourceCode, liveDemo, popularity } =
      req.body;

    const file = req.files?.image as UploadedFile;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required.",
      });
    }

    // Upload using promise-based API
    const result = await cloudinary.uploader.upload(file.tempFilePath);

    const newProject = new Project({
      name,
      description,
      languages,
      sourceCode,
      image: result.secure_url,
      liveDemo,
      popularity,
    });

    await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project Added Successfully!",
      data: newProject,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error while adding the project.",
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

    const projects = await Project.find({}).skip(offset).limit(limit);

    const total = await Project.countDocuments();

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully.",
      total,
      hasMore: offset + limit < total,
      data: projects,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Error while getting the projects.",
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, languages, sourceCode, liveDemo, popularity } =
      req.body;

    const file = req.files?.image as UploadedFile;

    const projectToUpdate = await Project.findById({ _id: id });

    if (!projectToUpdate) {
      throw new Error("No Project Found.");
    }

    if (name !== undefined) projectToUpdate.name = name;
    if (description !== undefined) projectToUpdate.description = description;
    if (languages !== undefined) projectToUpdate.languages = languages;
    if (sourceCode !== undefined) projectToUpdate.sourceCode = sourceCode;
    if (liveDemo !== undefined) projectToUpdate.liveDemo = liveDemo;
    if (popularity !== undefined) projectToUpdate.popularity = popularity;

    if (file) {
      cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Cloudinary error message" + err.message,
          });
        }
        if (result) {
          projectToUpdate.image = result.secure_url;
          await projectToUpdate.save();

          return res.status(200).json({
            success: true,
            message: "Project Updated!",
            user: projectToUpdate,
          });
        }
      });
    }

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

import { Router } from "express";
import mongoose from "mongoose";
import Blog from "../models/blog.js";

const blogsRouter = Router();

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  if (!blog.title) {
    return response.status(400).json({ error: "title is required" });
  }
  if (!blog.url) {
    return response.status(400).json({ error: "url is required" });
  }
  if (!blog.likes) {
    blog.likes = 0;
  }
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(400).json({ error: "invalid id" });
  }
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
  if (!deletedBlog) {
    return response.status(404).json({ error: "blog not found" });
  }
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(400).json({ error: "invalid id" });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  if (!updatedBlog) {
    return response.status(404).json({ error: "blog not found" });
  }
  response.status(200).json(updatedBlog);
});
export default blogsRouter;

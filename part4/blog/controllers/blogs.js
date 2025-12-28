import { Router } from "express";
import mongoose from "mongoose";
import Blog from "../models/blog.js";
import middleware from "../utils/middleware.js";

const blogsRouter = Router();

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

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
  
  blog.user = request.user._id;
  
  const savedBlog = await blog.save();
  await savedBlog.populate('user', { username: 1, name: 1 });
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(400).json({ error: "invalid id" });
  }

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: "unauthorized: only the creator can delete this blog" });
  }

  await Blog.findByIdAndDelete(request.params.id);
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
  ).populate('user', { username: 1, name: 1 });
  if (!updatedBlog) {
    return response.status(404).json({ error: "blog not found" });
  }
  response.status(200).json(updatedBlog);
});
export default blogsRouter;

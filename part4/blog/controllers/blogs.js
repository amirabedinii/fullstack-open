import { Router } from "express";
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

export default blogsRouter;

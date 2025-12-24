import mongoose from "mongoose";
import Blog from "../models/blog.js";
import config from "../utils/config.js";

export const setupDatabase = async (uri = config.MONGODB_URI) => {
  await mongoose.connect(uri, { family: 4 });
  await Blog.deleteMany({});
};

export const closeDatabase = async () => {
  await Blog.deleteMany({});
  await mongoose.connection.close();
};

export const initialBlogs = [
    {
      title: "Test Blog 1",
      author: "Author 1",
      url: "https://www.example.com",
      likes: 5,
    },
    {
      title: "Test Blog 2",
      author: "Author 2",
      url: "https://www.example.com",
      likes: 10,
    },
    {
      title: "Test Blog 3",
      author: "Author 3",
      url: "https://www.example.com",
      likes: 7,
    },
  ];

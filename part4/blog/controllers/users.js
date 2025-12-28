import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import config from "../utils/config.js";

const usersRouter = Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({
      error: "username and password are required",
    });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters long",
    });
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: "username must be at least 3 characters long",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, name, passwordHash });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return response.status(400).json({
        error: error.message,
      });
    }
    if (error.code === 11000) {
      return response.status(400).json({
        error: "username must be unique",
      });
    }
    throw error;
  }
});

usersRouter.post("/login", async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({
      error: "username and password are required",
    });
  }

  const user = await User.findOne({ username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.JWT_SECRET);

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  });
});

export default usersRouter;

import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import supertest from "supertest";
import app from "../app.js";
import Blog from "../models/blog.js";
import { setupDatabase, closeDatabase, initialBlogs } from "./test_helper.js";

const api = supertest(app);

describe("GET /api/blogs", () => {
  before(async () => {
    await setupDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  test("returns the correct amount of blog posts in JSON format", async () => {
    await Blog.insertMany(initialBlogs);

    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert(Array.isArray(response.body), "Response should be an array");

    assert.strictEqual(
      response.body.length,
      initialBlogs.length,
      `Expected ${initialBlogs.length} blogs, got ${response.body.length}`
    );

    await Blog.deleteMany({});
  });

  test("returns the correct id of blog posts in JSON format", async () => {
    await Blog.insertMany(initialBlogs);

    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert(Array.isArray(response.body), "Response should be an array");

    const blogsFromDb = await Blog.find({});

    response.body.forEach((blog) => {
      assert(blog.id, "Blog should have an id field");
      assert.strictEqual(typeof blog.id, "string", "id should be a string");
      assert.strictEqual(
        blog._id,
        undefined,
        "_id should not be present in JSON response"
      );

      const dbBlog = blogsFromDb.find((b) => b._id.toString() === blog.id);
      assert(dbBlog, `Blog with id ${blog.id} should exist in database`);
    });

    await Blog.deleteMany({});
  });
});

describe("POST /api/blogs", () => {
  before(async () => {
    await setupDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  test("creates a new blog post", async () => {
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.title, newBlog.title);
    assert.strictEqual(response.body.author, newBlog.author);
  });

  test("returns 400 if title is missing", async () => {
    const newBlog = {
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(400);

    assert.strictEqual(response.body.error, "title is required");
    await Blog.deleteMany({});
  });

  test("returns 400 if url is missing", async () => {
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      likes: 15,
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(400);

    assert.strictEqual(response.body.error, "url is required");
    await Blog.deleteMany({});
  });

  test("returns 201 if likes is missing", async () => {
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(201);

    assert.strictEqual(response.body.likes, 0);
    await Blog.deleteMany({});
  });
});

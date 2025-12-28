import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert";
import supertest from "supertest";
import app from "../app.js";
import Blog from "../models/blog.js";
import User from "../models/user.js";
import decodeToken from "../utils/decodeToken.js";
import { setupDatabase, closeDatabase, initialBlogs } from "./test_helper.js";

const api = supertest(app);

const createUserAndGetToken = async (username = "testuser", password = "password123", name = "Test User") => {
  if (username === "testuser") {
    username = `testuser_${Date.now()}_${Math.random()}`;
  }
  
  const user = {
    username,
    name,
    password,
  };

  await api.post("/api/users").send(user).expect(201);

  const loginResponse = await api
    .post("/api/users/login")
    .send({ username, password })
    .expect(200);

  return loginResponse.body.token;
};

describe("GET /api/blogs", () => {
  before(async () => {
    await setupDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
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

  test("returns blogs with populated user information", async () => {
    const token = await createUserAndGetToken();
    assert(token, "Token should be created");
    assert.strictEqual(typeof token, "string", "Token should be a string");
    
    const newBlog = {
      title: "Test Blog with User",
      author: "Author Test",
      url: "https://www.example.com",
      likes: 5,
    };

    const createResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    assert(createResponse.body.user, "Created blog should have user");

    const response = await api.get("/api/blogs").expect(200);

    assert(response.body.length > 0, "Should have at least one blog");
    const blog = response.body.find(b => b.id === createResponse.body.id);
    assert(blog, "Blog should exist in response");
    assert(blog.user, "Blog should have user information");
    assert(blog.user.username, "User should have username");
    assert(blog.user.name, "User should have name");
  });
});

describe("POST /api/blogs", () => {
  before(async () => {
    await setupDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("creates a new blog post with valid token", async () => {
    const token = await createUserAndGetToken();
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.title, newBlog.title);
    assert.strictEqual(response.body.author, newBlog.author);
    assert(response.body.user, "Blog should have user information");
    assert.strictEqual(response.body.user.username, decodeToken(token).username);

    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("returns 401 if token is missing", async () => {
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(401);

    assert.strictEqual(response.body.error, "token missing or invalid");
  });

  test("returns 401 if token is invalid", async () => {
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", "Bearer invalidtoken")
      .send(newBlog)
      .expect(401);

    assert(response.body.error);
  });

  test("returns 400 if title is missing", async () => {
    const token = await createUserAndGetToken();
    const newBlog = {
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    assert.strictEqual(response.body.error, "title is required");
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("returns 400 if url is missing", async () => {
    const token = await createUserAndGetToken();
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      likes: 15,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    assert.strictEqual(response.body.error, "url is required");
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("returns 201 if likes is missing (defaults to 0)", async () => {
    const token = await createUserAndGetToken();
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    assert.strictEqual(response.body.likes, 0);
    await Blog.deleteMany({});
    await User.deleteMany({});
  });
});

describe("DELETE /api/blogs/:id", () => {
  before(async () => {
    await setupDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("deletes a blog post when user is the creator", async () => {
    const token = await createUserAndGetToken();
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const createResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    await api
      .delete(`/api/blogs/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAfterDelete = await Blog.find({});
    assert.strictEqual(blogsAfterDelete.length, 0);
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("returns 401 if token is missing", async () => {
    const token = await createUserAndGetToken();
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const createResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const response = await api
      .delete(`/api/blogs/${createResponse.body.id}`)
      .expect(401);

    assert.strictEqual(response.body.error, "token missing or invalid");
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("returns 403 if user is not the creator", async () => {
    const token1 = await createUserAndGetToken("user1", "password123", "User 1");
    const token2 = await createUserAndGetToken("user2", "password123", "User 2");

    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const createResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token1}`)
      .send(newBlog)
      .expect(201);

    const response = await api
      .delete(`/api/blogs/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);

    assert.strictEqual(
      response.body.error,
      "unauthorized: only the creator can delete this blog"
    );

    const blogsAfterAttempt = await Blog.find({});
    assert.strictEqual(blogsAfterAttempt.length, 1, "Blog should still exist");

    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("returns 404 if blog post not found", async () => {
    const token = await createUserAndGetToken();
    const validButNonExistentId = "507f1f77bcf86cd799439011";

    const response = await api
      .delete(`/api/blogs/${validButNonExistentId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    assert.strictEqual(response.body.error, "blog not found");
    await User.deleteMany({});
  });

  test("returns 400 if id is invalid", async () => {
    const token = await createUserAndGetToken();

    const response = await api
      .delete("/api/blogs/123")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(response.body.error, "invalid id");
    await User.deleteMany({});
  });
});

describe("PUT /api/blogs/:id", () => {
  before(async () => {
    await setupDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("updates a blog post", async () => {
    const token = await createUserAndGetToken();
    const newBlog = {
      title: "Test Blog 4",
      author: "Author 4",
      url: "https://www.example.com",
      likes: 15,
    };

    const createResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const updatedBlog = {
      title: "Test Blog 5",
      author: "Author 5",
      url: "https://www.example.com",
      likes: 20,
    };

    await api
      .put(`/api/blogs/${createResponse.body.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAfterUpdate = await Blog.find({});
    assert.strictEqual(blogsAfterUpdate.length, 1);
    assert.strictEqual(blogsAfterUpdate[0].title, updatedBlog.title);
    assert.strictEqual(blogsAfterUpdate[0].author, updatedBlog.author);
    assert.strictEqual(blogsAfterUpdate[0].likes, updatedBlog.likes);
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("returns 404 if blog post not found", async () => {
    const validButNonExistentId = "507f1f77bcf86cd799439011";
    const response = await api.put(`/api/blogs/${validButNonExistentId}`).expect(404);

    assert.strictEqual(response.body.error, "blog not found");
    await Blog.deleteMany({});
  });

  test("returns 400 if id is invalid", async () => {
    const response = await api.put("/api/blogs/123").expect(400);

    assert.strictEqual(response.body.error, "invalid id");
    await Blog.deleteMany({});
  });
});

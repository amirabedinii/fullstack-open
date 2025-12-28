import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert";
import supertest from "supertest";
import app from "../app.js";
import User from "../models/user.js";
import { setupDatabase, closeDatabase } from "./test_helper.js";

const api = supertest(app);

describe("POST /api/users", () => {
  before(async () => {
    await setupDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("creates a new user with valid data", async () => {
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "password123",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.username, newUser.username);
    assert.strictEqual(response.body.name, newUser.name);
    assert.strictEqual(response.body.passwordHash, undefined);
    assert.strictEqual(response.body.password, undefined);

    // Check that we only have ONE user with THIS username
    const usersWithThisName = await User.find({ username: newUser.username });
    assert.strictEqual(usersWithThisName.length, 1);
  });

  test("returns 400 if username is missing", async () => {
    const newUser = {
      name: "Test User",
      password: "password123",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    assert(response.body.error);
    assert(response.body.error.includes("username"));

    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("returns 400 if password is missing", async () => {
    const newUser = {
      username: "testuser",
      name: "Test User",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    assert(response.body.error);
    assert(response.body.error.includes("password"));

    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("returns 400 if username is less than 3 characters", async () => {
    const newUser = {
      username: "ab",
      name: "Test User",
      password: "password123",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    assert(response.body.error);
    assert(response.body.error.includes("username") || response.body.error.includes("3"));

    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("returns 400 if password is less than 3 characters", async () => {
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "ab",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    assert.strictEqual(
      response.body.error,
      "password must be at least 3 characters long"
    );

    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("returns 400 if username is not unique", async () => {
    const newUser = {
      username: "uniquetestuser",
      name: "Test User",
      password: "password123",
    };

    const firstResponse = await api.post("/api/users").send(newUser).expect(201);
    assert.strictEqual(firstResponse.body.username, newUser.username);

    const usersAfterFirst = await User.find({});
    assert.strictEqual(usersAfterFirst.length, 1, "First user should be created");

    const response = await api.post("/api/users").send(newUser).expect(400);

    assert.strictEqual(response.body.error, "username must be unique");

    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 1);
  });
});


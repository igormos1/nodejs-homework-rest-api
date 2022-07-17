const mongoose = require("mongoose");
const request = require("supertest");
const { singin } = require("./auth");
const express = require("express");
require("dotenv").config();
const { DB_HOST } = process.env;
const logger = require("morgan");
const cors = require("cors");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.get("/api/auth/login/signin", singin);

describe("Connection", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);

    server = app.listen(3000, () => {
      console.log(" server running");
    });
  });

  test("Login", async () => {
    const response = await request(app).get("/api/auth/login/signin");
    expect(response.status).toBe(200);

    const { token, user } = response.body.data;
    expect(typeof token).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.subscription).toBe("string");
  });

  afterAll(() => {
    mongoose.disconnect();
    server.close();
  });
});
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Context } from "../src/modules/utils/@types";
import Users from "./modules/player/models/userModel";

dotenv.config();

const app = express();

const typeDefs = `
  type Query {
    test: String
  }

  type Mutation {
    register(password: String, userName: String, email: String): Boolean
    login(password: String, email: String): String
  }
`;

const resolvers = {
  Query: {
    test() {
      return "test";
    },
  },
  Mutation: {
    async register(
      _parent: undefined,
      {
        password,
        userName,
        email,
      }: { password: string; userName: string; email: string }
    ) {
      return await Users.register({ password, userName, email });
    },
    async login(
      _parent: undefined,
      { password, email }: { password: string; email: string }
    ) {
      return await Users.login({ password, email });
    },
  },
};

mongoose
  .connect(process.env.MONGO_URL || "")
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.error("err");
  });

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

app.use(express.json());

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization;

        if (token) {
          try {
            const tokendata = jwt.verify(token, "secret") as any;
            return { user: tokendata?.user };
          } catch {
            return { user: null };
          }
        }

        return { user: null };
      },
    })
  );

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

startServer();

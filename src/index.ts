import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import jwt from "jsonwebtoken";

import {
  bookSchemaTypes,
  bookSchemaQueries,
  bookSchemaMutations,
} from "../src/modules/book/graphql/schema";

import {
  userSchemaTypes,
  userSchemaMutations,
} from "../src/modules/auth/graphql/schema";

import { bookQueries } from "../src/modules/book/graphql/queries";

import { bookMutations } from "./modules/book/graphql/mutations";
import { bookCustomResolvers } from "./modules/book/graphql/resolver";

import { Context } from "../src/modules/utils/@types";
import { Book } from "./modules/book/@types";
import { userMutations } from "./modules/auth/graphql/mutations";

const app = express();

interface Player {
  firstName: string;
  age: number;
  height: number;
  active: boolean;
  favoriteBooks?: String[];
}

const typeDefs = `
  ${bookSchemaTypes}
  ${userSchemaTypes}

  type Player {
    firstName: String
    age: Int
    height: Float
    active: Boolean

    favoriteBooks: [Book]
  }
    
  type Query {
    ${bookSchemaQueries}
    players: [Player]
  }

  type Mutation {
    ${bookSchemaMutations}
    ${userSchemaMutations}
  }
`;

const players: Player[] = [
  {
    firstName: "Bat",
    age: 18,
    active: true,
    height: 6.7,
    favoriteBooks: ["The Awaksdsening", "City of Glass"],
  },
];

const resolvers = {
  Query: {
    ...bookQueries,

    players: () => {
      return players;
    },
  },

  Mutation: {
    ...bookMutations,
    ...userMutations,
  },

  Book: {
    ...bookCustomResolvers,
  },

  Player: {
    favoriteBooks: (parent: Player) => {
      const favoriteBooks: Book[] = [];

      return favoriteBooks;
    },
  },
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization;

        console.log(token);

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

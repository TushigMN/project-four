import { Context } from "../../utils/@types";
import { checkLogin } from "../../../modules/utils/checkLogin";
import { Book } from "../@types";

const books: Book[] = [
  {
    title: "The Awaksdsening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

export const bookQueries = {
  books: (_parent: undefined, _arg: undefined, { user }: Context) => {
    console.log(user);
    checkLogin(user);

    return books;
  },

  book: (_parent: undefined, args: { title: string }, { user }: Context) => {
    checkLogin(user);

    return books.find((book) => book.title === args.title);
  },
};

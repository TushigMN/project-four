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

export const bookMutations = {
  bookAdd: (_parent: undefined, args: { title: string; author: string }) => {
    books.push(args);

    return "Nom amjiltai nemlee";
  },
};

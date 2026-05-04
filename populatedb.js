#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres, bookinstances AND musicas to your database.'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Book = require("./models/book");
const Author = require("./models/author");
const Genre = require("./models/genre");
const BookInstance = require("./models/bookinstance");
const Musica = require("./models/musica"); // 1. Importação do novo modelo

const genres = [];
const authors = [];
const books = [];
const bookinstances = [];
const musicas = []; // 2. Array para armazenar as músicas criadas

const mongoose = require("mongoose");

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createAuthors();
  await createBooks();
  await createBookInstances();
  await createMusicas(); // 3. Chamada da função de criação de músicas
  console.log("Debug: Closing mongoose");
  await mongoose.connection.close();
}

// Funções auxiliares de criação
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function authorCreate(index, first_name, family_name, d_birth, d_death) {
  const authordetail = { first_name: first_name, family_name: family_name };
  if (d_birth != false) authordetail.date_of_birth = d_birth;
  if (d_death != false) authordetail.date_of_death = d_death;

  const author = new Author(authordetail);
  await author.save();
  authors[index] = author;
  console.log(`Added author: ${first_name} ${family_name}`);
}

async function bookCreate(index, title, summary, isbn, author, genre) {
  const bookdetail = { title, summary, author, isbn };
  if (genre != false) bookdetail.genre = genre;

  const book = new Book(bookdetail);
  await book.save();
  books[index] = book;
  console.log(`Added book: ${title}`);
}

// 4. Nova função auxiliar para Musica
async function musicaCreate(index, title, author, ano) {
  const musicadetail = { title, author, ano };
  const musica = new Musica(musicadetail);
  await musica.save();
  musicas[index] = musica;
  console.log(`Added musica: ${title}`);
}

async function bookInstanceCreate(index, book, imprint, due_back, status) {
  const bookinstancedetail = { book, imprint };
  if (due_back != false) bookinstancedetail.due_back = due_back;
  if (status != false) bookinstancedetail.status = status;

  const bookinstance = new BookInstance(bookinstancedetail);
  await bookinstance.save();
  bookinstances[index] = bookinstance;
  console.log(`Added bookinstance: ${imprint}`);
}

// Funções de população em massa
async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "Fantasy"),
    genreCreate(1, "Science Fiction"),
    genreCreate(2, "French Poetry"),
  ]);
}

async function createAuthors() {
  console.log("Adding authors");
  await Promise.all([
    authorCreate(0, "Patrick", "Rothfuss", "1973-06-06", false),
    authorCreate(1, "Ben", "Bova", "1932-11-8", false),
    authorCreate(2, "Isaac", "Asimov", "1920-01-02", "1992-04-06"),
    authorCreate(3, "Bob", "Billings", false, false),
    authorCreate(4, "Jim", "Jones", "1971-12-16", false),
  ]);
}

async function createBooks() {
  console.log("Adding Books");
  await Promise.all([
    bookCreate(0, "The Name of the Wind", "Summary...", "9781473211896", authors[0], [genres[0]]),
    bookCreate(1, "The Wise Man's Fear", "Summary...", "9788401352836", authors[0], [genres[0]]),
    bookCreate(5, "Test Book 1", "Summary...", "ISBN111111", authors[4], [genres[0]]),
  ]);
}

// 5. Nova função para popular as músicas
async function createMusicas() {
  console.log("Adding Musicas");
  await Promise.all([
    musicaCreate(0, "The Name of the Wind Soundtrack", authors[0], 2011),
    musicaCreate(1, "Starman", authors[1], 1972),
    musicaCreate(2, "Robot Blues", authors[2], 1950),
  ]);
}

async function createBookInstances() {
  console.log("Adding Book Instances");
  await Promise.all([
    bookInstanceCreate(0, books[0], "London Gollancz, 2014.", false, "Available"),
    bookInstanceCreate(1, books[1], " Gollancz, 2011.", false, "Loaned"),
  ]);
}
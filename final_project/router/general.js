const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }

  let userExists = users.filter(user => user.username === username).length > 0;

  if (userExists) {
    return res.status(400).json({ message: "L'utilisateur existe déjà" });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: "Utilisateur enregistré avec succès !" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
      try {
        const allBooks = await Promise.resolve(books);
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des livres" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async  (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await Promise.resolve(books[isbn]);
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Livre non trouvé" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération du livre" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
      const author = req.params.author;
    try {
        const allBooks = await Promise.resolve(Object.values(books));
        const filteredBooks = allBooks.filter(book => book.author === author);

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Aucun livre trouvé pour cet auteur" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des livres par auteur" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const allBooks = await Promise.resolve(Object.values(books));
        const filteredBooks = allBooks.filter(book => book.title === title);

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Aucun livre trouvé avec ce titre" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des livres par titre" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Livre non trouvé" });
  }
});

module.exports.general = public_users;

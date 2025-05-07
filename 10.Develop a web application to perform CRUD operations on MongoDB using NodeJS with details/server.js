const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/BookDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const bookSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  author: String
});

const Book = mongoose.model("Book", bookSchema);

// Serve HTML page
app.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "index.html"), "utf8", (err, data) => {
    res.send(data);
  });
});

app.post("/save", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.send("Book Saved");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

app.get("/show", async (req, res) => {
  const book = await Book.findOne({ id: req.query.id });
  res.send(book || "Book not found");
});

app.get("/showall", async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

app.post("/update", async (req, res) => {
  const { id, title, author } = req.body;
  const updated = await Book.findOneAndUpdate({ id }, { title, author }, { new: true });
  res.send(updated || "Book not found");
});

app.post("/delete", async (req, res) => {
  const deleted = await Book.findOneAndDelete({ id: req.body.id });
  res.send(deleted ? "Book deleted" : "Book not found");
});

app.listen(8080, () => console.log("Server running on http://localhost:8080"));

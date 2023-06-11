/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";


const Book = require("../model").Book;

module.exports = function (app) {
  app
    .route("/api/books")

    //GET ALL BOOKS
    .get(async function (req, res) {

      try {
        const books = await Book.find().select("-__v");
        console.log(books);
        res.json(books);
      } catch (error) {
        console.log(error);
      }
    })

    //POST ONE BOOK
    .post(async function (req, res) {
      let title = req.body.title;
     
      const book = {
        title: title,
      };
      if (!title) {
        res.send("missing required field title");
        return;
      } else {
        try {
          const newBook = new Book(book);
          await newBook.save();
          const result = await Book.findById(newBook._id).select("_id title");
          res.json(result);
        } catch (error) {
          console.log(error);
        }
      }
    })

    //DELETE ALL BOOKS
    .delete(async function (req, res) {
      
      try {
        const result = await Book.deleteMany();
        console.log(result.deletedCount);
        res.send("complete delete successful");
      } catch (error) {
        console.log(error);
      }
    });

  app
    .route("/api/books/:id")

    //GET ONE BOOK
    .get(async function (req, res) {
      let bookid = req.params.id;
     
      try {
        const book = await Book.findById(bookid, "_id title comments");
        if (book) {
          console.log(book);
          res.json(book);
        } else {
          res.send("no book exists");
        }
      } catch (error) {
        console.log(error);
        res.send("no book exists");
      }
    })

    //POST A COMMENT
    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      if (!comment) {
        res.send("missing required field comment");
        return;
      } else {
        try {
          const book = await Book.findById(bookid)
          if (book) {
            book.comments.push(comment)
            book.commentcount = book.commentcount + 1
            book.save();
            res.json(book);
          } else {
          res.send("no book exists");
        }
        } catch (error) {
          console.log(error)
          res.send("no book exists");
        }
      }

    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      try {
        const book = await Book.findByIdAndRemove(bookid)
        if (book) {
          res.send("delete successful");
        } else {
          res.send("no book exists");
        }
      } catch (error) {
        console.log(error);
        res.send("no book exists");
      }

    });
};

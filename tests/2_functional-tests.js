/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
let firstId;
suite("Functional Tests", function () {


  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          let book = {
            title: "Superman",
          };
          chai
            .request(server)
            .post("/api/books")
            .send(book)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "title", "Book should have title");
              assert.equal(res.body.title, "Superman");
              firstId = res.body._id;
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          let book = {};
          chai
            .request(server)
            .post("/api/books")
            .send(book)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/:id")
          .query({
            _id: 4,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${firstId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id", "book should have property _id");
            assert.equal(res.body._id, firstId);
            assert.property(
              res.body,
              "title",
              "book should have property title"
            );
            assert.property(
              res.body,
              "comments",
              "book should have property comments"
            );
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          let comment = {
            comment: "Very good",
          };
          chai
            .request(server)
            .post(`/api/books/${firstId}`)
            .send(comment)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "_id", "book should have property _id");
              assert.equal(res.body._id, firstId);
              assert.property(
                res.body,
                "comments",
                "book should have property comments"
              );
              assert.equal(res.body.comments[0], "Very good");
              assert.property(
                res.body,
                "title",
                "book should have property title"
              );
              assert.equal(res.body.title, "Superman");
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post(`/api/books/${firstId}`)
            .send()
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/4")
            .send({ comment: "very good" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/${firstId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/4")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
  //evitar que la app se cuelgue en replit
  after(function () {
    chai.request(server).get("/");
  });
});

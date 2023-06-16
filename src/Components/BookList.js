import React, { useEffect, useState } from "react";
import { Grid, Pagination, CssBaseline } from "@mui/material";
import axios from "axios";
import { auth } from "../firebase";
import { useSelector } from "react-redux";

import BookItem from "./BookItem";
import Loading from "./Loading";
import { selectUser } from "../features/userSlice";

const BookList = () => {
  const [loading, setLoading] = useState(true);
  const [loadedBooks, setLoadedBooks] = useState();
  const [favoritesBooks, setFavoritesBooks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const user = useSelector(selectUser);

  useEffect(() => {
    setLoading(true);
    setLoadedBooks(); // We clean old data on transitions to different pages.
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + `/books?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${auth.currentUser.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPageCount(response.data.pageCount);
        setLoadedBooks(response.data.books);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, [currentPage]);

  useEffect(() => {
    setLoading(true);
    setFavoritesBooks({}); // We clean old data on transitions to different pages.
    async function fetchFavoritesBooks() {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL +
          `/books/favorites?page=${currentPage}`,
        {
          userId: user.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.currentUser.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const favoritesBooksObj = {};

      response.data.favoritebooks.forEach((favorite) => {
        favoritesBooksObj[favorite._id] = true;
      });
      setFavoritesBooks(favoritesBooksObj);
      setLoading(false);
    }
    fetchFavoritesBooks();
  }, [user.uid, currentPage]);

  const toggleFavorite = async (bookId) => {
    try {
      if (!favoritesBooks[bookId]) {
        setFavoritesBooks({ ...favoritesBooks, [bookId]: true });
      } else {
        setFavoritesBooks({ ...favoritesBooks, [bookId]: false });
      }

      await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/books/addfavorite",
        {
          userId: user.uid,
          bookId: bookId,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.currentUser.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <React.Fragment>
     
      <Grid sx={{ flexGrow: 1, marginTop: 8}} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {!loading && loadedBooks ? (
              loadedBooks.map((book) => (
                <Grid key={book._id} item padding={2}>
                  <BookItem
                    name={book.name}
                    imageUrl={book.image}
                    author={book.author}
                    description={
                      book.description <= 165
                        ? book.description
                        : book.description.substring(0, 172) + "..."
                    }
                    isFavorite={favoritesBooks[book._id]}
                    toggleFavorite={() => toggleFavorite(book._id)}
                    bookDetails={`/books/${book._id}`}
                  />
                </Grid>
              ))
            ) : (
              <Loading />
            )}
          </Grid>
          {loadedBooks && (
            <Pagination
              page={currentPage}
              onChange={handlePageChange}
              count={pageCount}
              variant="outlined"
              color="primary"
              shape="rounded"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 2,
              }}
            />
          )}
        </Grid>
      </Grid>
      <CssBaseline />
    </React.Fragment>
  );
};

export default BookList;

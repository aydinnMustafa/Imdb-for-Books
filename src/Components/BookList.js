import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
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

  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/books/",
          {
            headers: {
              Authorization: `Bearer ${auth.currentUser.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLoadedBooks(response.data.books);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    async function fetchFavoritesBooks() {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/books/favorites",
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
      console.log(response.data.favoritebooks);
      response.data.favoritebooks.forEach((favorite) => {
        favoritesBooksObj[favorite._id] = true;
      });
      setFavoritesBooks(favoritesBooksObj);
      setLoading(false);
    }
    fetchFavoritesBooks();
  }, [user.uid]);

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

  return (
    <React.Fragment>
      {loading && <Loading />}

      <Grid sx={{ flexGrow: 1, marginTop: 8 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={"2"}>
            {!loading &&
              loadedBooks &&
              loadedBooks.map((book) => (
                <Grid key={book._id} item padding={2}>
                  <BookItem
                    name={book.name}
                    imageUrl={book.image}
                    author={book.author}
                    description={
                      book.description <= 165
                        ? book.description
                        : book.description.substring(0, 165) + "..."
                    }
                    isFavorite={favoritesBooks[book._id]}
                    toggleFavorite={() => toggleFavorite(book._id)}
                    bookDetails={`/books/${book._id}`}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default BookList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

import BookItem from "../Components/BookItem";
import Loading from "../Components/Loading";
import Navbar from "../Components/Navbar";
import { selectUser } from "../features/userSlice";

function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [favoriteBooks, setFavoriteBooks] = useState();

  const user = useSelector(selectUser);
  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/books/favorites",
          {
            userId: user.uid,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setFavoriteBooks(response.data.favoritebooks);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavoriteBooks();
  }, [user.uid]);

  return (
    <React.Fragment>
      {loading && <Loading />}
      <Navbar />
      <Grid sx={{ flexGrow: 1, marginTop: 8 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={"2"}>
            {favoriteBooks && favoriteBooks.length > 0 ? (
              favoriteBooks.map((book) => (
                <Grid key={book._id} item padding={2}>
                  <BookItem
                    key={book.id}
                    name={book.name}
                    author={book.author}
                    description={
                      book.description <= 165
                        ? book.description
                        : book.description.substring(0, 165) + "..."
                    }
                    imageUrl={book.image}
                    isFavorite={book.isFavorite}
                  />
                </Grid>
              ))
            ) : (
              <h3>You haven't added any books to your favorites yet.</h3>
            )}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default FavoritesPage;

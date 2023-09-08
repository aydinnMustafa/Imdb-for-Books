import React, { useEffect, useState } from "react";
import { https } from "../features/http-common";
import { auth } from "../firebase";
import { Grid, Pagination, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";

import BookItem from "../Components/BookItem";
import Loading from "../Components/Loading";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { selectUser } from "../features/userSlice";

function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const [loadedFavoritesBooks, setLoadedFavoritesBooks] = useState();
  const [favoritesBooks, setFavoritesBooks] = useState({});

  const user = useSelector(selectUser);
  useEffect(() => {
    setLoading(true);
    setFavoritesBooks({}); // We clean old data on transitions to different pages.
    const fetchFavoriteBooks = async () => {
      try {
        const response = await https(auth.currentUser.accessToken).post(
          `/books/favorites?page=${currentPage}`,
          {
            userId: user.uid,
          }
        );
        setPageCount(response.data.pageCount);
        setLoadedFavoritesBooks(response.data.favoritebooks);
        const favoritesBooksObj = {};
        response.data.favoritebooks.forEach((favorite) => {
          favoritesBooksObj[favorite._id] = true;
        });
        setFavoritesBooks(favoritesBooksObj);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavoriteBooks();
  }, [user.uid, currentPage]);
  const toggleFavorite = async (bookId) => {
    try {
      if (!favoritesBooks[bookId]) {
        setFavoritesBooks({ ...favoritesBooks, [bookId]: true });
      } else {
        setFavoritesBooks({ ...favoritesBooks, [bookId]: false });
      }

      await https(auth.currentUser.accessToken).post("/books/addfavorite", {
        userId: user.uid,
        bookId: bookId,
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <React.Fragment>
      {loading && <Loading />}
      <Navbar />
      <Grid sx={{ flexGrow: 1, marginTop: 8 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {!loading && loadedFavoritesBooks && loadedFavoritesBooks.length > 0
              ? loadedFavoritesBooks.map((book) => (
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
              : !loading && (
                  <h3>You haven't added any books to your favorites yet.</h3>
                )}
          </Grid>
          {Object.keys(favoritesBooks).length !== 0 && (
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
      {Object.keys(favoritesBooks).length !== 0 && <Footer />}
    </React.Fragment>
  );
}

export default FavoritesPage;

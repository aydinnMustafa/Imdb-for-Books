import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { https } from "../features/http-common";
import { auth } from "../firebase";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Grid,
  useMediaQuery,
} from "@mui/material";

import Loading from "../Components/Loading";
import Navbar from "../Components/Navbar";

const BookDetail = () => {
  const { id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await https(auth.currentUser.accessToken).get(
          `/books/${id}`
        );
        setBookDetails(response.data.book);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookDetails();
  }, [id]);

  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  return (
    <React.Fragment>
      <Navbar />
      {!bookDetails && <Loading />}
      <Container maxWidth="xl" sx={{ marginTop: "75px" }}>
        <Card sx={{ width: "100%", minHeight: "82vh" }}>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                height={isSmallScreen ? 400 : 635}
                image={bookDetails && bookDetails.image}
                onError={(e) => {
                  e.target.src = require("../assets/default-book-cover.png");
                }}
                alt={bookDetails && bookDetails.name}
                sx={{
                  objectFit: "contain",
                  marginRight: isSmallScreen ? 6 : 10,
                  marginTop: 1,
                  marginBottom: "3px",
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={8}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {bookDetails && bookDetails.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookDetails && bookDetails.author}
                </Typography>
                <Rating
                  name="read-only"
                  value={bookDetails && bookDetails.star}
                  readOnly
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: 2, whiteSpace: "pre-line" }}
                >
                  {bookDetails && bookDetails.description}
                </Typography>
                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="body2" color="text.secondary">
                      Publisher: {bookDetails && bookDetails.publisher}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="body2" color="text.secondary">
                      Language: {bookDetails && bookDetails.language}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="body2" color="text.secondary">
                      Page: {bookDetails && bookDetails.pages}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </React.Fragment>
  );
};

export default BookDetail;

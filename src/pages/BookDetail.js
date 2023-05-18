import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Grid,
} from "@mui/material";

import Loading from "../Components/Loading";
import Navbar from "../Components/Navbar";

const BookDetail = () => {
  const { id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/books/${id}`
        );
        setBookDetails(response.data.book);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookDetails();
  }, [id]);
  console.log(bookDetails);
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
                height={635}
                image={bookDetails && bookDetails.image}
                alt="The Catcher in the Rye"
                sx={{
                  objectFit: "contain",
                  marginRight: 10,
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
                <Rating name="read-only" value={bookDetails && bookDetails.star} readOnly />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: 2 }}
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
        {/* <Box
          sx={{
            border: "2px solid #000",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFF",
            padding: "20px",
            minHeight: "82vh"
          }}
        >
          <Box sx={{ marginTop: "100px" }}>
      <img
        src={bookDetails && bookDetails.image}
        alt={bookDetails && bookDetails.name}
        style={{ width: "200px", height: "auto" }}
      />
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, textAlign: "center" }}>
      <Typography variant="h4" component="h2">
        {bookDetails && bookDetails.name}
      </Typography>
      <Typography variant="subtitle1" component="p" gutterBottom>
        {bookDetails && bookDetails.author}
      </Typography>
      <Typography variant="body1" component="p" sx={{
    maxWidth: "300px", // İstediğiniz genişliği burada belirleyebilirsiniz
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }}>
        {bookDetails && bookDetails.description}
      </Typography>
      <Typography variant="body1" component="p">
        {bookDetails && bookDetails.publisher}
      </Typography>
      <Typography variant="body1" component="p">
        {bookDetails && bookDetails.page}
      </Typography>
    </Box>
  </Box> */}
      </Container>
    </React.Fragment>
  );
};

export default BookDetail;

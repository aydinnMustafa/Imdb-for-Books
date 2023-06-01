import React, { useState } from "react";
import {
  Container,
  Card,
  Box,
  TextField,
  Typography,
  Rating,
  Grid,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import Loading from "../../Components/Loading";
import AddBoxIcon from "@mui/icons-material/AddBox";
import axios from "axios";
import { auth } from "../../firebase";

const NewBookPage = () => {
  const userId = auth.currentUser.uid;
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState({
    name: "",
    author: "",
    publisher: "",
    star: 0,
    image: "",
    language: "",
    pages: "",
    description: "",
  });
  const [errorMessages, setErrorMessages] = useState({
    name: null,
    author: null,
    publisher: null,
    star: null,
    image: null,
    language: null,
    pages: null,
    description: null,
  });
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };
  const handleChange = (event) => {
    setBookData((prevState) => ({
      ...prevState,
      [event.target.name]:
        event.target.name === "star"
          ? parseInt(event.target.value)
          : event.target.value, // Since [event.target.name] takes all values as strings, we convert the star value to number.
    }));
    setErrorMessages((prevState) => ({
      ...prevState,
      [event.target.name]: "",
    }));
  };
  const handleAddBook = async () => {
    const errorMessages = {
      name: !bookData.name ? "Name cannot be empty" : "",
      author: !bookData.author ? "Author cannot be empty" : "",
      publisher: !bookData.publisher ? "Publisher cannot be empty." : "",
      image: !bookData.image ? "Image cannot be empty." : "",
      language: !bookData.language ? "Language cannot be empty." : "",
      pages: !bookData.pages ? "Number of pages cannot be empty" : "",
      description:
        bookData.description.length < 100
          ? "Description must be at least 100 characters."
          : "",
    };

    setErrorMessages(errorMessages);

    // hata mesajlarının güncellendiğinden emin olmak için bekleyin
    await new Promise((resolve) => setTimeout(resolve, 0));

    // state'lerin güncellendiği son hallerini kullanarak submit işlemini gerçekleştirin
    const isFormValid = Object.values(errorMessages).every(
      (errorMsg) => errorMsg === ""
    );
    if (isFormValid) {
      setLoading(true);
      try {
        axios.post(
          process.env.REACT_APP_BACKEND_URL + `/books/add`,
          {
            userId: userId,
            name: bookData.name,
            author: bookData.author,
            publisher: bookData.publisher,
            star: bookData.star,
            description: bookData.description,
            image: bookData.image,
            language: bookData.language,
            pages: bookData.pages,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.currentUser.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLoading(false);
        setOpenAlert(true);
        setBookData({
          name: "",
          author: "",
          publisher: "",
          star: 0,
          image: "",
          language: "",
          pages: "",
          description: "",
        });
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <>
      <Container style={{ marginTop: "13vh" }}>
        <Card sx={{ height: 650 }}>
          {loading && <Loading asOverlay />}
          <Snackbar
            open={openAlert}
            autoHideDuration={2000}
            onClose={handleAlertClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{ marginTop: "60px" }}
          >
            <Alert
              onClose={handleAlertClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              The book has been successfully added.
            </Alert>
          </Snackbar>

          <Grid
            container
            sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}
          >
            <Box
              sx={{
                width: 1000,
                maxWidth: "90vw",
                bgcolor: "background.paper",
                borderRadius: 8,
                boxShadow: 5,
                p: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, mr: 2 }}>
                  <TextField
                    id="name"
                    name="name"
                    label="Name"
                    value={bookData.name}
                    sx={{ paddingBottom: 1 }}
                    fullWidth
                    error={errorMessages.name ? true : false}
                    helperText={errorMessages.name}
                    onChange={handleChange}
                  />
                  <TextField
                    id="author"
                    name="author"
                    label="Author"
                    value={bookData.author}
                    sx={{ paddingBottom: 1 }}
                    fullWidth
                    error={errorMessages.author ? true : false}
                    helperText={errorMessages.author}
                    onChange={handleChange}
                  />
                  <TextField
                    id="publisher"
                    name="publisher"
                    label="Publisher"
                    value={bookData.publisher}
                    sx={{ paddingBottom: 1 }}
                    fullWidth
                    error={errorMessages.publisher ? true : false}
                    helperText={errorMessages.publisher}
                    onChange={handleChange}
                  />

                  <TextField
                    id="image"
                    name="image"
                    label="Image Url"
                    value={bookData.image}
                    sx={{ paddingBottom: 1 }}
                    fullWidth
                    error={errorMessages.image ? true : false}
                    helperText={errorMessages.image}
                    onChange={handleChange}
                  />
                  <TextField
                    id="language"
                    name="language"
                    label="Language"
                    sx={{ paddingBottom: 1 }}
                    fullWidth
                    error={errorMessages.language ? true : false}
                    helperText={errorMessages.language}
                    onChange={handleChange}
                  />
                  <TextField
                    id="pages"
                    name="pages"
                    label="Pages"
                    value={bookData.pages}
                    type="number"
                    sx={{ paddingBottom: 1 }}
                    fullWidth
                    error={errorMessages.pages ? true : false}
                    helperText={errorMessages.pages}
                    onChange={handleChange}
                  />
                  <Typography
                    variant="body1"
                    display="inline"
                    sx={{ marginLeft: "4px" }}
                  >
                    Star:
                    <Rating
                      id="star"
                      name="star"
                      value={bookData.star}
                      precision={0.1}
                      style={{ verticalAlign: "top", marginLeft: 2 }}
                      onChange={handleChange}
                    />
                  </Typography>
                </Box>
                <Box sx={{ flex: "3 1" }}>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    value={bookData.description}
                    multiline
                    rows={17.7}
                    sx={{ paddingBottom: 1 }}
                    fullWidth
                    error={errorMessages.description ? true : false}
                    helperText={errorMessages.description}
                    onChange={handleChange}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 1.5,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleAddBook}
                      startIcon={<AddBoxIcon />}
                    >
                      ADD BOOK
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Card>
      </Container>
    </>
  );
};

export default NewBookPage;

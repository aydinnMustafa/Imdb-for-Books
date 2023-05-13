import React from "react";
import BookItem from "./BookItem";
import { Grid } from "@mui/material";

const BookList = () => {
  const books = [
    {
      id: 1,
      name: "Hasan ali yücel klasikleri",
      imageUrl:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1339392178i/37449.jpg",
      author: "Dostoyevski",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada mauris sed vestibulum fermentum. Nullam tristique quam non faucibus tempor.",
    },
    {
      id: 2,
      name: "Jules Verne",
      imageUrl:
        "https://img.kitapyurdu.com/v1/getImage/fn:1131388/wh:true/wi:220",
      author: "Dostoyevski",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada mauris sed vestibulum fermentum. Nullam tristique quam non faucibus tempor.",
    },
    {
      id: 3,
      name: "Jules Verne",
      imageUrl:
        "https://img.kitapyurdu.com/v1/getImage/fn:11683092/wh:true/wi:220",
      author: "Dostoyevski",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada mauris sed vestibulum fermentum. Nullam tristique quam non faucibus tempor.",
    },
    {
      id: 4,
      name: "Jules Verne",
      imageUrl:
        "https://img.kitapyurdu.com/v1/getImage/fn:11664066/wh:true/wi:220",
      author: "Dostoyevski",
      description:
        "Lorem ipsum dolor sit amet, consecttristique quam non faucibus tempor.",
    },
    {
      id: 5,
      name: "Jules Verne",
      imageUrl:
        "https://img.kitapyurdu.com/v1/getImage/fn:11614703/wh:true/wi:220",
      author: "Dostoyevski",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada mauris sed vestibulum fermentum. Nullam tristique quam non faucibus tempor.",
    },
    {
      id: 6,
      name: "Jules Verne",
      imageUrl:
        "https://img.kitapyurdu.com/v1/getImage/fn:11705732/wh:true/wi:220",
      author: "Dostoyevski",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada mauris sed vestibulum fermentum. Nullam tristique quam non faucibus tempor.",
    },
    {
      id: 7,
      name: "Jules Verne",
      author: "Dostoyevski",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada mauris sed vestibulum fermentum. Nullam tristique quam non faucibus tempor.",
    },
  ];


  
  return (
    <React.Fragment>
      <Grid sx={{ flexGrow: 1, marginTop: 8 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={"2"}>
            {books.map((book) => (
              <Grid key={book.id} item padding={2}>
                <BookItem
                  key={book.id}
                  name={book.name}
                  imageUrl={book.imageUrl}
                  author={book.author}
                  description={book.description}
                  
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

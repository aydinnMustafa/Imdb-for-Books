import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";
function BookItem(props) {
  const { name, author, description, imageUrl, bookDetails } = props;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        maxWidth: 320,
        border: "solid 2px gray",
        borderRadius: 2,
      }}
    >
      <Link
        to={bookDetails}
        style={{ color: "inherit", textDecoration: "none" }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Book Cover"
          sx={{
            maxHeight: 330,
            objectFit: "fill",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: 2,
            paddingRight: 2,
          }}
        />
      </Link>
      <CardActions>
        <IconButton
          aria-label="Add to favorites"
          onClick={() => {
            props.toggleFavorite();
          }}
        >
          {props.isFavorite ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default BookItem;

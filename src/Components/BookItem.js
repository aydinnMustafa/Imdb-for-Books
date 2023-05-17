import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
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
        minHeight: 435,
        border: "solid 2px gray",
        borderRadius: 2,
      }}
    >
      <Link to={bookDetails} style={{color: "inherit", textDecoration: "none"}}>
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
          image={
            imageUrl ||
            "https://img.kitapyurdu.com/v1/getImage/fn:1030555/wh:true/wi:220"
          }
          alt="Paella dish"
          sx={{ maxHeight: 400, objectFit: "contain", mx: "auto" }}
        />
      </Link>
      <CardActions>
        <IconButton
          aria-label="add to favorites"
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
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default BookItem;

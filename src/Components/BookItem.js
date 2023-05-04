import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function BookItem(props) {
  const {
    avatarText,
    name,
    subheader,
    description,
    imageUrl,
  } = props;

  return (
    <Card
      sx={{
        minHeight: 435,
        maxWidth: 345,
        border: "solid 2px gray",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {avatarText}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader={subheader}
      />
      <CardMedia
        component="img"
        image={
          imageUrl ||
          "https://img.kitapyurdu.com/v1/getImage/fn:1030555/wh:true/wi:220"
        }
        alt="Paella dish"
        style={{ objectFit: "cover", maxBlockSize: 500 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default BookItem;

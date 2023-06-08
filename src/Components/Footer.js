import React from "react";
import { Typography, CssBaseline, Grid, Box } from "@mui/material";
import { GitHub, LinkedIn, Email, AutoStories } from "@mui/icons-material";

const Footer = () => {
  return (
    <Grid container>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        sx={{
          height: "130px",
          width: "100%",
          backgroundColor: (theme) => theme.palette.grey[200],
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <AutoStories />
          <Box marginLeft={1} marginRight={3}>
            <Typography variant="h7" style={{ fontFamily: "Lobster" }}>
              <span style={{ display: "block" }}>Imdb</span>
              <span style={{ display: "block", marginLeft: 5 }}>For Books</span>
            </Typography>
          </Box>
        </Box>
        <Grid alignItems="baseline" sx={{ flexDirection: "column" }}>
          <a
            href="https://github.com/aydinnMustafa"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "black" }}
          >
            <Grid item sx={{ display: "flex", flexDirection: "row" }}>
              <GitHub sx={{ color: "black", fontSize: 30 }} />
              /aydinnMustafa
            </Grid>
          </a>

          <a
            href="https://www.linkedin.com/in/mustafa-aydin0/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "black" }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "row",
                textDecoration: "none",
              }}
            >
              <LinkedIn sx={{ color: "#0A66C2", fontSize: 30 }} />
              /mustafa-aydin0
            </Grid>
          </a>

          <Grid item sx={{ display: "flex", flexDirection: "row" }}>
            <Email sx={{ color: "#5F9B41", fontSize: 30 }} />
            <Typography>aydinmustafa9817@gmail.com</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Footer;

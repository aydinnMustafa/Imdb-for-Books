import React from "react";
import { AppBar, Toolbar, styled, Box, Typography, Link } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";


import AccountPopover from "./AccountPopover";

const Navbar = () => {
  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
  });
  const MenuBox = styled(Box)({
    display: "flex",
    gap: 30,
  });

  const MenuItems = [
    { id: 1, Name: "Books", Link: "/books" },
    { id: 2, Name: "Favorites", Link: "/favorites" },
  ];

  return (
    <AppBar
      sx={{
        backgroundImage: "linear-gradient( 135deg, #3B2667 10%, #BC78EC 100%);",
      }}
    >
      <StyledToolbar>
        <Box>
          <AutoStoriesIcon />
        </Box>
        <MenuBox>
          {MenuItems.map((item) => (
            <Typography key={item.id}>
              <Link
                sx={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#fff",
                  textDecoration: "none",
                }}
                href={item.Link}
              >
                {item.Name}
              </Link>
            </Typography>
          ))}
        </MenuBox>

        <AccountPopover />
      </StyledToolbar>
    </AppBar>
  );
};
export default Navbar;

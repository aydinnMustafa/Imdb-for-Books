import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  styled,
  Box,
  Typography,
  Link,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import AccountPopover from "./AccountPopover";

import { AbilityContext } from "../features/can";

const Navbar = () => {
  const ability = useContext(AbilityContext);

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
    ability.can("read", "AdminPanel") && {
      id: 3,
      Name: "Admin Panel",
      Link: "/admin",
    },
  ];

  return (
    <AppBar
      sx={{
        backgroundImage: "linear-gradient( 135deg, #3B2667 10%, #BC78EC 100%);",
      }}
    >
      <StyledToolbar>
        <Link
          sx={{
            cursor: "pointer",
            color: "#fff",
            textDecoration: "none",
          }}
          href="/books"
        >
          <Box display="flex" alignItems="center">
            <AutoStoriesIcon />
            <Box marginLeft={1}>
              <Typography variant="h7" style={{ fontFamily: "Lobster" }}>
                <span style={{ display: "block" }}>Imdb</span>
                <span style={{ display: "block", marginLeft: 5 }}>
                  For Books
                </span>
              </Typography>
            </Box>
          </Box>
        </Link>
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

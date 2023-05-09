import React from "react";
import { AppBar, Toolbar, styled, Box, Typography, Link } from "@mui/material";
import { red } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";

import { selectUser } from "../features/userSlice";
import { onLogout } from "../firebase";

const Navbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  console.log(user);
  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    backgroundImage: "linear-gradient( 135deg, #3B2667 10%, #BC78EC 100%);",
  });
  const MenuBox = styled(Box)({
    display: "flex",
    gap: 30,
  });

  const MenuItems = [
    { Name: "Kitaplar", Link: "/books" },
    { Name: "Beğendiklerim", Link: "/likes" },
    { Name: "Ödünç alınanlar", Link: "/" },
  ];

 
const logoutHandler = () =>{
  onLogout(history,dispatch);
}

  return (
    <AppBar>
      <StyledToolbar>
        <Box>
          <AutoStoriesIcon />
        </Box>
        <MenuBox>
          {MenuItems.map((item) => (
            <Typography>
              <Link
                sx={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#fff",
                  textDecoration: "none"
                }}
                href={item.Link}
              >
                {item.Name}
              </Link>
              <Button onClick={logoutHandler}>BAS</Button>
            </Typography>
          ))}
        </MenuBox>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Avatar
            sx={{ bgcolor: red[500], cursor: "pointer" }}
            aria-label="recipe"
          >
            {user.displayName ? user.displayName.charAt(0) : ""}
          </Avatar>
          <Typography sx={{ fontSize: "14px", marginLeft: "8px" }}>
           {user.displayName ? user.displayName : "Yükleniyor..."}
          </Typography>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};
export default Navbar;

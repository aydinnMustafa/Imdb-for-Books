import PropTypes from "prop-types";
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
// @mui
import { styled, alpha } from "@mui/material/styles";
import { Box, Link, Drawer, Typography, Avatar } from "@mui/material";
// hooks
import useResponsive from "./useResponsive";
// components
import NavSection from "./nav-section/NavSection";
//

import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

import {
  SupervisedUserCircle,
  LibraryBooks,
  Analytics,
  AddCircleOutline,
} from "@mui/icons-material";
import DefaultAvatar from "../../assets/default-avatar.jpg";
import Logo from "../../assets/logo.png";
import { AbilityContext } from "../../features/can";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

function Nav({ openNav, onCloseNav }) {
  const ability = useContext(AbilityContext);
  const user = useSelector(selectUser);
  const { pathname } = useLocation();

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  

  const navConfig = [
    {
      title: "dashboard",
      path: "/admin",
      icon: <Analytics />,
    },
    ability.can("read", "User") && {
      title: "users",
      path: "/admin/users",
      icon: <SupervisedUserCircle />,
    },
    {
      title: "books",
      path: "/admin/books",
      icon: <LibraryBooks />,
    },
    {
      title: "new book",
      path: "/admin/newbook",
      icon: <AddCircleOutline />,
    },
  ].filter(Boolean);

  const renderContent = (
    <>
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <img src={Logo} alt="Imdb-For-Books" />
      </Box>

      <Box sx={{ mb: 2, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar
              src={DefaultAvatar}
              alt="defaultAvatar"
              sx={{ width: 60, height: 60 }}
            />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {user.displayName}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {user.role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

export default Nav;

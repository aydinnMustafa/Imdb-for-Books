import { useState, useContext } from "react";

import { styled } from "@mui/material/styles";

import Header from "../Components/Admin/Header";
import Nav from "../Components/Admin/Nav";
import UsersPage from "./Admin/UsersPage";
import BooksPage from "./Admin/BooksPage";
import DashboardPage from "./Admin/DashboardPage";
import NewBookPage from "./Admin/NewBookPage";
import { AbilityContext } from "../features/can";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function AdminPanel() {
  const ability = useContext(AbilityContext);
  const [open, setOpen] = useState(false);
  const isAdminUsersPage = window.location.pathname === "/admin/users";
  const isAdminBooksPage = window.location.pathname === "/admin/books";
  const isAdminDashboardPage = window.location.pathname === "/admin";
  const isAdminNewBookPage = window.location.pathname === "/admin/newbook";
  //AdminPanel's items are loaded according to pathname and user ability.
  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      {ability.can("read", "User") && isAdminUsersPage && <UsersPage />}
      {ability.can("read", "Book") && isAdminBooksPage && <BooksPage />}
      {ability.can("read", "AdminPanel") && isAdminDashboardPage && (
        <DashboardPage />
      )}
      {ability.can("create", "Book") && isAdminNewBookPage && <NewBookPage />}
      <Main></Main>
    </StyledRoot>
  );
}

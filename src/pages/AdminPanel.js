import { useState } from 'react';



// @mui
import { styled } from '@mui/material/styles';
//
import Header from '../Components/Admin/Header';
import Nav from '../Components/Admin/Nav';
import UsersPage from './Admin/UsersPage';
import BooksPage from './Admin/BooksPage';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const isAdminUsersPage = window.location.pathname === '/admin/users';
  const isAdminBooksPage = window.location.pathname === '/admin/books';
  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      {isAdminUsersPage && <UsersPage />}
      {isAdminBooksPage && <BooksPage />}
      <Main>
        
      </Main>
    </StyledRoot>
  );
}
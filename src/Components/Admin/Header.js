import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Drawer } from '@mui/material';
// utils
import { bgBlur } from './cssStyles';
// components
import AutoStoriesIcon from "@mui/icons-material/AutoStories";//
import AccountPopover from '../AccountPopover';


// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 54;

const HEADER_DESKTOP = 80;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  borderBottom: `1px dashed ${theme.palette.divider}`,
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <AutoStoriesIcon />
        </IconButton>

        
        <Box sx={{ flexGrow: 1 }} />
        
        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}

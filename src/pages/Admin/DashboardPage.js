import { Grid, Container, Typography } from '@mui/material';
import AppWidgetSummary from '../../Components/Admin/app/AppWidgetSummary';
import { SupervisedUserCircle, MenuBook, Book } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
const user = useSelector(selectUser);

  return (
    <>
      
        <title> Dashboard </title>
     

      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ mt: 12, mb: 6, fontFamily: "Roboto" }}>
          Welcome back, <span style={{ fontStyle: "italic",fontSize:"20px" }}>{user.displayName}</span>
        </Typography>
        
        <Grid container spacing={3}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary  title="Books" total={71} icon={<MenuBook />} bgcolor="#D1E9FC" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Users" total={13} color="info" icon={<SupervisedUserCircle />} bgcolor="#D0F2FF" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Favorite Books" total={172} color="warning" icon={<Book />} bgcolor="#FFF7CD" />
          </Grid>
          </Grid>
          

          
        </Grid>
      </Container>
    </>
  );
}
import React, { useEffect, useState, useCallback } from "react";
import { Grid, Container, Typography } from "@mui/material";
import AppWidgetSummary from "../../Components/Admin/app/AppWidgetSummary";
import { SupervisedUserCircle, MenuBook, Book } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { https } from "../../features/http-common";
import { auth } from "../../firebase";
import Loading from "../../Components/Loading";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [fetchError, setFetchError] = useState(false);
  const [dashboardData, setDashboardData] = useState();
  const user = useSelector(selectUser);
  const userToken = auth.currentUser.accessToken;

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await https(userToken).get("/admin/dashboard");

      setDashboardData(response.data);
    } catch (err) {
      setFetchError(true);
      console.error("An error occurred while fetching data.");
    }
  }, [userToken]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (!dashboardData) {
    if (fetchError) {
      return (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          An error occurred while loading books. Please try again by refreshing
          the page.
        </div>
      );
    } else {
      return (
        <div style={{ marginLeft: 500 }}>
          <Loading />
        </div>
      );
    }
  }

  return (
    <>
      <title> Dashboard </title>

      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ mt: 12, mb: 6, fontFamily: "Roboto" }}>
          Welcome back,{" "}
          <span style={{ fontStyle: "italic", fontSize: "20px" }}>
            {user.displayName}
          </span>
        </Typography>

        <Grid container spacing={3}>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Books"
                total={dashboardData.bookCount}
                color="primary"
                icon={<MenuBook />}
                bgcolor="#D1E9FC"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Users"
                total={dashboardData.userCount}
                color="info"
                icon={<SupervisedUserCircle />}
                bgcolor="#D0F2FF"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Favorite Books"
                total={dashboardData.favoriteBookCount}
                color="warning"
                icon={<Book />}
                bgcolor="#FFF7CD"
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

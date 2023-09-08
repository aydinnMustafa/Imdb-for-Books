import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import { FormHelperText } from "@mui/material";
import Stack from "@mui/material/Stack";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Avatar from "@mui/material/Avatar";
import useMediaQuery from "@mui/material/useMediaQuery";
import DefaultAvatar from "../assets/default-avatar.jpg";
import { https } from "../features/http-common";

import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";

import Loading from "../Components/Loading";
import Navbar from "../Components/Navbar";

function Profile() {
  const currentUser = auth.currentUser;
  const history = useHistory();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const handleClickCurrentShowPassword = () =>
    setShowCurrentPassword((show) => !show);
  const handleClickNewShowPassword = () => setShowNewPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [userData, setUserData] = useState({
    fullname: "",
    email_adress: "",
    currentPassword: "",
    newPassword: "",
    isSubmitting: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    fullname: null,
    email_adress: null,
    currentPassword: null,
    newPassword: null,
  });

  useEffect(() => {
    if (currentUser) {
      setUserData((prevState) => ({
        ...prevState,
        fullname: currentUser.displayName,
        email_adress: currentUser.email,
      }));
      setLoading(false);
    }
  }, [currentUser]);

  const handleChange = (event) => {
    setUserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    setErrorMessages((prevState) => ({
      ...prevState,
      [event.target.name]: "",
    }));
    setError("");
  };

  const handleUserUpdate = async (event) => {
    event.preventDefault();
    setUserData((prevUserData) => ({
      ...prevUserData,
      isSubmitting: true,
    }));

    const errorMessages = {
      fullname: !userData.fullname ? "Name surname cannot be empty." : "",
      email_adress: !userData.email_adress
        ? "Email cannot be empty."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email_adress)
        ? "Incorrect E-mail address."
        : "",
      currentPassword:
        userData.currentPassword.length < 6
          ? "Your password must consist of at least 6 characters."
          : "",
      newPassword:
        userData.newPassword.length < 6
          ? "Your new password must consist of at least 6 characters."
          : "",
    };

    setErrorMessages(errorMessages);

    const isFormValid = Object.values(errorMessages).every(
      (errorMsg) => errorMsg === ""
    );
    if (isFormValid) {
      setLoading(true);

      try {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          userData.currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);

        await https(auth.currentUser.accessToken).patch(
          `/users/${currentUser.uid}`,
          {
            fullname: userData.fullname,
            email: userData.email_adress,
          }
        );

        updateProfile(currentUser, {
          displayName: userData.fullname,
        });

        await updateEmail(currentUser, userData.email_adress);
        await updatePassword(currentUser, userData.newPassword);

        history.push("/auth");
      } catch (error) {
        const errorCode = error.code;
        setLoading(false);
        if (errorCode === "auth/email-already-in-use") {
          setError("Failed to update. Email already in use!");
        } else if (errorCode === "auth/wrong-password") {
          setError("Current password is wrong, please check!");
        } else {
          setError(error.response.data.error);
        }
      }
    }
  };
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  return (
    <React.Fragment>
      <Navbar />
      {loading === true && <Loading asOverlay />}

      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 9,
          }}
        >
          <Grid container>
            <CssBaseline />

            <Grid
              item
              xs={11}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
              }}
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  height: isSmallScreen ? "67vh" : "70vh",
                }}
              >
                <Avatar
                  src={DefaultAvatar}
                  sx={{
                    width: isSmallScreen ? 100 : 200,
                    height: isSmallScreen ? 100 : 200,
                    marginTop: -5,
                  }}
                />
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleUserUpdate}
                  sx={{ mt: 1, width: "100%" }}
                >
                  <FormControl
                    sx={{
                      mt: 0.5,
                      width: isSmallScreen ? "32ch" : "50ch",
                      paddingBottom: 0.5,
                    }}
                    variant="outlined"
                    error={errorMessages.fullname ? true : false}
                  >
                    <InputLabel htmlFor="fullname" required>
                      Name Surname
                    </InputLabel>
                    <OutlinedInput
                      id="fullname"
                      name="fullname"
                      type="text"
                      autoFocus
                      required
                      label="Name Surname"
                      value={userData.fullname}
                      onChange={handleChange}
                    />
                    <FormHelperText>{errorMessages.fullname}</FormHelperText>
                  </FormControl>
                  <FormControl
                    sx={{
                      mt: 0.5,
                      width: isSmallScreen ? "32ch" : "50ch",
                      paddingBottom: 0.5,
                    }}
                    variant="outlined"
                    error={errorMessages.email_adress ? true : false}
                  >
                    <InputLabel htmlFor="email_adress" required>
                      Email Adress
                    </InputLabel>
                    <OutlinedInput
                      id="email_adress"
                      name="email_adress"
                      type="email"
                      autoFocus
                      required
                      label="Email Adress"
                      value={userData.email_adress}
                      onChange={handleChange}
                    />
                    <FormHelperText>
                      {errorMessages.email_adress}
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    sx={{ mt: 0.5, width: isSmallScreen ? "32ch" : "50ch" }}
                    variant="outlined"
                    error={errorMessages.currentPassword ? true : false}
                  >
                    <InputLabel htmlFor="password" required>
                      Current Password
                    </InputLabel>
                    <OutlinedInput
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      autoFocus
                      required
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickCurrentShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showCurrentPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Current Password"
                    />
                    <FormHelperText>
                      {errorMessages.currentPassword}
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    sx={{ mt: 0.5, width: isSmallScreen ? "32ch" : "50ch" }}
                    variant="outlined"
                    error={errorMessages.newPassword ? true : false}
                  >
                    <InputLabel htmlFor="password" required>
                      New Password
                    </InputLabel>
                    <OutlinedInput
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      autoFocus
                      required
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickNewShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="New Password"
                    />
                    <FormHelperText>{errorMessages.newPassword}</FormHelperText>
                  </FormControl>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2.5, mb: 2 }}
                  >
                    UPDATE
                  </Button>
                  {error && (
                    <Stack>
                      <Alert severity="error">{error}</Alert>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
}
export default Profile;

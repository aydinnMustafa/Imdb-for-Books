import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import ParticlesBackground from "../Components/ParticlesBackground";
import { Typewriter } from "react-simple-typewriter";
import signupSVG from "../assets/signup-form.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Loading from "../Components/Loading";

import { FormHelperText } from "@mui/material";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

import { loginFunc, registerFunc, googleLogin } from "../firebase";

import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useHistory } from "react-router-dom";

function Login() {
  const history = useHistory();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [info, setInfo] = useState();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email_adress: "",
    password: "",
    isSubmitting: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    name: null,
    surname: null,
    email_adress: null,
    password: null,
  });

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
    setInfo("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUserData((prevUserData) => ({
      ...prevUserData,
      isSubmitting: true,
    }));

    // state'lerin güncellendiğinden emin olmak için bekleyin
    await new Promise((resolve) => setTimeout(resolve, 0));

    // state'lerin güncellendiği son hallerini kullanarak hataları kontrol edin
    const errorMessages = {
      name: !isLoginMode && !userData.name ? "Name cannot be empty." : "",
      surname:
        !isLoginMode && !userData.surname ? "Surname cannot be empty." : "",
      email_adress: !userData.email_adress
        ? "Email cannot be empty."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email_adress)
        ? "Incorrect E-mail address"
        : "",
      password:
        userData.password.length < 6
          ? "Your password must consist of at least 6 characters."
          : "",
    };

    setErrorMessages(errorMessages);

    // hata mesajlarının güncellendiğinden emin olmak için bekleyin
    await new Promise((resolve) => setTimeout(resolve, 0));

    // state'lerin güncellendiği son hallerini kullanarak submit işlemini gerçekleştirin
    const isFormValid = Object.values(errorMessages).every(
      (errorMsg) => errorMsg === ""
    );
    if (isFormValid) {
      if (isLoginMode) {
        loginFunc(
          auth,
          userData.email_adress,
          userData.password,
          history,
          setLoading,
          setError
        );
      } else {
        registerFunc(
          auth,
          userData.email_adress,
          userData.password,
          history,
          userData.name,
          userData.surname,
          setLoading,
          setError
        );
      }
    } else {
      console.log("Form is invalid.");
    }
  };

  const forgotPasswordHandler = () => {
    sendPasswordResetEmail(auth, userData.email_adress)
      .then(() => {
        setInfo("Email send! Please check.");
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        if (errorCode === "auth/missing-email") {
          setError("Please enter your email address first, then click.");
        } else if (errorCode === "auth/user-not-found") {
          setError("No user found with this email address.");
        } else {
          setError("Something wrong please try again later.");
        }
      });
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setUserData({
        ...userData,
        name: undefined,
        surname: undefined,
      });
      setErrorMessages({
        ...errorMessages,
        name: null,
        surname: null,
      });
    } else {
      setUserData({
        ...userData,
        name: "",
        surname: "",
      });
      setErrorMessages({
        ...errorMessages,
        name: null,
        surname: null,
      });
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const googleLoginHandler = () => {
    googleLogin(auth, history);
  };

  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  return (
    <React.Fragment>
      <ParticlesBackground />

      {loading === true && <Loading asOverlay />}

      <Container component="main" maxWidth="lg">
        {!isSmallScreen && (
          <Typography
            sx={{ position: "absolute", top: 40, left: 400, fontSize: "25px" }}
          >
            <Typewriter
              words={[
                "Welcome to the book review platform!",
                "Here you can find all the books you are curious about and want to review before buying.",
                "Easily sign up and start reviewing books.",
              ]}
              loop={10}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={25}
            />
          </Typography>
        )}
        <Box
          sx={{
            marginTop: isSmallScreen ? 4 : 10,
          }}
        >
          <Grid container>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: `url(${signupSVG})`,
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <Grid
              item
              xs={11}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 8,
                  mt: 2,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: isSmallScreen ? "77vh" : "70vh",
                }}
              >
                <Stack direction="row" alignItems="center">
                  <Switch
                    checked={!isLoginMode}
                    onChange={() => switchModeHandler()}
                    sx={{
                      width: isSmallScreen ? "33ch" : "50ch",
                      height: isSmallScreen ? "70px" : "100px",
                      "& .MuiSwitch-root.Mui-checked": {
                        bgcolor: "#21cc89",
                      },

                      "& .MuiSwitch-thumb": {
                        width: isSmallScreen ? "67px" : "96px",
                        height: isSmallScreen ? "52px" : "85px",
                        bgcolor: "#fff",
                      },
                      "& .MuiSwitch-track": {
                        borderRadius: "37px",
                        bgcolor: isLoginMode ? "#21cc89" : "#21cc89",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          bgcolor: isLoginMode ? "#21cc89" : "#21cc89",
                        },

                      "& .MuiSwitch-switchBase.Mui-checked": {
                        transform: isSmallScreen
                          ? "translateX(208px)"
                          : "translateX(333px)",
                      },
                    }}
                  />

                  <Typography
                    variant={isSmallScreen ? "h7" : "h5"}
                    onClick={switchModeHandler}
                    sx={{
                      position: "absolute",
                      marginLeft: isSmallScreen ? 3 : 3,
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </Typography>
                  <Typography
                    variant={isSmallScreen ? "h7" : "h5"}
                    sx={{
                      position: "absolute",
                      marginLeft: isSmallScreen ? 27.5 : 43.2,
                      cursor: "pointer",
                    }}
                    onClick={switchModeHandler}
                  >
                    Register
                  </Typography>
                </Stack>

                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <Box
                    variant="contained"
                    sx={{
                      mb: 1,
                      display: "flex",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Button variant="outlined" onClick={googleLoginHandler}>
                      <img
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="
                        alt="Google Sign-In"
                      />
                      &nbsp;
                      <Typography
                        sx={{ color: "black", fontWeight: "bold" }}
                        variant="caption"
                      >
                        Sign in with Google
                      </Typography>
                    </Button>
                  </Box>
                  {!isLoginMode && (
                    <div>
                      <FormControl
                        sx={{
                          mt: 0.5,
                          width: isSmallScreen ? "32ch" : "50ch",
                          paddingBottom: 0.5,
                        }}
                        variant="outlined"
                        error={errorMessages.name ? true : false}
                      >
                        <InputLabel htmlFor="name" required>
                          Name
                        </InputLabel>
                        <OutlinedInput
                          id="name"
                          name="name"
                          type="text"
                          autoFocus
                          required
                          label="Name"
                          onChange={handleChange}
                        />
                        <FormHelperText>{errorMessages.name}</FormHelperText>
                      </FormControl>
                      <FormControl
                        sx={{
                          mt: 0.5,
                          width: isSmallScreen ? "32ch" : "50ch",
                          paddingBottom: 0.5,
                        }}
                        variant="outlined"
                        error={errorMessages.surname ? true : false}
                      >
                        <InputLabel htmlFor="surname" required>
                          Surname
                        </InputLabel>
                        <OutlinedInput
                          id="surname"
                          name="surname"
                          type="text"
                          autoFocus
                          required
                          label="Surname"
                          onChange={handleChange}
                        />
                        <FormHelperText>{errorMessages.surname}</FormHelperText>
                      </FormControl>
                    </div>
                  )}
                  <FormControl
                    sx={{
                      mt: 0.5,
                      paddingBottom: 0.5,
                      width: isSmallScreen ? "32ch" : "50ch",
                    }}
                    variant="outlined"
                    error={errorMessages.email_adress ? true : false}
                  >
                    <InputLabel htmlFor="email_adress" required>
                      E-maill Adress
                    </InputLabel>
                    <OutlinedInput
                      id="email_adress"
                      name="email_adress"
                      type="email"
                      autoFocus
                      required
                      label="E-maill Adress"
                      onChange={handleChange}
                    />
                    <FormHelperText>
                      {errorMessages.email_adress}
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    sx={{
                      mt: 0.5,
                      width: isSmallScreen ? "32ch" : "50ch",
                    }}
                    variant="outlined"
                    error={errorMessages.password ? true : false}
                  >
                    <InputLabel htmlFor="password" required>
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoFocus
                      required
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                    <FormHelperText>{errorMessages.password}</FormHelperText>
                  </FormControl>
                  {isLoginMode && (
                    <Typography
                      variant="body2"
                      align="right"
                      sx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "#4287f5",
                      }}
                      onClick={forgotPasswordHandler}
                    >
                      Forgot password?
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2.5, mb: 2 }}
                  >
                    {isLoginMode ? "Login" : "Register"}
                  </Button>
                  {error && (
                    <Stack>
                      <Alert severity="error">{error}</Alert>
                    </Stack>
                  )}
                  {info && (
                    <Stack>
                      <Alert severity="success">{info}</Alert>
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
export default Login;
